import { ConflictException, Injectable, NotFoundException, BadRequestException, Inject, forwardRef, UnauthorizedException, InternalServerErrorException, NotImplementedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { UpdateVendorSettingsDto } from './dto/update-vendor-settings.dto';
import { companyForm, renewalSteps, Vendor, VendorDocument } from './entities/vendor.schema';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import TokenHandlers from 'src/lib/generateToken';
import { updateRegistrationDto } from './dto/update-registration.dto';
import { Company, CompanyDocument, Directors, DirectorsDocument, Status } from '../companies/entities/company.schema';
import { verificationDocuments, verificationDocument, Status as DocumentStatus, verificationDocPreset } from '../documents/entities/document.schema';
import { Payment, PaymentDocument, PaymentStatus, paymentType } from '../payments/entities/payment.schema';
import { Application, ApplicationDocument } from '../applications/entities/application.schema';
import { loginDto } from './dto/logn.dto';
import { S3Client } from '@aws-sdk/client-s3';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VendorActivityLog, VendorActivityLogDocument, ActivityType } from './entities/vendor-activity-log.schema';
import { renewRegistrationDto } from './dto/renew-registration-dto';
import { replaceDocumentDto } from './dto/replace-document.dto';
import { changePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginHistory } from 'src/types/types';
import { parseUserAgent } from 'src/helpers/loginHelpers';
import { enrichWithLocation } from '../helpers/loginHelpers';

@Injectable()
export class VendorsService {
  private s3: S3Client;
  private readonly Logger = new Logger(Vendor.name)

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(Directors.name) private directorsModel: Model<DirectorsDocument>,
    @InjectModel(verificationDocuments.name) private verificationDocumentModel: Model<verificationDocument>,
    @InjectModel(verificationDocPreset.name) private verificationDocumentPresetModel: Model<verificationDocPreset>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    @InjectModel(VendorActivityLog.name) private activityLogModel: Model<VendorActivityLogDocument>,
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
  async login(body:loginDto, req:Request): Promise<any> {
    const vendor = await this.vendorModel.findOne({ email:body.email }).exec();
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    if(!vendor.isVerified){
      throw new UnauthorizedException('Email not verified')
    }
    const isPasswordValid = await bcrypt.compare(body.password, vendor.password);
    if (!isPasswordValid) {
      
      let loginData = await this.getLoginHistoryFromRequest(req);
      loginData = await enrichWithLocation(loginData);

      // Save to database with generated ID
      const loginHistory: LoginHistory = {
        ...loginData as Required<LoginHistory>,
        status: 'failed'
      };
      vendor.loginHistory.push(loginHistory);
      await vendor.save();

      throw new BadRequestException('Invalid password');
    }
    const { password: _, ...user } = vendor.toObject();
    console.log(user)
    const accessToken =  this.tokenHandlers.generateToken(user)
    
    vendor.accessToken = accessToken;
    await vendor.save();

    let loginData = await this.getLoginHistoryFromRequest(req);
    loginData = await enrichWithLocation(loginData);

    // Save to database with generated ID
    const loginHistory: LoginHistory = {
      ...loginData as Required<LoginHistory>,
      status: 'success'
    };

    vendor.loginHistory.push(loginHistory);
    await vendor.save();

    return {
      message:"Login Successful",
      token:vendor.accessToken
    };
  }

  async logout(req:any): Promise<any>{
    const authHeader = req?.headers?.authorization;
    
    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Could not find your authorization token')
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '').trim()
      : authHeader.trim();

    if (!token) {
      throw new UnauthorizedException('Could not find your authorization token')
    }

    const vendor = await this.vendorModel.findOne({ accessToken: token }).exec();
    if (!vendor) {
      throw new UnauthorizedException('Invalid token')
    }

    vendor.accessToken = undefined;
    await vendor.save();

