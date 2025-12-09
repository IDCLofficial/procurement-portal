import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
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
    status?: string,
    category?: string
  ) {
    try {
      // Build filter object with $and to properly combine all conditions
      const conditions: any[] = [];
      
      // Text search across multiple fields: contractor name, RC/BN number, registration ID, certificate ID, email, phone, TIN
      if (search) {
        conditions.push({
          $or: [
            { contractorName: { $regex: search, $options: 'i' } },
            { companyName: { $regex: search, $options: 'i' } },
            { rcBnNumber: { $regex: search, $options: 'i' } },
            { certificateId: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
            { tin: { $regex: search, $options: 'i' } },
            { approvedSectors: { $regex: search, $options: 'i' } },
            { categories: { $regex: search, $options: 'i' } }
          ]
        });
      }
      
      // Filter by grade (exact match)
      if (grade) {
        conditions.push({ grade });
      }
      
      // Filter by LGA - now directly on certificate schema
      if (lga) {
        conditions.push({ lga: { $regex: lga, $options: 'i' } });
      }
      
      // Filter by status (exact match)
      if (status) {
        conditions.push({ status });
      }

      // Filter by category - search in categories array
      if (category) {
        conditions.push({ categories: { $regex: category, $options: 'i' } });
      }

      // Exclude certificates for vendors whose email is blank or missing
      const vendorsWithEmail = await this.vendorModel
        .find({
          email: { $exists: true, $nin: ['', ' '] },
        })
        .select('_id')
        .lean();

      const vendorIdsWithEmail = vendorsWithEmail.map(v => v._id);

      if (vendorIdsWithEmail.length === 0) {
        return {
          total: 0,
          page,
          limit,
          totalPages: 0,
          statusCounts: {
            approved: 0,
            expired: 0,
            revoked: 0,
          },
          certificates: [],
        };
      }

      conditions.push({ contractorId: { $in: vendorIdsWithEmail } });

      // Build final filter
      const filter = conditions.length > 0 ? { $and: conditions } : {};
      
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Get total count for pagination metadata
      const total = await this.certificateModel.countDocuments(filter).exec();

      // Count certificates by status
      const approvedCount = await this.certificateModel.countDocuments({ ...filter, status: 'approved' }).exec();
      const expiredCount = await this.certificateModel.countDocuments({ ...filter, status: 'expired' }).exec();
      const revokedCount = await this.certificateModel.countDocuments({ ...filter, status: 'revoked' }).exec();
      
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
        statusCounts: {
          approved: approvedCount,
          expired: expiredCount,
          revoked: revokedCount
        },
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
      
      const vendor = await this.vendorModel.findById(certificate.contractorId).exec();
      if(!vendor){
        throw new NotFoundException('no vendor exists for this certificate')
      }else if(vendor.email === " " || !vendor.email){
        throw new BadRequestException("No valid certificate found")
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
      // Get the certificate with all data
      const certificate = await this.certificateModel
        .findOne({ certificateId })
        .populate('company')
        .populate('contractorId')
        .exec();
      
      if (!certificate) {
        throw new NotFoundException(`Certificate with ID ${certificateId} not found`);
      }

      return certificate;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException('Failed to get detailed certificate', err.message);
    }
  }

  async findByCategory(
    category: string,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      // Find companies that have the specified category
      const companies = await this.companyModel.find({
        'categories.sector': { $regex: category, $options: 'i' }
      }).select('_id').exec();

      const companyIds = companies.map(c => c._id);

      // Build filter for certificates
      const filter: any = {
        company: { $in: companyIds }
      };

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Get total count
      const total = await this.certificateModel.countDocuments(filter).exec();

      // Get paginated results
      const certificates = await this.certificateModel
        .find(filter)
        .populate('company')
        .populate('contractorId')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        category,
        certificates
      };
    } catch (err) {
      throw new BadRequestException('Failed to get certificates by category', err.message);
    }
  }
}
