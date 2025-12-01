import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument, ApplicationStatus, ApplicationType } from './entities/application.schema';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { AssignApplicationDto } from './dto/assign-application.dto';
import { Certificate, CertificateDocument } from '../certificates/entities/certificate.schema';
import { Company, CompanyDocument } from '../companies/entities/company.schema';
import { User, UserDocument } from '../users/entities/user.schema';
import { generateCertificateId } from '../lib/generateCertificateId';
import { ApplicationStatusUpdatedEvent } from '../notifications/events/application-status-updated.event';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    @InjectModel(Certificate.name) private certificateModel: Model<CertificateDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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

  async assignApplication(id: string, assignApplicationDto: AssignApplicationDto): Promise<Application> {
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

      return await application.save();
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException('Failed to assign application', err.message);
    }
  }

  async updateApplicationStatus(id: string, updateApplicationStatusDto: UpdateApplicationStatusDto): Promise<Application> {
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
          notes: updateApplicationStatusDto.notes,
          updatedBy: updateApplicationStatusDto.updatedBy ? new Types.ObjectId(updateApplicationStatusDto.updatedBy) : undefined,
          updatedByName: updateApplicationStatusDto.updatedByName
        };
        
        application.applicationStatus.push(statusHistoryEntry);
        application.currentStatus = newStatus;
        
        // Get company details for the event
        const company = application.companyId as any;
        const vendorId = company?.userId || new Types.ObjectId();
        const companyName = application.contractorName || company?.companyName || 'Unknown Company';
        
        // Emit status updated event
        // this.eventEmitter.emit(
        //   'application.status.updated',
        //   new ApplicationStatusUpdatedEvent(
        //     application._id as Types.ObjectId,
        //     application.applicationId,
        //     companyName,
        //     vendorId,
        //     oldStatus,
        //     newStatus,
        //   ),
        // );
        
        // If status changed to APPROVED, generate certificate
        if (newStatus === ApplicationStatus.APPROVED) {
          await this.generateCertificate(application);
        }
      }
      
      return await application.save();
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
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

      // Get the latest certificate to determine the next sequence number
      const currentYear = new Date().getFullYear();
      const latestCertificate = await this.certificateModel
        .findOne({ certificateId: new RegExp(`^CERT-${currentYear}-`) })
        .sort({ certificateId: -1 })
        .exec();

      let sequenceNumber = 1;
      if (latestCertificate && latestCertificate.certificateId) {
        const parts = latestCertificate.certificateId.split('-');
        if (parts.length === 3) {
          sequenceNumber = parseInt(parts[2], 10) + 1;
        }
      }

      const certificateId = generateCertificateId(sequenceNumber);

      // Calculate certificate validity (1 year from now)
      const validUntil = new Date();
      validUntil.setFullYear(validUntil.getFullYear() + 1);

      // Create the certificate
      const certificate = new this.certificateModel({
        certificateId: certificateId,
        contractorId: company.userId, // Reference to the vendor
        contractorName: application.contractorName,
        registrationId: application.applicationId,
        rcBnNumber: application.rcBnNumber,
        grade: application.grade,
        status: 'Approved',
        validUntil: validUntil
      });

      return await certificate.save();
    } catch (err) {
      throw new BadRequestException('Failed to generate certificate', err.message);
    }
  }
}
