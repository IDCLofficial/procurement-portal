import { Injectable, BadRequestException, NotFoundException, Logger, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument, ApplicationStatus, ApplicationType } from './entities/application.schema';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { AssignApplicationDto } from './dto/assign-application.dto';
import { Certificate, CertificateDocument, certificateStatus } from '../certificates/entities/certificate.schema';
import { Company, CompanyDocument } from '../companies/entities/company.schema';
import { User, UserDocument } from '../users/entities/user.schema';
import { generateCertificateId } from '../lib/generateCertificateId';
import { VendorsService } from '../vendors/vendors.service';
import { ActivityType } from '../vendors/entities/vendor-activity-log.schema';
import { Vendor, VendorDocument } from 'src/vendors/entities/vendor.schema';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction, AuditSeverity, EntityType } from '../audit-logs/entities/audit-log.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    @InjectModel(Certificate.name) private certificateModel: Model<CertificateDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
    private vendorsService: VendorsService,
    private auditLogsService: AuditLogsService,
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
        populate: {
          path: "documents"
        }
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
        // Add new status to history array
        const statusHistoryEntry = {
          status: newStatus,
          timestamp: new Date(),
        };
        
        application.applicationTimeline.push(statusHistoryEntry);
        application.currentStatus = newStatus;
        
        // If status changed to APPROVED, generate certificate
        if (newStatus === ApplicationStatus.APPROVED) {
          const certificate = await this.generateCertificate(application);
          if(!certificate){
            throw new ConflictException("failed to generate certificate")
          }
          try{
            await this.vendorModel.findOneAndUpdate({
              _id:certificate.contractorId
            }, {
              $set: {
                certificateId:certificate.certificateId
              }
            })
          }catch(e){
            this.logger.error(e)
            throw new ConflictException("failed to update vendor document")
          }
          // Log approval activity
          await this.vendorsService.createActivityLog(
            (application.companyId as any).userId,
            ActivityType.APPROVED,
            `Application approved by Registrar`
          );
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

  private async generateCertificate(application: ApplicationDocument): Promise<Certificate> {
    try {
      // Get the company to retrieve the vendor/contractor ID
      const company = await this.companyModel.findById(application.companyId).exec();
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

      // Calculate certificate validity (1 year from now)
      const validUntil = new Date();
      validUntil.setFullYear(validUntil.getFullYear() + 1);

      // Extract sector names and categories from company
      const approvedSectors = company.categories?.map(cat => cat.sector) || [];

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
        approvedSectors: approvedSectors,
        grade: company.grade,
        
        // Registration Status
        status: certificateStatus.APPROVED,
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
