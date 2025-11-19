import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Certificate, CertificateDocument } from './entities/certificate.schema';
import { Company, CompanyDocument } from '../companies/entities/company.schema';
import { Vendor, VendorDocument } from '../vendors/entities/vendor.schema';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectModel(Certificate.name) private certificateModel: Model<CertificateDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>
  ) {}

  async findAll(
    page: number = 1, 
    limit: number = 10,
    search?: string,
    grade?: string,
    lga?: string,
    status?: string
  ) {
    try {
      // Build filter object
      const filter: any = {};
      
      // Text search: contractor name, RC/BN number, or registration ID
      if (search) {
        filter.$or = [
          { contractorName: { $regex: search, $options: 'i' } },
          { rcBnNumber: { $regex: search, $options: 'i' } },
          { registrationId: { $regex: search, $options: 'i' } },
          { certificateId: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Filter by grade
      if (grade) {
        filter.grade = grade;
      }
      
      // Filter by LGA
      if (lga) {
        filter.lga = lga;
      }
      
      // Filter by status
      if (status) {
        filter.status = status;
      }
      
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Get total count for pagination metadata
      const total = await this.certificateModel.countDocuments(filter).exec();
      
      // Get paginated results
      const certificates = await this.certificateModel
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
        certificates: certificates
      };
    } catch (err) {
      throw new BadRequestException('Failed to get certificates', err.message);
    }
  }

  async findByCertificateId(certificateId: string): Promise<Certificate> {
    try {
      const certificate = await this.certificateModel.findOne({ certificateId }).exec();
      
      if (!certificate) {
        throw new NotFoundException(`Certificate with ID ${certificateId} not found`);
      }
      
      return certificate;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException('Failed to get certificate', err.message);
    }
  }

  async getDetailedCertificate(certificateId: string) {
    try {
      // Get the certificate
      const certificate = await this.certificateModel.findOne({ certificateId }).exec();
      
      if (!certificate) {
        throw new NotFoundException(`Certificate with ID ${certificateId} not found`);
      }

      // Get vendor details using the contractorId from certificate
      let vendor: VendorDocument | null = null;
      if (certificate.contractorId) {
        vendor = await this.vendorModel.findById(certificate.contractorId).exec();
      }

      // Find the company by vendor/contractor ID
      let company: CompanyDocument | null = null;
      if (certificate.contractorId) {
        company = await this.companyModel.findOne({ userId: certificate.contractorId }).exec();
      }

      // Build the detailed response
      const response: any = {
        certificate: {
          _id: certificate._id,
          certificateId: certificate.certificateId,
          contractorName: certificate.contractorName,
          rcBnNumber: certificate.rcBnNumber,
          grade: certificate.grade,
          lga: certificate.lga,
          status: certificate.status,
          validUntil: certificate.validUntil
        },
        companyInformation: company && {
          cacNumber: company.cacNumber,
          tin: company.tin,
          address: company.address,
          lga: company.lga,
          website: company.website || '',
          category: company.category || '',
          grade: company.grade || ''
        }
      };

      // Add contact information if vendor exists
      if (vendor) {
        response.contactInformation = {
          phone: vendor.phoneNo,
          email: vendor.email,
          address: company?.address || '',
          lga: company?.lga || '',
          website: company?.website || ''
        };
      }

      return response;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException('Failed to get detailed certificate', err.message);
    }
  }
}