    return {
      message: 'Logout successful',
    }
  }

  /**
   * change password
   */
  async changePassword(id:string, body:changePasswordDto, authToken:string){
    const vendor = await this.vendorModel.findById(id)
    
    if(!vendor){
      throw new NotFoundException('Vendor not found')
    }

    if(vendor.accessToken !== authToken){
      throw new UnauthorizedException('Invalid or Expired token')
    }

    const isCurrentPassword = await bcrypt.compare(body.currentPassword, vendor.password);
    
    if(!isCurrentPassword){
      throw new BadRequestException('Current password does not match')
    }

    const isCurrentPasswordAndNewSame = await bcrypt.compare(body.newPassword, vendor.password)
    if(isCurrentPasswordAndNewSame){
      throw new BadRequestException('New password cannot be thesame as current password')
    }

    if (body.newPassword !== body.confirmPassword){
      throw new BadRequestException('new password and confiirm password do not match')
    }

    const salt = await bcrypt.genSalt(10);
    const hashNewPassword = await bcrypt.hash(body.newPassword, salt)
    try{
      if(hashNewPassword){
        vendor.password = hashNewPassword;
        await vendor.save();
        return {
          message:"Password changed successfully"
        }
      }
    }catch(e){
      this.Logger.log(e)
      throw new InternalServerErrorException('Failed to change password')
    }
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
  async getProfile(userId: string, authToken:string): Promise<Omit<Vendor, 'password'>> {
    
    if (!userId) {
      throw new UnauthorizedException('An error occured');
    }

    try{
      // Fetch vendor profile without password
      const vendor = await this.vendorModel.findById(userId).select('-password').exec();
      
      if (!vendor) {
        throw new NotFoundException(`Vendor with ID ${userId} not found`);
      }

      if(vendor.accessToken !== authToken){
        throw new UnauthorizedException('Invalid or Expired token')
      }
      
      return vendor.toObject();
    }catch(err){
      this.Logger.error(err)
      throw new InternalServerErrorException("An error occured")
    }
  }

  async getLoginHistory(vendorId:string, token:string){
    try{
      // Fetch vendor profile without password
      const vendor = await this.vendorModel.findById(vendorId);
      
      if (!vendor) {
        throw new NotFoundException(`Vendor with ID ${vendorId} not found`);
      }

      if(vendor.accessToken !== token){
        throw new UnauthorizedException('Invalid or Expired token')
      }

      const loginHistory = vendor.loginHistory;
    
      const latestAttempts = loginHistory
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

      return latestAttempts;
      
    }catch(err){
      this.Logger.error(err)
      throw new InternalServerErrorException("An error occured")
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
  async update(id: string, updateVendorDto: UpdateVendorDto, authToken:string): Promise<Vendor> {
    if (updateVendorDto.password) {
      const salt = await bcrypt.genSalt();
      updateVendorDto.password = await bcrypt.hash(updateVendorDto.password, salt);
    }
    const vendor = await this.vendorModel.findById(id).exec();
    
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    
    if(vendor.accessToken !== authToken){
      throw new UnauthorizedException('Invalid or Expired token')
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
  async registerCompany(userId:string, updateRegistrationDto:updateRegistrationDto, authToken:string): Promise<any> {
    
    const vendor = await this.vendorModel.findById(userId).exec();
    
    if (!vendor) {
      throw new NotFoundException(`Vendor not found`);
    }

    if(vendor.accessToken !== authToken){
      throw new UnauthorizedException('Invalid or Expired token')
    }

    try{
      if(updateRegistrationDto.company){
        const checkIfNameExists = await this.companyModel.findOne({companyName:updateRegistrationDto.company.companyName});
        
        if(!checkIfNameExists || checkIfNameExists?.userId.equals(vendor._id as Types.ObjectId)){
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
            throw new NotImplementedException('There was an error registering/updating company')
          }
        }else{
          this.Logger.debug(`incoming id:${vendor._id} / existing name vid: ${checkIfNameExists?.userId}`)
          throw new ConflictException('company name already exists')
        }
      }
      /**
       * update company registration for directors
       */
      if(updateRegistrationDto.directors){
        try{
          // Check if directors already exist for this vendor
          let directors = await this.directorsModel.findOne({userId:vendor._id}).exec()
          
          let result:any;
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
            
            // Update vendor form step to bank details if still on directors step
            if (vendor.companyForm === companyForm.STEP2) {
              vendor.companyForm = companyForm.STEP3;
              await vendor.save();
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
          if(!company){
            throw new NotFoundException('Company not found. Please complete company registration first.');
          }
          
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
          };
        }catch(err){
          this.Logger.debug(`${err}`)
          if (err instanceof NotFoundException) {
            throw err;
          }
          throw new ConflictException('Error updating bank details')
        }
      }

      /**
       * update company registration for documents
       */
      if(updateRegistrationDto.documents){
        console.log(updateRegistrationDto.documents)
        try{
          const company = await this.companyModel.findOne({userId:vendor._id});
          const verificationDocPresets = await this.verificationDocumentPresetModel.find({});

          const hasPresets = verificationDocPresets && verificationDocPresets.length > 0;
          let documentsToProcess = updateRegistrationDto.documents;

          if (hasPresets) {
            const validDocTypes = new Set(
              verificationDocPresets.map((preset) =>
                preset.documentName.toLowerCase().trim(),
              ),
            );

            documentsToProcess = updateRegistrationDto.documents.filter(
              (doc) =>
                doc.documentType &&
                validDocTypes.has(doc.documentType.toLowerCase().trim()),
            );
          }

          let firstTimeDocUpload = true;
          const sirvCdnUrl = (this.configService.get<string>('SIRV_CDN_URL') || '').trim();
          const normalizedSirvCdnUrl = sirvCdnUrl.endsWith('/') ? sirvCdnUrl.slice(0, -1) : sirvCdnUrl;
          if (!normalizedSirvCdnUrl) {
            throw new InternalServerErrorException('SIRV_CDN_URL is not configured');
          }
          // Process each document - create or update individual document records
          const savedDocs = await Promise.all(
            documentsToProcess.map(async (doc) => {
              // validate each document sent to ensure that it comes from the right url
              const fileUrl = (doc.fileUrl || '').trim();

              if (!fileUrl) {
                throw new BadRequestException('Document fileUrl is required');
              }

              if (!fileUrl.startsWith(normalizedSirvCdnUrl)) {
                throw new BadRequestException(`Invalid document fileUrl. Expected URL to start with ${normalizedSirvCdnUrl}`);
              }

              // escape document type
              const escapedDocumentType = (doc.documentType || '').trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

              // Check if document with same type already exists for this vendor
              const existingDoc = await this.verificationDocumentModel.findOne({
                vendor: vendor._id,
                documentType: { $regex: new RegExp(`^${escapedDocumentType}$`, 'i') },
              });

              if (existingDoc ) {
                // Update existing document
                const previousFileUrl = existingDoc.fileUrl;
                existingDoc.fileUrl = doc.fileUrl;
                existingDoc.validFrom = doc.validFrom;
                existingDoc.validTo = doc.validTo;
                existingDoc.uploadedDate = doc.uploadedDate;
                existingDoc.fileName = doc.fileName;
                existingDoc.fileSize = doc.fileSize;
                existingDoc.fileType = doc.fileType;
                existingDoc.documentType = doc.documentType;
                existingDoc.validFor = doc.validFor;
                existingDoc.hasValidityPeriod = doc.hasValidityPeriod;
                // if (previousFileUrl !== doc.fileUrl) {
                  existingDoc.status = {
                    status: DocumentStatus.PENDING,
                  };
                // }

                return await existingDoc.save();
              } else {
                // Create new document record
                try {
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
                      status: DocumentStatus.PENDING,
                    },
                  });
                  const response = await newDoc.save();
                  return response
                } catch (e) {
                  this.Logger.log(e);
                  throw new ConflictException('there was an error uploading documents');
                }
              }
            }),
          );

          const allVendorDocs = await this.verificationDocumentModel.find({
            vendor: vendor._id,
          });

          if (company) {
            company.documents = allVendorDocs.map(
              (doc) => doc?._id as Types.ObjectId,
            );
            await company.save();
          }

          firstTimeDocUpload = false;

          if (hasPresets) {
            const requiredPresetNames = verificationDocPresets
              .filter((preset) => preset.isRequired)
              .map((preset) => preset.documentName.toLowerCase().trim());

            const existingTypes = allVendorDocs.map((doc) =>
              doc.documentType.toLowerCase().trim(),
            );

            const missingRequiredDocuments = requiredPresetNames.filter(
              (name) => !existingTypes.includes(name),
            );

            if (missingRequiredDocuments.length > 0) {
              throw new BadRequestException({
                message: 'Some required documents are missing',
                missingDocuments: missingRequiredDocuments,
              });
            }
            if(firstTimeDocUpload){
              vendor.companyForm = companyForm.STEP5;
              await vendor.save();
            }
          }

          return {
            message: "Documents uploaded successfully",
            documents: savedDocs,
          };
        }catch(err){
          this.Logger.debug(`${err}`)
          if (err instanceof BadRequestException) {
            throw err;
          }
          throw new ConflictException('Error updating documents: ' + err.message)
        }
      }

      /**
       * update company registration for categories and grade
       */
      if(updateRegistrationDto.categoryAndGrade){
        try{
          const company = await this.companyModel.findOne({userId:vendor._id})
          if(!company){
            new Logger.error("company not found")
            throw new NotFoundException("Company not found. Please register company first.")
          }
          company.category = updateRegistrationDto.categoryAndGrade.category;
          company.mda = updateRegistrationDto.categoryAndGrade.mda;
          company.grade = updateRegistrationDto.categoryAndGrade.grade;
          await company.save();

          const hasAlreadyPaid = await this.paymentModel.findOne({vendorId:new Types.ObjectId(vendor._id as Types.ObjectId), type:paymentType.PROCESSINGFEE, status:PaymentStatus.VERIFIED})

          if(hasAlreadyPaid){
            vendor.companyForm = companyForm.COMPLETE;
            await vendor.save();
            return {
              message: "Category, mda and grade updated successfully",
              result: company,
              nextStep: vendor.companyForm
            }
          }

          return {
            message: "Category, mda and grade updated successfully. Proceed to payment",
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
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new NotImplementedException(`An error occured`);
    }
  }

  /**Restart registration */
  async restartRegistration(userId:string, authToken:string){
    const vendor = await this.vendorModel.findById(new Types.ObjectId(userId));

    if(!vendor){
      throw new NotFoundException("vendor not found")
    }

    if(vendor.accessToken !== authToken){
      throw new UnauthorizedException('Invalid or Expired token')
    }

    vendor.companyForm = companyForm.STEP1;
    await vendor.save();

    return {
      message: "Registration restarted successfully",
      nextStep: vendor.companyForm
    }

  }

  /** */
  async renewRegistration(userId:string, renewRegistrationDto:renewRegistrationDto){
    if(!renewRegistrationDto.documents || renewRegistrationDto.documents.length === 0){
      this.Logger.log('Please upload at least 1 document')
      throw new BadRequestException('Please upload at least 1 document')
    }
    try{
      const vendor = await this.vendorModel.findById(userId);
      
      if(!vendor){
        this.Logger.log(`Vendor with id ${userId} not found`)
        throw new NotFoundException(`Vendor with id ${userId} not found`)
      }
    
      const documents = await this.verificationDocumentModel.find({
        vendor:userId
      })

      if(!documents || documents.length === 0){
        this.Logger.log(`No documents found for vendor with id ${userId}`)
        throw new NotFoundException(`No documents found for this vendor`)
      }

      const updatedDocuments = await Promise.all(
        renewRegistrationDto.documents.map(async (doc) => {
          const escapedDocumentType = (doc.documentType || '').trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const existingDoc = await this.verificationDocumentModel.findOne({
            vendor: userId,
            documentType: { $regex: new RegExp(`^${escapedDocumentType}$`, 'i') },
          });
          
          if (existingDoc) {
            const previousFileUrl = existingDoc.fileUrl;
            existingDoc.fileUrl = doc.fileUrl;
            existingDoc.validFrom = doc.validFrom;
            existingDoc.validTo = doc.validTo;
            existingDoc.uploadedDate = doc.uploadedDate;
            existingDoc.fileName = doc.fileName;
            existingDoc.fileSize = doc.fileSize;
            existingDoc.fileType = doc.fileType;
            existingDoc.validFor = doc.validFor;
            existingDoc.hasValidityPeriod = doc.hasValidityPeriod;
            if (previousFileUrl !== doc.fileUrl) {
              existingDoc.status = {
                status:DocumentStatus.PENDING,
              }
            }
            await existingDoc.save();
            return existingDoc;
            
          } else {
            const newDoc = new this.verificationDocumentModel({
              vendor: userId,
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
            const response = await newDoc.save();
            return response;
          }
        })
      );
      //

      const company = await this.companyModel.findOne({ userId: vendor._id }).exec();
      if (!company) {
        throw new NotFoundException('Company not found. Please register company first.')
      }

      company.documents = updatedDocuments.map((doc) => doc?._id as Types.ObjectId);
      await company.save();

      if(!updatedDocuments){
        throw new ConflictException('Error updating documents')
      }

      vendor.renewalStep = renewalSteps.STEP2;
      await vendor.save();


      return {
        message: 'Documents updated successfully',
        documents: updatedDocuments
      }
      
    }catch(err){
      this.Logger.debug(`${err}`)
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
      userId:vendor._id
    })
    const savedCompany = await newCompany.save();

    vendor.companyId = savedCompany._id as Types.ObjectId;

    const newVendor = await vendor.save();

    const { password: _, ...user } = newVendor.toObject();

    const token = this.tokenHandlers.generateToken(user)
    
    vendor.accessToken = token;
    
    await vendor.save();

    return { 
      success: true, 
      message: 'Email verified successfully. Your account is now active.',
      data: user as any,
      token
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

  async getRegistrationPayment(vendorId: string, authToken:string) {
    // Find vendor
    const vendor = await this.vendorModel.findById(vendorId);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }
    
    if(vendor.accessToken !== authToken){
      throw new UnauthorizedException('Invalid or Expired token')
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

  async getPaymentHistory(
    vendorId: string, 
    authToken:string,
    page = 1, 
    limit = 10,
    search?: string,
    year?: number,
    type?: string,
  ) {
    // Find vendor
    const vendor = await this.vendorModel.findById(vendorId);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if(vendor.accessToken !== authToken){
      throw new UnauthorizedException('Invalid or Expired token')
    }

    // Find company
    const company = await this.companyModel.findById(vendor.companyId);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const skip = (page - 1) * limit;

    // Build query filter
    const queryFilter: any = { companyId: company._id };

    // Add search filter (search by ID, description, or reference)
    if (search) {
      queryFilter.$or = [
        { transactionReference: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Add type filter
    if (type) {
      queryFilter.type = type;
    }

    // Add year filter
    if (year) {
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);
      queryFilter.paymentDate = { $gte: startOfYear, $lte: endOfYear };
    }

    // Get current year date range for totals
    const currentYear = new Date().getFullYear();
    const startOfCurrentYear = new Date(currentYear, 0, 1);
    const endOfCurrentYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

    // Find all payments for this company with pagination and totals
    const [payments, total, allPayments, paymentsThisYear] = await Promise.all([
      this.paymentModel
        .find(queryFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.paymentModel.countDocuments(queryFilter),
      this.paymentModel
        .find({ companyId: company._id, status: 'verified' })
        .exec(),
      this.paymentModel
        .find({ 
          companyId: company._id, 
          status: 'verified',
          paymentDate: { $gte: startOfCurrentYear, $lte: endOfCurrentYear }
        })
        .exec(),
    ]);

    if (!payments || payments.length === 0) {
      throw new NotFoundException('No payment history found for this vendor');
    }

    const flatPaymentArray = payments.map((payment)=>{
      return {
        amount: payment.amount,
        reference:payment.transactionReference,
        status:payment.status,
        date:payment.paymentDate,
        description:payment.description,
        type: payment.type
      }
    })

    // Calculate total amount paid of all time (only verified payments)
    const totalAmountPaid = allPayments.reduce((total, payment) => total + payment.amount, 0);

    // Calculate total amount paid this year (only verified payments)
    const totalAmountThisYear = paymentsThisYear.reduce((total, payment) => total + payment.amount, 0);

    return {
      success: true,
      totalAmountPaid: totalAmountPaid,
      totalThisYear: totalAmountThisYear,
      totalTransactions: total,
      paymentTable: flatPaymentArray,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get applications for a vendor by their companyId
   * 
   * @param companyId - Company ID (MongoDB ObjectId)
   * @returns Array of applications for the vendor's company
   * @throws {NotFoundException} If company not found or no applications exist
   * 
   * @description
   * Retrieves all applications associated with a vendor's company,
   * including populated company details and documents
   */
  async getVendorApplication(userId:string, authToken:string){
    try {
      // Verify company exists
      const vendor = await this.vendorModel.findById(userId);

      if(!vendor){
        throw new NotFoundException("Vendor not found")
      }

      if(vendor.accessToken !== authToken){
        throw new UnauthorizedException('Invalid or expired token')
      }
      
      const company = await this.companyModel.findById(vendor.companyId);
      
      if (!company) {
        throw new NotFoundException('Company not found');
      }

      // Find the application
      const application = await this.applicationModel
        .findOne({ companyId: company._id})
        .populate({
          path: 'companyId',
          populate: {
            path: 'documents'
          }
        })
        .sort({ createdAt: -1 })
        .exec();

      if (!application) {
        throw new NotFoundException('No applications found for this company');
      }

      this.Logger.log(application)

      return {
        status: application.currentStatus
      }

    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.Logger.error(`Error fetching vendor applications: ${err.message}`);
      throw new BadRequestException('Failed to retrieve applications');
    }
  }

  /**
   * Retrieves the complete application timeline for a vendor's company
   * @param userId - The vendor's user ID
   * @returns Array of timeline entries with status, timestamp, and notes
   */
  async getApplicationTimeline(userId: string, authToken:string) {
    try {
      // Verify vendor exists
      const vendor = await this.vendorModel.findById(userId);

      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      if(vendor.accessToken !== authToken){
        throw new UnauthorizedException('Invalid or expired token')
      }
      
      // Verify company exists
      const company = await this.companyModel.findById(vendor.companyId);
      if (!company) {
        throw new NotFoundException('Company not found');
      }

      // Find the application
      const application = await this.applicationModel
        .findOne({ companyId: company._id })
        .sort({ createdAt: -1 })
        .exec();

      if (!application) {
        throw new NotFoundException('No applications found for this company');
      }

      // Return the complete timeline
      const timeline = application.applicationTimeline.map((entry) => ({
        status: entry.status,
        timestamp: entry.timestamp,
      }));

      return timeline;

    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.Logger.error(`Error fetching application timeline: ${err.message}`);
      throw new BadRequestException('Failed to retrieve application timeline');
    }
  }

  /**
   * Create an activity log entry for a vendor
   * @param vendorId - Vendor's user ID
   * @param activityType - Type of activity
   * @param description - Description of the activity
   * @param metadata - Optional additional data
   * @param ipAddress - Optional IP address
   * @param userAgent - Optional user agent
   */
  async createActivityLog(
    vendorId: string | Types.ObjectId,
    activityType: ActivityType,
    description: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string
  ): Promise<VendorActivityLog> {
    try {
      const log = new this.activityLogModel({
        vendorId: new Types.ObjectId(vendorId),
        activityType,
        description,
        metadata,
        ipAddress,
        userAgent
      });

      return await log.save();
    } catch (err) {
      this.Logger.error(`Error creating activity log: ${err.message}`);
      throw new BadRequestException('Failed to create activity log');
    }
  }

  /**
   * Get the latest 5 activity logs for a vendor
   * @param userId - Vendor's user ID
   * @returns Latest 5 activity logs
   */
  async getVendorActivityLogs(userId: string, authToken:string) {
    try {
      // Verify vendor exists
      const vendor = await this.vendorModel.findById(userId);

      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      if(vendor.accessToken !== authToken){
        throw new UnauthorizedException('Invalid or expired token')
      }

      // Get latest 5 activity logs
      const logs = await this.activityLogModel
        .find({ vendorId: vendor._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('activityType description metadata createdAt')
        .lean<Array<{
          activityType: ActivityType;
          description: string;
          metadata?: Record<string, any>;
          createdAt: Date;
        }>>()
        .exec();

      return logs.map(log => ({
        activityType: log.activityType,
        description: log.description,
        metadata: log.metadata,
        timestamp: log.createdAt
      }));

    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.Logger.error(`Error fetching vendor activity logs: ${err.message}`);
      throw new BadRequestException('Failed to retrieve activity logs');
    }
  }

  async deactivateMyAccount(id:any, authToken:string){
    try {
      const vendor = await this.vendorModel.findById(id);
      
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      }

      if(vendor.accessToken !== authToken){
        throw new UnauthorizedException('Invalid or expired token')
      }

      vendor.isActive = false;
      vendor.originalEmail = vendor.email,
      vendor.email = " "
      await vendor.save();

      // 
    
      return vendor;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.Logger.error(`Error deactivating vendor account: ${err.message}`);
      throw new BadRequestException('Failed to deactivate vendor account');
    }
  }

  async replaceDocument(id:string, replaceDocumentDto:replaceDocumentDto, vendorId:string, authToken:string){
    try {
      const newDocument = await this.verificationDocumentModel.create(replaceDocumentDto.document)
      
      if(!newDocument){
        throw new ConflictException('there was an error uploading the document')
      }
      const vendor = await this.vendorModel.findById(vendorId);
      
      if (!vendor) {
        throw new NotFoundException('Vendor not found');
      } 
      
      if(vendor.accessToken !== authToken){
        throw new UnauthorizedException('Invalid or expired token')
      }

      const company  = await this.companyModel.findOne({userId:new Types.ObjectId(vendorId)})
      if (!company) {
        throw new NotFoundException('Company not found');
      }
      if (company.documents) {
        company.documents = company.documents.map((document) => {
          if (document.toString() === new Types.ObjectId(id).toString()) {
            return newDocument._id as Types.ObjectId;
          }
          return document;
        });
      }
      await company.save();
      return {
        message:"document uploaded successfully",
        document:newDocument
      };
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.Logger.error(`Error replacing document: ${err.message}`);
      throw new BadRequestException('Failed to replace document');
    }
  }

  /**
   * Initiate password reset process
   * 
   * @param email - User's email address
   * @returns Success message
   * @throws {NotFoundException} If no vendor found with the email
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const vendor = await this.vendorModel.findOne({ 
      email:email
    });
    if (!vendor) {
      // For security, don't reveal if the email exists or not
      return { message: 'If an account with this email exists, a password reset link has been sent' };
    }

    try {
      // Generate a password reset token (valid for 1 hour)
      const resetToken = this.jwtService.sign({
        id: vendor._id, 
        email: vendor.email,
        type: 'password_reset',
        expiresIn:'15 minutes'
      },{
        expiresIn:'15m'
      });

      // Send password reset email
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      this.Logger.log(resetToken)
      await this.emailService.sendResetPasswordLink(resetLink, email);
      return { message: 'If an account with this email exists, a password reset link has been sent' };
    } catch (error) {
      this.Logger.error('Error sending password reset email:', error);
      throw new InternalServerErrorException('Failed to send password reset email');
    }
  }

  /**
   * Reset user's password using a valid reset token
   * 
   * @param token - Password reset token
   * @param newPassword - New password
   * @returns Success message
   * @throws {BadRequestException} If token is invalid or expired
   * @throws {NotFoundException} If user not found
   */
  async resetPassword(body:ResetPasswordDto, token:string): Promise<{ message: string }> {
    try {
      //decode token
      const decodeToken = await this.jwtService.verify(token);

      if(!decodeToken || decodeToken.type !== 'password_reset'){
        throw new UnauthorizedException('You are unauthorized to access this resource');
      }
      // Find the user
      const vendor = await this.vendorModel.findById(decodeToken.id);
      
      if (!vendor) {
        throw new NotFoundException('User not found');
      }

      // Verify the token
      if (body.newPassword !== body.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
      
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(body.newPassword, salt);

      // Update the password
      vendor.password = hashedPassword;
      await vendor.save();

      // Log the password reset activity
      await this.createActivityLog(
        vendor._id as Types.ObjectId,
        ActivityType.PASSWORD_CHANGED,
        'Password was reset using password reset link',
        { resetVia: 'forgot-password' }
      );

      this.Logger.log(`${vendor.fullname} has reset his password successfully`)
      return { message: 'Password has been reset successfully' };
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException('Invalid token');
      }
      this.Logger.error(error.message)
      throw new ConflictException(`An error occured: ${error.message}`);
    }
  }

  async updateSettings(vendorId: string, dto: UpdateVendorSettingsDto, authToken: string) {
    const vendor = await this.vendorModel.findById(vendorId).exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (vendor.accessToken !== authToken) {
      throw new UnauthorizedException('Invalid or Expired token');
    }

    const defaultSettings = {
      notificationChannels: { email: true },
      notificationPreferences: {
        documentExpiryAlerts: true,
        renewalReminders: true,
        applicationUpdates: true,
        paymentConfirmations: true,
        systemUpdates: true,
        loginAlerts: true,
      },
    };

    const current = (vendor.settings as any) || defaultSettings;

    vendor.settings = {
      notificationChannels: {
        ...(current.notificationChannels || defaultSettings.notificationChannels),
        ...(dto.notificationChannels || {}),
      },
      notificationPreferences: {
        ...(current.notificationPreferences || defaultSettings.notificationPreferences),
        ...(dto.notificationPreferences || {}),
      },
    } as any;

    await vendor.save();

    return {
      message: 'Settings updated successfully',
      settings: vendor.settings,
    };
  }

  async getSettings(vendorId: string, authToken: string) {
    const vendor = await this.vendorModel.findById(vendorId).exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    if (vendor.accessToken !== authToken) {
      throw new UnauthorizedException('Invalid or Expired token');
    }

    const defaultSettings = {
      notificationChannels: { email: true },
      notificationPreferences: {
        documentExpiryAlerts: true,
        renewalReminders: true,
        applicationUpdates: true,
        paymentConfirmations: true,
        systemUpdates: true,
        loginAlerts: true,
      },
    };

    const currentSettings = (vendor.settings as any) || defaultSettings;

    return {
      message: 'Settings retrieved successfully',
      settings: currentSettings,
    };
  }

  async getLoginHistoryFromRequest(req: Request): Promise<Partial<LoginHistory>> {
    // Get IP address (handles proxies)
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() 
        || req.headers['x-real-ip']?.toString()
        || req.socket.remoteAddress 
        || '';

    // Parse User-Agent for device info
    const userAgent = req.headers['user-agent'] || '';
    const deviceInfo = await parseUserAgent(userAgent);

    // Get timestamp
    const now = new Date();
    const timestamp = now.toISOString();
    const date = now.toLocaleDateString();

    return {
        device: deviceInfo.device,
        deviceType: deviceInfo.deviceType,
        ip: ip,
        timestamp: timestamp,
        date: date,
        status: 'success', // or determine based on auth result
    };
  }

}
