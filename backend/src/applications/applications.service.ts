import { Injectable, BadRequestException, NotFoundException, Logger, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument, ApplicationStatus, ApplicationType } from './entities/application.schema';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { AssignApplicationDto } from './dto/assign-application.dto';
import { Certificate, CertificateDocument, certificateStatus } from '../certificates/entities/certificate.schema';
import { Company, CompanyDocument } from '../companies/entities/company.schema';
import { Role, User, UserDocument } from '../users/entities/user.schema';
import { generateCertificateId } from '../lib/generateCertificateId';
import { VendorsService } from '../vendors/vendors.service';
import { ActivityType } from '../vendors/entities/vendor-activity-log.schema';
import { Vendor, VendorDocument } from 'src/vendors/entities/vendor.schema';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction, AuditSeverity, EntityType } from '../audit-logs/entities/audit-log.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentDocument } from 'src/payments/entities/payment.schema';
import { Notification, NotificationDocument, NotificationRecipient, NotificationType, priority } from 'src/notifications/entities/notification.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    @InjectModel(Certificate.name) private certificateModel: Model<CertificateDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
    @InjectModel(Notification.name) private notificationModel:Model<NotificationDocument>,
    private vendorsService: VendorsService,
    private auditLogsService: AuditLogsService,
    private emailService: EmailService,
  ) {}

  async findAll(status?: ApplicationStatus, type?:ApplicationType, page: number = 1, limit: number = 10) {
    try {
      const filter: any = {};
      
      // Add status filter if provided
      if (status) {
        filter.currentStatus = status;
      }

      // add type filter if provided
      if(type){
        filter.type = type
      }
      
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Get total count for pagination metadata
      const total = await this.applicationModel.countDocuments(filter).exec();

      // Count applications by status
      const statusCounts = await this.applicationModel.aggregate([
        { $match: type ? { type } : {} }, // Apply type filter if provided, but count all statuses
        {
          $group: {
            _id: '$currentStatus',
            count: { $sum: 1 }
          }
        }
      ]).exec();

      // Transform status counts into a more readable format
      const countByStatus = statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {} as Record<string, number>);

      // Get specific status counts in parallel for better performance
      const [forwardedCount, approvedCount, rejectedCount] = await Promise.all([
        this.applicationModel.countDocuments({ currentStatus: ApplicationStatus.FORWARDED_TO_REGISTRAR }),
        this.applicationModel.countDocuments({ currentStatus: ApplicationStatus.APPROVED }),
        this.applicationModel.countDocuments({ currentStatus: ApplicationStatus.REJECTED })
      ]);
      
      // Get paginated results
      const applications = await this.applicationModel
        .find(filter)
        .populate({
          path: "companyId",
          populate: {
            path: "documents"
          }
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }) // Sort by newest first
        .exec();
      
      return {
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
        countByStatus: countByStatus,
        statusCounts: {
          forwardedToRegistrar: forwardedCount,
          approved: approvedCount,
          rejected: rejectedCount
        },
        applications: applications
      };
    } catch (err) {
      throw new BadRequestException('Failed to get applications', err.message);
    }
  }

  async findOne(id: string): Promise<Application> {
    try {
      const application = await this.applicationModel.findById(id).populate({
        path: "companyId",
        populate: [
          {
            path: "documents",
          },
          {
            path: "directors"
          }
        ]
      }).exec();
      
      if (!application) {
        throw new NotFoundException('Application not found');
      }
      
      return application;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException('Failed to get application', err.message);
    }
  }

  async findByAssignedTo(userId: string, page: number = 1, limit: number = 10) {
    try {
      const filter = { assignedTo: new Types.ObjectId(userId)};
      
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Get total count for pagination metadata
      const total = await this.applicationModel.countDocuments(filter).exec();
      
      // Get paginated results
      const applications = await this.applicationModel
        .find(filter)
        .populate({
          path: "companyId",
          populate: [
            {
              path: "documents",
            },
            {
              path:"directors"
            }
          ]
        })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }) // Sort by newest first
        .exec();
      
      return {
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
        applications: applications
      };
    } catch (err) {
      throw new BadRequestException('Failed to get assigned applications', err.message);
    }
  }

  async assignApplication(id: string, assignApplicationDto: AssignApplicationDto): Promise<Application | any> {
    try {
      // Find the application
      const application = await this.applicationModel.findById(id);
      if (!application) {
        throw new NotFoundException('Application not found');
      }

      // Verify the user exists
      const user = await this.userModel.findById(assignApplicationDto.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const previouslyAssignedTo = application.assignedTo?.toString();
      const newAssignedTo = assignApplicationDto.userId;

      // If application was previously assigned to someone else, decrement their count
      if (previouslyAssignedTo && previouslyAssignedTo !== newAssignedTo) {
        await this.userModel.findByIdAndUpdate(
          previouslyAssignedTo,
          { $inc: { assignedApps: -1 } }
        );
      }

      // Assign the application
      application.assignedTo = new Types.ObjectId(newAssignedTo);
      application.assignedToName = assignApplicationDto.userName;

      // Increment the new user's assigned apps count (only if not already assigned to them)
      if (!previouslyAssignedTo || previouslyAssignedTo !== newAssignedTo) {
        await this.userModel.findByIdAndUpdate(
          newAssignedTo,
          { $inc: { assignedApps: 1 } }
        );
      }

      await application.save();

      // Create notification for the assigned user
      if (!previouslyAssignedTo || previouslyAssignedTo !== newAssignedTo) {
        try {
          let recipient: NotificationRecipient;
          switch (user.role) {
            case Role.REGISTRAR:
              recipient = NotificationRecipient.REGISTRAR;
              break;
            case Role.DESK_OFFICER:
              recipient = NotificationRecipient.DESK_OFFICER;
              break;
            case Role.ADMIN:
            default:
              recipient = NotificationRecipient.ADMIN;
              break;
          }

          await this.notificationModel.create({
            type: NotificationType.STATUS_UPDATED,
            title: 'Application Assigned',
            message: `${application.applicationId} has been assigned to you${assignApplicationDto.assignedByName ? ` by ${assignApplicationDto.assignedByName}` : ''}.`,
            recipient,
            recipientId: new Types.ObjectId(newAssignedTo),
            applicationId: application._id,
            priority: priority.MEDIUM,
            isRead: false,
          });
        } catch (notificationError) {
          this.logger.error(`Failed to create assignment notification: ${notificationError.message}`);
        }
      }

      // Create audit log for application assignment
      try {
        await this.auditLogsService.create({
          actor: assignApplicationDto.assignedByName || 'System Admin',
          actorId: assignApplicationDto.assignedBy,
          role: assignApplicationDto.assignedByRole || 'Admin',
          action: AuditAction.APPLICATION_REVIEWED,
          entityType: EntityType.APPLICATION,
          entityId: application.applicationId,
          details: `${application.applicationId} has been assigned to ${application.assignedToName}`,
          severity: AuditSeverity.INFO,
          ipAddress: assignApplicationDto.ipAddress || '0.0.0.0'
        });
      } catch (auditError) {
        // Log error but don't fail the assignment
        this.logger.error(`Failed to create audit log for assignment: ${auditError.message}`);
      }

      return {
        application: application.applicationId,
        assignedTo: application.assignedToName
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException('Failed to assign application', err.message);
    }
  }

  async updateApplicationStatus(id: string, updateApplicationStatusDto: UpdateApplicationStatusDto): Promise<Application | any> {
    try {
      const application = await this.applicationModel.findById(id).populate('companyId');
      
      if (!application) {
        throw new NotFoundException('Application not found');
      }

      const oldStatus = application.currentStatus;
      const newStatus = updateApplicationStatusDto.applicationStatus;
      
      // Only update if status actually changed
      if (oldStatus !== newStatus) {
        if (newStatus === ApplicationStatus.REJECTED && !updateApplicationStatusDto.notes) {
          throw new BadRequestException("include a reason for rejection");
        }

        // Add new status to history array
        const statusHistoryEntry = {
          status: newStatus,
          timestamp: new Date(),
        };
        
        application.applicationTimeline.push(statusHistoryEntry);
        application.currentStatus = newStatus;

        const companyId = (application.companyId as any)?._id ?? application.companyId;
        const vendor = await this.vendorModel.findOne({ companyId });
        if (!vendor) {
          throw new NotFoundException('could not find a vendor');
        }
        
        // Create notification based on status
        let notificationType: NotificationType;
        let notificationTitle: string;
        let notificationMessage: string;
        let activityType: ActivityType;
        let activityMessage: string;

        switch (newStatus) {
          case ApplicationStatus.APPROVED:
            notificationType = NotificationType.APPLICATION_APPROVED;
            notificationTitle = 'Application Approved';
            notificationMessage = 'Your Application has been approved, please proceed to payment for certificate issuance.';
            activityType = ActivityType.APPROVED;
            activityMessage = 'Application approved by Registrar, you can proceed to make payments for certificate issuance';
            break;
          case ApplicationStatus.REJECTED:
            notificationType = NotificationType.APPLICATION_REJECTED;
            notificationTitle = 'Application Rejected';
            notificationMessage = `Your application has been rejected.${updateApplicationStatusDto.notes ? ` Reason: ${updateApplicationStatusDto.notes}` : ''}`;
            activityType = ActivityType.APPLICATION_REJECTED;
            activityMessage = 'Your application has been rejected by the Registrar';
            break;
          default:
            notificationType = NotificationType.APPLICATION_APPROVED;
            notificationTitle = 'Application Status Updated';
            notificationMessage = `Your application status has been updated to ${newStatus}.`;
            activityType = ActivityType.APPROVED;
            activityMessage = `Your application status has been updated to ${newStatus}`;
        }

        // Create activity log
        await this.vendorsService.createActivityLog(
          (application.companyId as any).userId,
          activityType,
          activityMessage + (updateApplicationStatusDto.notes ? `: ${updateApplicationStatusDto.notes}` : '')
        );

        // Create notification
        await this.notificationModel.create({
          type: notificationType,
          title: notificationTitle,
          message: notificationMessage,
          recipient: NotificationRecipient.VENDOR,
          vendorId: vendor._id,
          priority: priority.LOW,
          isRead: false,
        });

        // Send email notification
        try {
          await this.emailService.sendApplicationStatusUpdate(
            vendor.email,
            vendor.fullname,
            application.applicationId,
            newStatus,
            updateApplicationStatusDto.notes
          );
        } catch (emailError) {
          this.logger.error(`Failed to send status update email: ${emailError.message}`);
        }
      }
      
      await application.save();

      // Create audit log for status update
      const company = application.companyId as any;
      const companyName = company?.companyName || 'Unknown Company';
      
      // Determine action based on new status
      let auditAction: AuditAction;
      let severity: AuditSeverity;
      
      switch (newStatus) {
        case ApplicationStatus.APPROVED:
          auditAction = AuditAction.APPLICATION_APPROVED;
          severity = AuditSeverity.SUCCESS;
          break;
        case ApplicationStatus.REJECTED:
          auditAction = AuditAction.APPLICATION_REJECTED;
          severity = AuditSeverity.ERROR;
          break;
        case ApplicationStatus.FORWARDED_TO_REGISTRAR:
          auditAction = AuditAction.APPLICATION_FORWARDED;
          severity = AuditSeverity.INFO;
          break;
        case ApplicationStatus.CLARIFICATION_REQUESTED:
          auditAction = AuditAction.CLARIFICATION_REQUESTED;
          severity = AuditSeverity.WARNING;
          break;
        default:
          auditAction = AuditAction.APPLICATION_REVIEWED;
          severity = AuditSeverity.INFO;
      }

      // Create audit log entry
      try {
        await this.auditLogsService.create({
          actor: updateApplicationStatusDto.updatedByName || 'System',
          actorId: updateApplicationStatusDto.updatedBy,
          role: updateApplicationStatusDto.updatedByRole || 'desk officer',
          action: auditAction,
          entityType: EntityType.APPLICATION,
          entityId: application.applicationId,
          details: `${newStatus === ApplicationStatus.APPROVED ? 'Approved' : newStatus === ApplicationStatus.REJECTED ? 'Rejected' : 'Updated'} application for ${companyName}${updateApplicationStatusDto.notes ? ': ' + updateApplicationStatusDto.notes : ''}`,
          severity: severity,
          ipAddress: updateApplicationStatusDto.ipAddress || '0.0.0.0',
          metadata: {
            oldStatus: oldStatus,
            newStatus: newStatus,
            companyId: company?._id?.toString(),
            companyName: companyName,
            notes: updateApplicationStatusDto.notes
          }
        });
      } catch (auditError) {
        // Log error but don't fail the status update
        this.logger.error(`Failed to create audit log: ${auditError.message}`);
      }

      return {
        applicationId: application._id,
        newStatus: application.currentStatus
      }
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error(err.message);
      throw new BadRequestException('Failed to update application status', err.message);
    }
  }

  private async generateApplicationId(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.applicationModel.countDocuments();
    const paddedCount = String(count + 1).padStart(3, '0');
    return `APP-${year}-${paddedCount}`;
  }

  async createApplicationDoc(
    type:ApplicationType,
    company:CompanyDocument,
    payment:PaymentDocument
  ){
    // Generate unique application ID
        const applicationId = await this.generateApplicationId()

    // Create new application
        const newApplication = new this.applicationModel({
          applicationId,
          contractorName: company.companyName,
          companyId: new Types.ObjectId(company._id as Types.ObjectId),
          rcBnNumber: company.cacNumber,
          sectorAndGrade: payment.category && payment.grade
            ? `${payment.category} - ${payment.grade}`
            : payment.description,
          grade: payment.grade || 'N/A',
          type, // Maps to ApplicationType (Registration, Renewal, Upgrade)
          submissionDate: new Date(),
          slaStatus: 'On Time',
          applicationTimeline: [{
            status: ApplicationStatus.PENDING_DESK_REVIEW,
            timestamp: new Date(),
            notes: 'Application submitted and payment verified'
          }],
          currentStatus: ApplicationStatus.PENDING_DESK_REVIEW,
        });

        const newApp = await newApplication.save();
        this.logger.log(`Application created: ${applicationId}`);
        return newApp;
  }

  async generateCertificate(companyId:any): Promise<Certificate> {
    try {
      // Get the company to retrieve the vendor/contractor ID
      const company = await this.companyModel.findById(companyId).exec();
      if (!company) {
        throw new BadRequestException('Company not found for this application');
      }

      // Get vendor information for contact details
      const vendor = await this.vendorModel.findById(company.userId);
      if (!vendor) {
        throw new BadRequestException('Vendor not found for this company');
      }

      // Generate unique random alphanumeric certificate ID (e.g., IMO-CONT-2025-A1B2C3)
      let certificateId: string = '';
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 10;

      // Keep generating until we get a unique ID (with max attempts to prevent infinite loop)
      while (!isUnique && attempts < maxAttempts) {
        certificateId = generateCertificateId();
        const existingCert = await this.certificateModel.findOne({ certificateId }).exec();
        if (!existingCert) {
          isUnique = true;
        }
        attempts++;
      }

      if (!isUnique) {
        throw new BadRequestException('Failed to generate unique certificate ID. Please try again.');
      }

      //valid from date 
      const validFrom = new Date();

      // Calculate certificate validity (1 year from now)
      const validUntil = new Date();
      validUntil.setFullYear(validUntil.getFullYear() + 1);

      // Extract sector names and categories from company
      const approvedSector = company.category;

      // Create the certificate with all required fields
      const certificate = new this.certificateModel({
        certificateId: certificateId,
        company: company._id,
        contractorId: company.userId,
        contractorName: vendor.fullname,
        
        // Company Information
        companyName:company.companyName,
        rcBnNumber: company.cacNumber,
        tin: company.tin,
        
        // Contact Information
        address: company.address,
        lga: company.lga,
        phone: vendor.phoneNo,
        email: vendor.email,
        website: company.website || '',
        
        // Sector & Classification
        approvedSector: approvedSector,
        grade: company.grade,
        mda:company.mda,
        
        // Registration Status
        status: certificateStatus.APPROVED,
        validFrom: validFrom,
        validUntil: validUntil
      });

      return await certificate.save();
    } catch (err) {
      this.logger.error(err)
      throw new BadRequestException('Failed to generate certificate', err.message);
    }
  }
  
  /**
   * Cron Job to send notifications concerning applications
   */
}
