import { ConflictException, Injectable, NotFoundException, BadRequestException, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';
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
import { loginDto } from './dto/logn.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(Directors.name) private directorsModel: Model<DirectorsDocument>,
    @InjectModel(verificationDocuments.name) private verificationDocumentModel: Model<verificationDocument>,
    @Inject(forwardRef(() => EmailService))
    private emailService: EmailService,
    private tokenHandlers: TokenHandlers,
    private jwtService: JwtService
  ) {}

  /**
   * Create a new vendor account
   * 
   * @param createVendorDto - Vendor registration data
   * @returns Success message indicating registration completion
   * @throws {ConflictException} If vendor with email already exists
   * @throws {Error} If verification email fails to send
   * 
   * @description
   * - Validates email uniqueness
   * - Hashes password with bcrypt
   * - Creates vendor with unverified status
   * - Sends OTP verification email
   */
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

  /**
   * Authenticate vendor login
   * 
   * @param email - Vendor email address
   * @param password - Vendor password (plain text)
   * @returns User object (without password) and JWT token
   * @throws {NotFoundException} If vendor not found
   * @throws {BadRequestException} If password is invalid
   * 
   * @description
   * - Validates vendor existence
   * - Compares password with hashed version
   * - Generates JWT token for authentication
   */
  async login(body:loginDto): Promise<any> {
      const vendor = await this.vendorModel.findOne({ email:body.email }).exec();
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }
      const isPasswordValid = await bcrypt.compare(body.password, vendor.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }
      const { password: _, ...user } = vendor.toObject();
      return {user, token: this.tokenHandlers.generateToken(user)};
    }

  /**
   * Get all vendor accounts
   * 
   * @returns Array of all vendors in the database
   * 
   * @description
   * Retrieves all vendor records without filtering
   * Limited to 1000 records to prevent memory issues
   */
  async findAll(): Promise<Vendor[]> {
    return this.vendorModel.find().limit(1000).select('-password').exec();
  }

  /**
   * Get vendor profile from JWT token
   * 
   * @param authorization - Authorization header containing Bearer token
   * @returns Vendor document without password
   * @throws {UnauthorizedException} If token is missing or invalid
   * @throws {NotFoundException} If vendor not found
   * 
   * @description
   * Retrieves the authenticated vendor's profile by:
   * 1. Extracting the JWT token from the Authorization header
   * 2. Decoding the token to get the user ID
   * 3. Fetching the vendor profile from the database
   * 4. Returning the profile without the password field
   */
  async getProfile(authHeader: string): Promise<Omit<Vendor, 'password'>> {
    // Check if authorization header exists
    console.log('Authorization header:', authHeader);
    
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    // Extract token from "Bearer <token>" format
    const token = authHeader.replace('Bearer ', '').trim();
    
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      // Decode the JWT token
      const decoded = this.jwtService.verify(token);
      
      // Extract user ID from token payload (using 'sub' as per JWT standard)
      const userId = decoded.sub || decoded._id || decoded.id;
      
      if (!userId) {
        throw new UnauthorizedException('Invalid token payload - user ID not found');
      }

      // Fetch vendor profile without password
      const vendor = await this.vendorModel.findById(userId).select('-password').exec();
      
      if (!vendor) {
        throw new NotFoundException(`Vendor with ID ${userId} not found`);
      }
      
      return vendor.toObject();
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Update vendor profile information
   * 
   * @param id - Vendor ID (MongoDB ObjectId)
   * @param updateVendorDto - Updated vendor data
   * @returns Updated vendor document
   * @throws {NotFoundException} If vendor not found
   * 
   * @description
   * - Updates vendor profile fields
   * - Automatically hashes password if provided
   * - Returns updated document
   */
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

  /**
   * Register or update company details for a vendor
   * 
   * @param id - Vendor ID (MongoDB ObjectId)
   * @param updateRegistrationDto - Company registration data including company info, directors, bank details, documents, and categories
   * @returns Success message with saved company, directors, and document data
   * @throws {NotFoundException} If vendor not found
   * @throws {BadRequestException} If registration fails
   * 
   * @description
   * - Creates or updates company information
   * - Manages directors data
   * - Handles verification documents
   * - Stores bank details and service categories
   * - Sets company status to PENDING for new registrations
   */
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

  /**
   * Delete a vendor account
   * 
   * @param id - Vendor ID (MongoDB ObjectId)
   * @returns Deleted vendor document
   * @throws {NotFoundException} If vendor not found
   * 
   * @description
   * Permanently removes vendor from the database
   */
  async remove(id: string): Promise<Vendor> {
    const deletedVendor = await this.vendorModel.findByIdAndDelete(id).exec();
    if (!deletedVendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return deletedVendor;
  }

  /**
   * Verify vendor email with OTP
   * 
   * @param email - Vendor email address
   * @param otp - One-time password received via email
   * @returns Success status and verification message
   * @throws {NotFoundException} If vendor not found
   * @throws {BadRequestException} If OTP is invalid or expired
   * 
   * @description
   * - Validates OTP against email service
   * - Marks vendor as verified
   * - Returns success message
   */
  async verifyEmail(email: string, otp: string): Promise<{ success: boolean; message: string; data: Vendor, token:string}> {
    const vendor = await this.vendorModel.findOne({ email });
    
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (vendor.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    // Verify OTP using the email service
    const result = this.emailService.verifyOtp(email, otp);
    
    if (!result.isValid) {
      throw new BadRequestException(result.message || 'Invalid or expired OTP');
    }

    // Mark as verified
    vendor.isVerified = true;

    const newVendor = await vendor.save();

    const { password: _, ...user } = newVendor.toObject();

    return { 
      success: true, 
      message: 'Email verified successfully. Your account is now active.',
      data: user as any,
      token: this.tokenHandlers.generateToken(user)
    };
  }

  /**
   * Resend email verification OTP
   * 
   * @param email - Vendor email address
   * @returns Success status and confirmation message
   * @throws {NotFoundException} If vendor not found
   * @throws {BadRequestException} If email already verified or OTP send fails
   * 
   * @description
   * - Checks vendor exists and is not already verified
   * - Generates and sends new OTP via email
   * - Returns success confirmation
   */
  async resendVerificationOtp(email: string): Promise<{ success: boolean; message: string }> {
    const vendor = await this.vendorModel.findOne({ email });
    
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (vendor.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Send new OTP email
    const emailSent = await this.emailService.sendOtpEmail(
      email,
      vendor.fullname || 'Vendor',
    );

    if (!emailSent) {
      throw new BadRequestException('Failed to send verification email. Please try again later.');
    }

    return { 
      success: true, 
      message: 'Verification OTP has been resent to your email.' 
    };
  }
}
