import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application, ApplicationDocument, ApplicationStatus } from './entities/application.schema';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { Certificate, CertificateDocument } from '../certificates/entities/certificate.schema';
import { Company, CompanyDocument } from '../companies/entities/company.schema';
import { generateCertificateId } from '../lib/generateCertificateId';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    @InjectModel(Certificate.name) private certificateModel: Model<CertificateDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>
  ) {}

  async findAll(status?: ApplicationStatus, page: number = 1, limit: number = 10) {
    try {
      const filter: any = {};
      
      // Add status filter if provided
      if (status) {
        filter.applicationStatus = status;
      }
      
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Get total count for pagination metadata
      const total = await this.applicationModel.countDocuments(filter).exec();
      
      // Get paginated results
      const applications = await this.applicationModel
        .find(filter)
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
      throw new BadRequestException('Failed to get applications', err.message);
    }
  }

  async updateApplicationStatus(id: string, updateApplicationStatusDto: UpdateApplicationStatusDto): Promise<Application> {
    try {
      const application = await this.applicationModel.findById(id);
      
      if (!application) {
        throw new NotFoundException('Application not found');
      }

      const oldStatus = application.applicationStatus;
      application.applicationStatus = updateApplicationStatusDto.applicationStatus;
      
      // If status changed to APPROVED, generate certificate
      if (updateApplicationStatusDto.applicationStatus === ApplicationStatus.APPROVED && oldStatus !== ApplicationStatus.APPROVED) {
        await this.generateCertificate(application);
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
