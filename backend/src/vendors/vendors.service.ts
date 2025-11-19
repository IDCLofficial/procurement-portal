import { ConflictException, Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Vendor, VendorDocument } from './entities/vendor.schema';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import TokenHandlers from 'src/lib/generateToken';
import { updateRegistrationDto } from './dto/update-registration.dto';
import { Company, CompanyDocument, Directors, DirectorsDocument, Status } from '../companies/entities/company.schema';
import { verificationDocuments, verificationDocument } from '../documents/entities/document.schema';

@Injectable()
export class VendorsService {
  constructor(
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(Directors.name) private directorsModel: Model<DirectorsDocument>,
    @InjectModel(verificationDocuments.name) private verificationDocumentModel: Model<verificationDocument>,
    @Inject(forwardRef(() => EmailService))
    private emailService: EmailService,
    private tokenHandlers: TokenHandlers
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<{ message: string }> {
    // Check if vendor with email already exists
    const existingVendor = await this.vendorModel.findOne({
      email: createVendorDto.email,
    });

    if (existingVendor) {
      throw new ConflictException('Vendor with this email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createVendorDto.password, salt);

     // Create the new vendor but set verification status to false
    const vendor = new this.vendorModel({
      ...createVendorDto,
      password: hashedPassword,
      isVerified: false,
    });

    await vendor.save();

    // Send verification email
    const emailSent = await this.emailService.sendOtpEmail(
      createVendorDto.email,
      createVendorDto.fullname || 'Vendor',
    );

    if (!emailSent) {
      throw new Error('Failed to send verification email');
    }

    // Return a message indicating that verification is required
    return { 
      message: 'Registration successful. Please check your email to verify your account.' 
    };
  }

    async login(email: string, password: string): Promise<any> {
      const vendor = await this.vendorModel.findOne({ email }).exec();
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }
      const isPasswordValid = await bcrypt.compare(password, vendor.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }
      const { password: _, ...user } = vendor.toObject();
      return {user, token: this.tokenHandlers.generateToken(user)};
    }

  async findAll(): Promise<Vendor[]> {
    return this.vendorModel.find().exec();
  }

  async findOne(id: string): Promise<Vendor> {
    const vendor = await this.vendorModel.findById(id).exec();
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return vendor;
  }

  async update(id: string, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    if (updateVendorDto.password) {
      const salt = await bcrypt.genSalt();
      updateVendorDto.password = await bcrypt.hash(updateVendorDto.password, salt);
    }
    const updatedVendor = await this.vendorModel
      .findByIdAndUpdate(id, updateVendorDto, { new: true })
      .exec();
    if (!updatedVendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return updatedVendor;
  }

  async registerCompany(id:string, updateRegistrationDto:updateRegistrationDto): Promise<any> {
    const vendor = await this.vendorModel.findById(id).exec();
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    const vendorObjectId = new Types.ObjectId(id);
    const results: any = {
      vendor: vendor,
      company: null,
      directors: null,
      bankDetails: updateRegistrationDto.bankDetails || null,
      documents: [],
      categoriesAndGrade: updateRegistrationDto.categoriesAndGrade || null
    };

    try {
      // Save company data to Company collection
      if (updateRegistrationDto.company) {
        const existingCompany = await this.companyModel.findOne({ userId: vendorObjectId }).exec();
        
        if (existingCompany) {
          // Update existing company
          existingCompany.companyName = updateRegistrationDto.company.companyName;
          existingCompany.cacNumber = updateRegistrationDto.company.cacNumber;
          existingCompany.tin = updateRegistrationDto.company.tin;
          existingCompany.address = updateRegistrationDto.company.businessAddres;
          existingCompany.lga = updateRegistrationDto.company.lga;
          existingCompany.website = updateRegistrationDto.company.website || '';
          
          // Update category and grade if provided
          if (updateRegistrationDto.categoriesAndGrade) {
            existingCompany.category = JSON.stringify(updateRegistrationDto.categoriesAndGrade.categories);
            existingCompany.grade = updateRegistrationDto.categoriesAndGrade.grade;
          }
          
          results.company = await existingCompany.save();
        } else {
          // Create new company
          const newCompany = new this.companyModel({
            userId: vendorObjectId,
            companyName: updateRegistrationDto.company.companyName,
            cacNumber: updateRegistrationDto.company.cacNumber,
            tin: updateRegistrationDto.company.tin,
            address: updateRegistrationDto.company.businessAddres,
            lga: updateRegistrationDto.company.lga,
            website: updateRegistrationDto.company.website || '',
            status: Status.PENDING,
            category: updateRegistrationDto.categoriesAndGrade ? JSON.stringify(updateRegistrationDto.categoriesAndGrade.categories) : '',
            grade: updateRegistrationDto.categoriesAndGrade?.grade || ''
          });
          
          results.company = await newCompany.save();
        }
      }

      // Save directors data to Directors collection
      if (updateRegistrationDto.directors && updateRegistrationDto.directors.length > 0) {
        const existingDirectors = await this.directorsModel.findOne({ userId: vendorObjectId }).exec();
        
        const directorsData = updateRegistrationDto.directors.map(director => ({
          name: director.fullName,
          email: director.email,
          phone: director.phone.toString(),
          id: director.id
        }));
        
        if (existingDirectors) {
          // Update existing directors
          existingDirectors.directors = directorsData;
          results.directors = await existingDirectors.save();
        } else {
          // Create new directors entry
          const newDirectors = new this.directorsModel({
            userId: vendorObjectId,
            directors: directorsData
          });
          
          results.directors = await newDirectors.save();
        }
      }

      // Save documents to verificationDocuments collection
      if (updateRegistrationDto.documents && updateRegistrationDto.documents.length > 0) {
        for (const doc of updateRegistrationDto.documents) {
          const newDocument = new this.verificationDocumentModel({
            vendor: vendorObjectId,
            documentName: doc.documentType,
            documentUrl: '', // URL will be populated when file is uploaded
            validFrom: doc.validFrom || '',
            validTo: doc.validTo || ''
          });
          
          const savedDoc = await newDocument.save();
          results.documents.push(savedDoc);
        }
      }

      return {
        message: 'Company registration updated successfully',
        data: results
      };
    } catch (error) {
      throw new BadRequestException(`Failed to register company: ${error.message}`);
    }
  }

  async remove(id: string): Promise<Vendor> {
    const deletedVendor = await this.vendorModel.findByIdAndDelete(id).exec();
    if (!deletedVendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return deletedVendor;
  }

  async verifyEmail(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    const vendor = await this.vendorModel.findOne({ email });
    
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (vendor.isVerified) {
      return { success: true, message: 'Email already verified' };
    }

    // Verify OTP using the email service
    const result = this.emailService.verifyOtp(email, otp);
    
    if (!result.isValid) {
      throw new BadRequestException(result.message || 'Invalid or expired OTP');
    }

    // Mark as verified
    vendor.isVerified = true;
    await vendor.save();

    // Save the vendor after successful verification
    await vendor.save();

    return { 
      success: true, 
      message: 'Email verified successfully. Your account is now active.' 
    };
  }
}
