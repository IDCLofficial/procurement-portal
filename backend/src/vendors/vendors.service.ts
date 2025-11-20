import { ConflictException, Injectable, NotFoundException, BadRequestException, Inject, forwardRef, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { companyForm, Vendor, VendorDocument } from './entities/vendor.schema';
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
      return {
        message:"Login Successful",
        token: this.tokenHandlers.generateToken(user)
      };
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
    const company = await this.companyModel.findOne({companyName:updateRegistrationDto.company.companyName}).exec();
    if(company){
      throw new BadRequestException('Company has already been registered');
    }

    try{
      if(updateRegistrationDto.company){
        try{
          const newCompany = new this.companyModel({
            companyName:updateRegistrationDto.company.companyName,
            cacNumber:updateRegistrationDto.company.cacNumber,
            tin:updateRegistrationDto.company.tin,
            address:updateRegistrationDto.company.businessAddres,
            lga:updateRegistrationDto.company.lga,
            website:updateRegistrationDto.company.website || "not specified",
            userId:vendor._id,
          })
          const result = await newCompany.save();
          
          vendor.companyForm = companyForm.STEP2;
          await vendor.save()
          
          return {
            message:"company registered successfully",
            result:result,
            nextStep: vendor.companyForm
          }
        }catch(err){
          new Logger.error(err)
          throw new ConflictException('There was an error registering company')
        }
      }
      /**
       * update company registration for directors
       */
      if(updateRegistrationDto.directors){
        try{
          const directors = await this.directorsModel.findOne({userId:vendor._id}).exec()
          if(directors){
            throw new BadRequestException("Directors have already been registered for this vendor")
          }
          const newDirectors = new this.directorsModel({
            userId:vendor._id,
            directors:updateRegistrationDto.directors
          })
          const result = await newDirectors.save();
          const company = await this.companyModel.findOne({userId:vendor._id})
          if(company){
            company.directors = result._id as Types.ObjectId;
            await company.save()
            return{
              result
            }
          }else{
            new Logger.error("company not found")
            throw new NotFoundException("Company not found")
          }

        }catch(err){
          new Logger.error(err);
          throw new ConflictException('Error updating directors')
        }
      }

      /**
       * update company registration for bank details
       */
      if(updateRegistrationDto.bankDetails){
        try{
          const company = await this.companyModel.findOne({userId:vendor._id})
          if(!company){
            new Logger.error("company not found")
            throw new NotFoundException("Company not found. Please register company first.")
          }
          
          // Store bank details in company (assuming they're part of company schema or embedded)
          // If bank details need a separate collection, create a new model
          Object.assign(company, {
            bankName: updateRegistrationDto.bankDetails.bankName,
            accountNumber: updateRegistrationDto.bankDetails.accountNumber,
            accountName: updateRegistrationDto.bankDetails.accountName
          });
          
          await company.save();
          
          vendor.companyForm = companyForm.STEP3;
          await vendor.save();
          
          return {
            message: "Bank details updated successfully",
            result: company,
            nextStep: vendor.companyForm
          }
        }catch(err){
          new Logger.error(err);
          throw new ConflictException('Error updating bank details')
        }
      }

      /**
       * update company registration for documents
       */
      if(updateRegistrationDto.documents){
        try{
          const company = await this.companyModel.findOne({userId:vendor._id})
          if(!company){
            new Logger.error("company not found")
            throw new NotFoundException("Company not found. Please register company first.")
          }

          // Create verification documents
          const documentPromises = updateRegistrationDto.documents.map(doc => {
            const newDoc = new this.verificationDocumentModel({
              vendor: vendor._id,
              documentName: doc.documentType,
              documentUrl: "", // Will be updated when files are uploaded
              validFrom: doc.validFrom || " ",
              validTo: doc.validTo || " "
            });
            return newDoc.save();
          });

          const savedDocuments = await Promise.all(documentPromises);
          
          // Update company with documents reference (if storing first document ID)
          if(savedDocuments.length > 0){
            company.documents = savedDocuments[0]._id as Types.ObjectId;
            await company.save();
          }

          vendor.companyForm = companyForm.STEP4;
          await vendor.save();

          return {
            message: "Documents registered successfully",
            result: savedDocuments,
            nextStep: vendor.companyForm
          }
        }catch(err){
          new Logger.error(err);
          throw new ConflictException('Error updating documents')
        }
      }

      /**
       * update company registration for categories and grade
       */
      if(updateRegistrationDto.categoriesAndGrade){
        try{
          const company = await this.companyModel.findOne({userId:vendor._id})
          if(!company){
            new Logger.error("company not found")
            throw new NotFoundException("Company not found. Please register company first.")
          }

          company.categories = updateRegistrationDto.categoriesAndGrade.categories;
          company.grade = updateRegistrationDto.categoriesAndGrade.grade;
          await company.save();

          vendor.companyForm = companyForm.STEP6;
          await vendor.save();

          return {
            message: "Categories and grade updated successfully. Proceed to payment",
            result: company,
            nextStep: vendor.companyForm
          }
        }catch(err){
          Logger.error(err);
          throw new ConflictException('Error updating categories and grade')
        }
      }
      return {
        message: 'Company registration updated successfully',
        data: vendor
      };
    }catch(error) {
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
