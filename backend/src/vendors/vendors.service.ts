import { ConflictException, Injectable, NotFoundException, BadRequestException, Inject, forwardRef, UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { companyForm, Vendor, VendorDocument } from './entities/vendor.schema';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import TokenHandlers from 'src/lib/generateToken';
import { updateRegistrationDto } from './dto/update-registration.dto';
import { Company, CompanyDocument, Directors, DirectorsDocument, Status } from '../companies/entities/company.schema';
import { verificationDocuments, verificationDocument, Status as DocumentStatus } from '../documents/entities/document.schema';
import { Payment, PaymentDocument } from '../payments/entities/payment.schema';
import { loginDto } from './dto/logn.dto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ValidationError } from 'class-validator';
import { Logger } from '@nestjs/common';
import { necessaryDocument } from './dto/update-registration.dto';

@Injectable()
export class VendorsService {
  private s3: S3Client;
  private readonly Logger = new Logger(Vendor.name)

  constructor(
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(Directors.name) private directorsModel: Model<DirectorsDocument>,
    @InjectModel(verificationDocuments.name) private verificationDocumentModel: Model<verificationDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @Inject(forwardRef(() => EmailService))
    private emailService: EmailService,
    private tokenHandlers: TokenHandlers,
    private jwtService: JwtService,
  ) {
    // Initialize S3 client for Sirv
    const accessKeyId = process.env.SIRV_S3_ACCESS_KEY;
    const secretAccessKey = process.env.SIRV_S3_SECRET_KEY;
    const endpoint = process.env.SIRV_S3_ENDPOINT;

    if (accessKeyId && secretAccessKey && endpoint) {
      this.s3 = new S3Client({
        region: 'auto',
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        forcePathStyle: true,
      });
    }
  }

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
      if(!vendor.isVerified){
        throw new UnauthorizedException('Email not verified')
      }
      const isPasswordValid = await bcrypt.compare(body.password, vendor.password);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }
      const { password: _, ...user } = vendor.toObject();
      console.log(user)
      return {
        message:"Login Successful",
        token: this.tokenHandlers.generateToken(user)
      };
    }

  /**
   * Get all vendor accounts with pagination and filtering
   * 
   * @param page - Page number (default: 1)
   * @param limit - Number of records per page (default: 10, max: 100)
   * @param search - Search term for fullname, email, or phone number
   * @param isVerified - Filter by verification status
   * @param companyForm - Filter by company registration step
   * @returns Paginated array of vendors with metadata
   * 
   * @description
   * Retrieves vendor records with pagination and optional filtering
   */
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    isVerified?: boolean,
    companyForm?: companyForm
  ): Promise<{
    data: Vendor[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    // Ensure limit doesn't exceed 100
    const pageLimit = Math.min(limit, 100);
    const skip = (page - 1) * pageLimit;

    // Build filter query
    const filter: any = {};

    // Search across multiple fields
    if (search) {
      filter.$or = [
        { fullname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNo: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by verification status
    if (isVerified !== undefined) {
      filter.isVerified = isVerified;
    }

    // Filter by company form step
    if (companyForm) {
      filter.companyForm = companyForm;
    }

    // Execute query with pagination
    const [data, total] = await Promise.all([
      this.vendorModel
        .find(filter)
        .select('-password')
        .skip(skip)
        .limit(pageLimit)
        .sort({ createdAt: -1 })
        .exec(),
      this.vendorModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      pagination: {
        total,
        page,
        limit: pageLimit,
        totalPages: Math.ceil(total / pageLimit),
      },
    };
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
  async getProfile(userId: string): Promise<Omit<Vendor, 'password'>> {
    
    if (!userId) {
      throw new UnauthorizedException('An error occured');
    }

    try{
      // Fetch vendor profile without password
      const vendor = await this.vendorModel.findById(userId).select('-password').exec();
      
      if (!vendor) {
        throw new NotFoundException(`Vendor with ID ${userId} not found`);
      }
      
      return vendor.toObject();
    }catch(err){
      throw new BadRequestException("An erorr occured")
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
   * @param files - Optional uploaded files for documents
   * @returns Success message with saved company, directors, and document data
   * @throws {NotFoundException} If vendor not found
   * @throws {BadRequestException} If registration fails
   * 
   * @description
   * - Creates or updates company information
   * - Manages directors data
   * - Handles verification documents with file uploads to Sirv
   * - Stores bank details and service categories
   * - Sets company status to PENDING for new registrations
   */
  async registerCompany(req:Request, updateRegistrationDto:updateRegistrationDto, files?: Express.Multer.File[]): Promise<any> {
    // Extract and verify JWT token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    
    let userId: string;
    try {
      const decoded = this.jwtService.verify(token);
      userId = decoded.sub || decoded._id || decoded.id;
      
      if (!userId) {
        throw new UnauthorizedException('Invalid token payload');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    
    const vendor = await this.vendorModel.findById(userId).exec();
    if (!vendor) {
      throw new NotFoundException(`Vendor not found`);
    }

    try{
      if(updateRegistrationDto.company){
        const checkIfNameExists = await this.companyModel.findOne({companyName:updateRegistrationDto.company.companyName}).exec();
        if(checkIfNameExists && checkIfNameExists.userId !== new Types.ObjectId(vendor._id as Types.ObjectId)){
          throw new BadRequestException('company name already exists')
        }
        try{
          // Check if company already exists for this vendor
          let company = await this.companyModel.findOne({ userId: vendor._id }).exec();

          let result:any;
          if (company) {
            // Update existing company
            company.companyName = updateRegistrationDto.company.companyName;
            company.cacNumber = updateRegistrationDto.company.cacNumber;
            company.tin = updateRegistrationDto.company.tin;
            company.address = updateRegistrationDto.company.businessAddres;
            company.lga = updateRegistrationDto.company.lga;
            company.website = updateRegistrationDto.company.website || "not specified";
            
            result = await company.save();
            
            // Update vendor form step to directors if still on company step
            if (vendor.companyForm === companyForm.STEP1) {
              vendor.companyForm = companyForm.STEP2;
              await vendor.save();
            }
            
            return {
              message: "Company information updated successfully",
              result: result,
              nextStep: vendor.companyForm
            }
          } else {
            // Create new company
            const newCompany = new this.companyModel({
              companyName: updateRegistrationDto.company.companyName,
              cacNumber: updateRegistrationDto.company.cacNumber,
              tin: updateRegistrationDto.company.tin,
              address: updateRegistrationDto.company.businessAddres,
              lga: updateRegistrationDto.company.lga,
              website: updateRegistrationDto.company.website || "not specified",
              userId: vendor._id,
            })
            result = await newCompany.save();
            
            vendor.companyForm = companyForm.STEP2;
            vendor.companyId = result._id as Types.ObjectId;
            await vendor.save()
            
            return {
              message: "Company registered successfully",
              result: result,
              nextStep: vendor.companyForm
            }
          }
        }catch(err){
          this.Logger.debug(`${err}`)
          throw new ConflictException('There was an error registering/updating company')
        }
      }
      /**
       * update company registration for directors
       */
      if(updateRegistrationDto.directors){
        try{
          // Check if directors already exist for this vendor
          let directors = await this.directorsModel.findOne({userId:vendor._id}).exec()
          
          let result;
          if(directors){
            // Update existing directors
            directors.directors = updateRegistrationDto.directors;
            result = await directors.save();
            
            // Ensure company has the directors reference
            const company = await this.companyModel.findOne({userId:vendor._id})
            if(company && !company.directors){
              company.directors = result._id as Types.ObjectId;
              await company.save()
            }
            
            return {
              message: "Directors information updated successfully",
              result: result,
              nextStep: vendor.companyForm
            }
          } else {
            // Create new directors record
            const newDirectors = new this.directorsModel({
              userId:vendor._id,
              directors:updateRegistrationDto.directors
            })
            result = await newDirectors.save();
            
            const company = await this.companyModel.findOne({userId:vendor._id})
            if(company){
              company.directors = result._id as Types.ObjectId;
              await company.save()
              
              vendor.companyForm = companyForm.STEP3;
              await vendor.save();
              
              return {
                message: "Directors registered successfully",
                result: result,
                nextStep: vendor.companyForm
              }
            }else{
              this.Logger.error("company not found")
              throw new NotFoundException("Company not found")
            }
          }

        }catch(err){
          this.Logger.debug(`${err}`);
          throw new ConflictException('Error registering/updating directors')
        }
      }

      /**
       * update company registration for bank details
       */
      if(updateRegistrationDto.bankDetails){
        try{
          const company = await this.companyModel.findOne({userId:vendor._id})          
          // Store bank details in company (assuming they're part of company schema or embedded)
          // If bank details need a separate collection, create a new model
          if(company){
            Object.assign(company, {
              bankName: updateRegistrationDto.bankDetails.bankName,
              accountNumber: updateRegistrationDto.bankDetails.accountNumber,
              accountName: updateRegistrationDto.bankDetails.accountName
            });
            
            await company.save();
            
            vendor.companyForm = companyForm.STEP4;
            await vendor.save();
            
            return {
              message: "Bank details updated successfully",
              result: company,
              nextStep: vendor.companyForm
            }
          }
        }catch(err){
          this.Logger.debug(`${err}`)
          throw new ConflictException('Error updating bank details')
        }
      }

      /**
       * update company registration for documents
       */
      if(updateRegistrationDto.documents){
        try{
          const company = await this.companyModel.findOne({userId:vendor._id})
          // Process each document - create or update individual document records
          const savedDocs = await Promise.all(
            updateRegistrationDto.documents.map(async (doc) => {
              // Check if document with same type already exists for this vendor
              const existingDoc = await this.verificationDocumentModel.findOne({
                vendor: vendor._id,
                documentType: doc.documentType
              });
              
              if (existingDoc) {
                // Update existing document
                existingDoc.fileUrl = doc.fileUrl;
                existingDoc.validFrom = doc.validFrom;
                existingDoc.validTo = doc.validTo;
                existingDoc.uploadedDate = doc.uploadedDate;
                existingDoc.fileName = doc.fileName;
                existingDoc.fileSize = doc.fileSize;
                existingDoc.fileType = doc.fileType;
                existingDoc.validFor = doc.validFor;
                existingDoc.hasValidityPeriod = doc.hasValidityPeriod;
                existingDoc.status = {
                  status:DocumentStatus.PENDING,
                }
                
                return await existingDoc.save();
              } else {
                // Create new document record
                const newDoc = new this.verificationDocumentModel({
                  vendor: vendor._id,
                  fileUrl: doc.fileUrl,
                  validFrom: doc.validFrom,
                  validTo: doc.validTo,
                  documentType: doc.documentType,
                  uploadedDate: doc.uploadedDate,
                  fileName: doc.fileName,
                  fileSize: doc.fileSize,
                  fileType: doc.fileType,
                  validFor: doc.validFor,
                  hasValidityPeriod: doc.hasValidityPeriod,
                  status: {
                    status:DocumentStatus.PENDING,
                  }
                });
                return await newDoc.save();
              }
            })
          );
          if(company){
            company.documents = savedDocs.map(doc=>doc._id as Types.ObjectId)
            await company.save()
          }
          vendor.companyForm = companyForm.STEP5;
          await vendor.save();
          
          return {
            message: "Documents uploaded successfully",
            documents: savedDocs
          };
        }catch(err){
          this.Logger.debug(`${err}`)
          throw new ConflictException('Error updating documents: ' + err.message)
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
    }catch(error) {
      this.Logger.debug(`${error}`)
      throw new BadRequestException(`An error occured`);
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

    // Check if account is locked out
    const now = new Date();
    if (vendor.otpLockoutUntil && vendor.otpLockoutUntil > now) {
      const remainingMinutes = Math.ceil((vendor.otpLockoutUntil.getTime() - now.getTime()) / (1000 * 60));
      throw new BadRequestException(
        `Too many failed attempts. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.`
      );
    }

    // Reset failed attempts if lockout period has expired
    if (vendor.otpLockoutUntil && vendor.otpLockoutUntil <= now) {
      vendor.otpFailedAttempts = 0;
      vendor.otpLockoutUntil = undefined;
    }

    // Verify OTP using the email service
    const result = this.emailService.verifyOtp(email, otp);
    
    if (!result.isValid) {
      // Increment failed attempts
      vendor.otpFailedAttempts = (vendor.otpFailedAttempts || 0) + 1;

      // Lock out after 3 failed attempts
      if (vendor.otpFailedAttempts >= 3) {
        vendor.otpLockoutUntil = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
        await vendor.save();
        throw new BadRequestException(
          'Too many failed attempts. Your account has been locked for 30 minutes.'
        );
      }

      await vendor.save();
      const attemptsLeft = 3 - vendor.otpFailedAttempts;
      throw new BadRequestException(
        `${result.message || 'Invalid or expired OTP'}. ${attemptsLeft} attempt${attemptsLeft > 1 ? 's' : ''} remaining.`
      );
    }

    // Mark as verified and reset failed attempts
    vendor.isVerified = true;
    vendor.otpFailedAttempts = 0;
    vendor.otpLockoutUntil = undefined;

    const newCompany = new this.companyModel({
      ...Company,
      companyName:" ",
      cacNumber:" ",
      tin:" ",
      address:" ",
      lga:" ",
      categories:[],
      userId:vendor._id
    })
    const savedCompany = await newCompany.save();

    vendor.companyId = savedCompany._id as Types.ObjectId;

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

  async getCompanyIdByUserId(userId: string): Promise<string | null> {
    try {
      const vendor = await this.vendorModel.findById(userId).select('companyId').lean();
      return vendor?.companyId ? vendor.companyId.toString() : null;
    } catch (error) {
      this.Logger.error(`Error fetching companyId for userId ${userId}: ${error.message}`);
      return null;
    }
  }

  async getRegistrationPayment(vendorId: string) {
    // Find vendor
    const vendor = await this.vendorModel.findById(vendorId);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    // Find company
    const company = await this.companyModel.findById(vendor.companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Find registration payment (type = 'new')
    const registrationPayment = await this.paymentModel
      .findOne({
        companyId: company._id,
        type: 'new'
      })
      .populate('companyId', 'companyName cacNumber')
      .populate('applicationId', 'applicationId applicationStatus')
      .sort({ createdAt: -1 });

    if (!registrationPayment) {
      throw new NotFoundException('No registration payment found for this vendor');
    }

    return registrationPayment;
  }
}
