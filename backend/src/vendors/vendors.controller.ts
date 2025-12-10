import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, BadRequestException, Req, Headers, UseGuards, UseInterceptors, UploadedFiles, UnauthorizedException, Query, Logger } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth, ApiHeader, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { mode, necessaryDocument, updateRegistrationDto } from './dto/update-registration.dto';
import { loginDto } from './dto/logn.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';
import { replaceDocumentDto } from './dto/replace-document.dto';
import { changePasswordDto } from './dto/change-password.dto';

@ApiTags('vendors')
@Controller('vendors')
export class VendorsController {
  private readonly logger:Logger = new Logger(VendorsController.name);
  constructor(
    private readonly vendorsService: VendorsService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Create a new vendor account
   * 
   * @param createVendorDto - Vendor registration data including fullname, email, phone, and password
   * @returns Success message indicating registration completion and verification email sent
   * 
   * @example
   * POST /vendors
   * Body: {
   *   "fullname": "John Doe",
   *   "email": "vendor@example.com",
   *   "phoneNo": "08012345678",
   *   "password": "SecurePass123!"
   * }
   */
  @Post()
  @ApiOperation({ 
    summary: 'Create a new vendor account',
    description: 'Registers a new vendor with the provided information. The email must be unique across all vendors.'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Vendor account created successfully',
    type: CreateVendorDto
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A vendor with the provided email already exists'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data'
  })
  @ApiBody({ 
    type: CreateVendorDto,
    examples: {
      valid: {
        summary: 'Valid vendor creation',
        value: {
          fullname: 'John Doe',
          email: 'vendor@example.com',
          phoneNo: '08012345678',
          password: 'SecurePass123!'
        }
      }
    }
  })
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.create(createVendorDto);
  }

  /**
   * Vendor login
   * 
   * @param body - Login credentials containing email and password
   * @returns User object and JWT authentication token
   * 
   * @example
   * POST /vendors/login
   * Body: {
   *   "email": "vendor@example.com",
   *   "password": "SecurePass123!"
   * }
   */
  @Post('login')
  @ApiOperation({ summary: 'Vendor login' })
  @ApiBody({
    description: 'Vendor login credentials',
    type: loginDto,
    schema: {
      properties: {
        email: { type: 'string', example: 'vendor@example.com' },
        password: { type: 'string', example: 'SecurePass123!' }
      },
      required: ['email', 'password']
    }
  })
  @ApiResponse({ status: 200, description: 'Login successful', schema: { type: 'object', properties: { token: { type: 'string' } } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  login(@Body() body: loginDto) {
    return this.vendorsService.login(body);
  }

  /** 
   * Change Password for vendor
  */
  @Patch('change-password')
  changePassword(@Body() body:changePasswordDto, @Req() req:any){
    const authToken = req.headers?.authorization?.replace("Bearer ", "")
    if(!authToken){
      throw new UnauthorizedException('Could not find your authorization token')
    }

    const decodedId = this.jwtService.decode(authToken)._id
    if(!decodedId){
      throw new UnauthorizedException('You are not authorized to access this resource')
    }

    return this.vendorsService.changePassword(decodedId, body)
    
  }

  /**
   * Get all vendor accounts with pagination and filtering
   * 
   * @param page - Page number (default: 1)
   * @param limit - Records per page (default: 10, max: 100)
   * @param search - Search term for fullname, email, or phone
   * @param isVerified - Filter by verification status (true/false)
   * @param companyForm - Filter by registration step
   * @returns Paginated array of vendors with metadata
   * 
   * @example
   * GET /vendors?page=1&limit=10&search=john&isVerified=true&companyForm=complete
   */
  @Get()
  findAll(
    @Req() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('isVerified') isVerified?: string,
    @Query('companyForm') companyForm?: string,
  ) {
    const authHeader = req.headers.authorization;
    const user = this.jwtService.decode(authHeader.split(' ')[1]);
    if (!user._id || !user.role || user.role !== 'Admin') {
      throw new UnauthorizedException('Unauthorized');
    }

    // Parse query parameters
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const isVerifiedBool = isVerified === 'true' ? true : isVerified === 'false' ? false : undefined;

    return this.vendorsService.findAll(
      pageNum,
      limitNum,
      search,
      isVerifiedBool,
      companyForm as any,
    );
  }

  /**
   * Get authenticated vendor profile
   * 
   * @param authorization - JWT token from Authorization header
   * @returns Vendor profile details without password
   * @throws {NotFoundException} If vendor not found
   * @throws {UnauthorizedException} If JWT token is invalid or missing
   * 
   * @description
   * Retrieves the profile of the currently authenticated vendor using the JWT token.
   * The vendor ID is extracted by decoding the JWT token from the Authorization header.
   * Requires a valid JWT token in the Authorization header as "Bearer {token}".
   * 
   * @example
   * GET /vendors/profile
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get authenticated vendor profile',
    description: 'Retrieves the profile of the currently logged-in vendor using the JWT token from the Authorization header.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vendor profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        fullname: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'vendor@example.com' },
        phoneNo: { type: 'string', example: '08012345678' },
        isVerified: { type: 'boolean', example: true },
        certificateId: { type: 'string', example: 'CERT123456' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing JWT token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid or missing token' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vendor not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Vendor with ID 507f1f77bcf86cd799439011 not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  findOne(@Req() req:any) {
    const authHeader = req.headers.authorization;
    const userId = this.jwtService.decode(authHeader.split(' ')[1])._id;
    return this.vendorsService.getProfile(userId);
  }

  /**
   * Register company details for a vendor
   * 
   * @param id - Vendor ID (MongoDB ObjectId)
   * @param updateRegistrationDto - Company registration data including company info, directors, bank details, documents, and categories
   * @returns Success message with saved company, directors, and document data
   * 
   * @example
   * PATCH /vendors/register-company/507f1f77bcf86cd799439011
   * Body: {
   *   "company": {
   *     "companyName": "Tech Solutions Ltd",
   *     "cacNumber": "RC123456",
   *     "tin": "12345678-0001"
   *   }
   * }
   */
  @Patch('/register-company')
  @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ 
    summary: 'Register company details for a vendor',
    description: 'Updates vendor registration with company information, directors, bank details, documents, and service categories. All fields are optional to allow partial updates. Files can be uploaded for documents.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Company registration updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Categories and grade updated successfully. Proceed to payment'
        },
        result: {
          type: 'object',
          description: 'Company details with updated categories and grade'
        },
        nextStep: {
          type: 'string',
          enum: ['company', 'directors', 'bankDetails', 'documents', 'categoriesAndGrade', 'complete'],
          description: 'Current step in the registration process'
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vendor not found with the provided ID'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data'
  })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        company: {
          type: 'object',
          properties: {
            companyName: { type: 'string', example: 'Tech Solutions Ltd' },
            cacNumber: { type: 'string', example: 'RC123456' },
            tin: { type: 'string', example: '12345678-0001' },
            businessAddres: { type: 'string', example: '123 Business Street, Victoria Island' },
            lga: { type: 'string', example: 'Lagos Island' },
            website: { type: 'string', example: 'https://techsolutions.com' }
          }
        },
        directors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              fullName: { type: 'string', example: 'Jane Smith' },
              idType: { type: 'string', example: 'National ID' },
              id: { type: 'string', example: 'NIN12345678' },
              phone: { type: 'number', example: 2348012345678 },
              email: { type: 'string', example: 'jane.smith@techsolutions.com' }
            }
          }
        },
        bankDetails: {
          type: 'object',
          properties: {
            bankName: { type: 'string', example: 'First Bank of Nigeria' },
            accountNumber: { type: 'number', example: 1234567890 },
            accountName: { type: 'string', example: 'Tech Solutions Ltd' }
          }
        },
        documents: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              documentType: { type: 'string', example: 'CAC Certificate' },
              documentUrl: {
                type: 'string',
                example: 'https://cdn.example.com/documents/cac-certificate.pdf',
                description: 'URL of the uploaded document file that corresponds to an entry in the files array'
              },
              validFrom: { type: 'string', example: '2023-01-01' },
              validTo: { type: 'string', example: '2028-01-01' }
            },
            required: ['documentType', 'documentUrl']
          },
          description: 'Document metadata; each item should have a matching uploaded file in the files field'
        },
        categoriesAndGrade: {
          type: 'object',
          properties: {
            categories: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  sector: { type: 'string', example: 'Information Technology' },
                  service: { type: 'string', example: 'Software Development' }
                }
              }
            },
            grade: { type: 'string', example: 'Grade A' }
          }
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          },
          description: 'Upload document files (PDF, images, etc.) - corresponds to documents array'
        }
      }
    }
  })
  registerCompany(
    @Req() req:any, 
    @Body() updateRegistrationDto:updateRegistrationDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
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
    if(updateRegistrationDto.mode==mode.RENEWAL){
        return this.vendorsService.renewRegistration(userId, { documents: updateRegistrationDto.documents });
    }
    return this.vendorsService.registerCompany(userId, updateRegistrationDto);
  }

  //

  /**
   * Get all applications for a vendor's company
   * 
   * @param companyId - Company ID (MongoDB ObjectId)
   * @returns Array of applications for the vendor's company
   * 
   * @description
   * Retrieves all applications associated with a vendor's company.
   * Requires authentication. Returns applications with populated company details.
   * 
   * @example
   * GET /vendors/applications/company/507f1f77bcf86cd799439011
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('applications/my-company')
  @ApiOperation({ 
    summary: 'Get vendor application for authenticated user',
    description: 'Retrieves the most recent application for the authenticated vendor\'s company, including populated company details and documents. Requires authentication.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Application retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        applicationId: { type: 'string', example: 'APP-2025-001' },
        contractorName: { type: 'string', example: 'Tech Solutions Ltd' },
        applicationStatus: { 
          type: 'array',
          items: {
            type: 'object',
            properties: {
              status: { type: 'string', example: 'Pending Desk Review' },
              timestamp: { type: 'string', format: 'date-time' },
              notes: { type: 'string', example: 'Application submitted' }
            }
          }
        },
        currentStatus: { type: 'string', example: 'Pending Desk Review' },
        submissionDate: { type: 'string', format: 'date-time' },
        grade: { type: 'string', example: 'A' },
        type: { type: 'string', example: 'new' },
        companyId: { 
          type: 'object',
          description: 'Populated company details with documents'
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Company not found or no applications exist'
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized - Invalid or missing token'
  })
  getVendorApplications(@Req() req: any) {
    if (!req?.headers?.authorization) {
      throw new UnauthorizedException('Authorization header is required');
    }

    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];
      
      if (!token) {
        throw new UnauthorizedException('Invalid authorization token format');
      }

      const decoded = this.jwtService.decode(token);
      
      if (!decoded?._id) {
        throw new UnauthorizedException('Invalid token payload');
      }

      return this.vendorsService.getVendorApplication(decoded._id);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Get application timeline for a vendor's company
   * 
   * @returns Complete timeline of application status changes
   * 
   * @example
   * GET /vendors/application/timeline
   * Headers: { "Authorization": "Bearer <token>" }
   * 
   * Response: {
   *   "applicationId": "APP-2024-001",
   *   "companyName": "ABC Company Ltd",
   *   "currentStatus": "APPROVED",
   *   "timeline": [
   *     {
   *       "status": "PENDING_DESK_REVIEW",
   *       "timestamp": "2024-01-01T10:00:00Z",
   *       "notes": "Application submitted"
   *     },
   *     {
   *       "status": "APPROVED",
   *       "timestamp": "2024-01-05T14:30:00Z",
   *       "notes": "Application approved"
   *     }
   *   ]
   * }
   */
  @Get('my-application-timeline')
  @ApiOperation({ summary: 'Get application timeline for vendor company' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Application timeline retrieved successfully'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Vendor or application not found'
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized - Invalid or missing token'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application timeline retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: [
              'Pending Desk Review',
              'Forwarded to Registrar',
              'Pending Payment',
              'Clarification Requested',
              'SLA Breach',
              'Approved',
              'Rejected'
            ],
            example: 'Pending Desk Review'
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-12-01T10:30:00.000Z'
          }
        }
      },
      example: [
        {
          status: 'Pending Desk Review',
          timestamp: '2024-12-01T10:30:00.000Z'
        },
        {
          status: 'Forwarded to Registrar',
          timestamp: '2024-12-02T14:15:00.000Z'
        },
        {
          status: 'Approved',
          timestamp: '2024-12-05T09:45:00.000Z'
        }
      ]
    }
  })
  getApplicationTimeline(@Req() req: any) {
    if (!req?.headers?.authorization) {
      throw new UnauthorizedException('Authorization header is required');
    }

    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];
      
      if (!token) {
        throw new UnauthorizedException('Invalid authorization token format');
      }

      const decoded = this.jwtService.decode(token);
      
      if (!decoded?._id) {
        throw new UnauthorizedException('Invalid token payload');
      }

      return this.vendorsService.getApplicationTimeline(decoded._id);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Get vendor activity logs
   * 
   * @returns Latest 5 activity logs for the vendor
   * 
   * @example
   * GET /vendors/activity-logs
   * Headers: { "Authorization": "Bearer <token>" }
   * 
   * Response: [
   *   {
   *     "activityType": "Account Created",
   *     "description": "Vendor account successfully created",
   *     "metadata": { "email": "vendor@example.com" },
   *     "timestamp": "2024-12-01T10:00:00Z"
   *   },
   *   {
   *     "activityType": "Application Created",
   *     "description": "New application submitted for Grade A",
   *     "metadata": { "applicationId": "APP-2024-001", "grade": "A" },
   *     "timestamp": "2024-12-02T14:30:00Z"
   *   }
   * ]
   */
  @Get('activity-logs')
  @ApiOperation({ summary: 'Get vendor activity logs' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Activity logs retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          activityType: {
            type: 'string',
            enum: [
              'Account Created',
              'Profile Updated',
              'Company Registered',
              'Company Updated',
              'Application Created',
              'Application Submitted',
              'Payment Initiated',
              'Payment Completed',
              'Payment Failed',
              'Document Uploaded',
              'Document Updated',
              'Profile Renewal Initiated',
              'Profile Renewal Completed',
              'Password Changed',
              'Login',
              'Logout'
            ],
            example: 'Account Created'
          },
          description: {
            type: 'string',
            example: 'Vendor account successfully created'
          },
          metadata: {
            type: 'object',
            example: { email: 'vendor@example.com' }
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-12-01T10:00:00.000Z'
          }
        }
      },
      example: [
        {
          activityType: 'Account Created',
          description: 'Vendor account successfully created',
          metadata: { email: 'vendor@example.com' },
          timestamp: '2024-12-01T10:00:00.000Z'
        },
        {
          activityType: 'Application Created',
          description: 'New application submitted for Grade A',
          metadata: { applicationId: 'APP-2024-001', grade: 'A' },
          timestamp: '2024-12-02T14:30:00.000Z'
        }
      ]
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vendor not found'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing token'
  })
  getVendorActivityLogs(@Req() req: any) {
    if (!req?.headers?.authorization) {
      throw new UnauthorizedException('Authorization header is required');
    }

    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];

      if (!token) {
        throw new UnauthorizedException('Invalid authorization token format');
      }

      const decoded = this.jwtService.decode(token);

      if (!decoded?._id) {
        throw new UnauthorizedException('Invalid token payload');
      }

      return this.vendorsService.getVendorActivityLogs(decoded._id);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Update a vendor profile
   * 
   * @param id - Vendor ID (MongoDB ObjectId)
   * @param updateVendorDto - Updated vendor data (fullname, email, phone, password)
   * @returns Updated vendor profile
   * 
   * @example
   * PATCH /vendors/profile/507f1f77bcf86cd799439011
   * Body: {
   *   "fullname": "John Updated Doe",
   *   "phoneNo": "08098765432"
   * }
   */
  @Patch('profile')
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto, @Req() req: any) {
    try{
      const header = req.headers.authorization;
      if(!header){
        this.logger.log(`Unauthorized user trying to access the endpoint`);
        throw new UnauthorizedException('Unauthorized');
      }
      const id = this.jwtService.decode(header.split(' ')[1])._id;
      if(!id){
        this.logger.log(`Unauthorized user trying to access the endpoint`);
        throw new UnauthorizedException('Unauthorized');
      }
      return this.vendorsService.update(id, updateVendorDto);
    }catch(err){
      this.logger.log(`Unauthorized user trying to access the endpoint`);
      throw new UnauthorizedException('Unauthorized');
    }
  }

  /**
   * Get registration payment for a vendor
   * 
   * @param req - Request object containing JWT token
   * @returns Registration payment details
   * 
   * @example
   * GET /vendors/registration-payment
   */
  @Get('registration-payment')
  @ApiOperation({ summary: 'Get vendor registration payment' })
  @ApiResponse({ status: 200, description: 'Registration payment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No registration payment found' })
  async getRegistrationPayment(@Req() req: any) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = req.headers.authorization.split(' ')[1];
    const decoded = this.jwtService.decode(token);

    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return this.vendorsService.getRegistrationPayment(decoded._id);
  }

  /**
   * Get payment history for the authenticated vendor
   * 
   * @param req - Request object containing JWT token
   * @param page - Page number for pagination (optional, default: 1)
   * @param limit - Number of records per page (optional, default: 10)
   * @param search - Search by transaction reference or description (optional)
   * @param year - Filter by year (optional)
   * @param type - Filter by payment type (optional)
   * @returns Paginated payment history for the vendor
   * 
   * @example
   * GET /vendors/my-payment-history?page=1&limit=10&search=REF123&year=2024&type=registration
   */
  @Get('my-payment-history')
  @ApiOperation({ summary: 'Get vendor payment history' })
  @ApiResponse({ status: 200, description: 'Payment history retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No payments found for this vendor' })
  async getPaymentHistory(
    @Req() req: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('year') year?: number,
    @Query('type') type?: string,
  ) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = req.headers.authorization.split(' ')[1];
    const decoded = this.jwtService.decode(token);

    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return this.vendorsService.getPaymentHistory(decoded._id, page, limit, search, year, type);
  }

  /**
   * Verify vendor email with OTP
   * 
   * @param body - Email and OTP code for verification
   * @returns Success status and verification message
   * 
   * @example
   * POST /vendors/verify-email
   * Body: {
   *   "email": "vendor@example.com",
   *   "otp": "123456"
   * }
   */
  @Post('verify-email')
  @ApiOperation({ summary: 'Verify vendor email' })
  @ApiBody({
    type: Object,
    examples: {
      valid: {
        summary: 'Valid email verification',
        value: {
          email: 'vendor@example.com',
          otp: '123456'
        }
      }
    }
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Email verified successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid or expired OTP' })
  async verifyEmail(@Body() body: { email: string; otp: string }) {
    const { email, otp } = body;
    try {
      return await this.vendorsService.verifyEmail(email, otp);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Resend email verification OTP
   * 
   * @param body - Email address to resend OTP to
   * @returns Success status and message confirming OTP was resent
   * 
   * @example
   * POST /vendors/resend-verification-otp
   * Body: {
   *   "email": "vendor@example.com"
   * }
   */
  @Post('resend-verification-otp')
  @ApiOperation({ summary: 'Resend email verification OTP' })
  @ApiBody({
    type: Object,
    examples: {
      valid: {
        summary: 'Resend OTP request',
        value: {
          email: 'vendor@example.com'
        }
      }
    }
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'OTP resent successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Vendor not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Email already verified or failed to send OTP' })
  async resendVerificationOtp(@Body() body: { email: string }) {
    const { email } = body;
    try {
      return await this.vendorsService.resendVerificationOtp(email);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('replace-document/:id')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Replace a company document',
    description: 'Replaces an existing company verification document with a new one for the authenticated vendor. The :id path parameter is the ObjectId of the existing document reference stored on the company.' 
  })
  @ApiBody({
    type: replaceDocumentDto,
    description: 'Payload containing the new document metadata to be uploaded',
    schema: {
      type: 'object',
      properties: {
        document: {
          type: 'object',
          properties: {
            documentType: { type: 'string', example: 'CAC' },
            fileUrl: { type: 'string', example: 'https://cdn.example.com/docs/cac-new.pdf' },
            validFrom: { type: 'string', example: '2025-01-01' },
            validTo: { type: 'string', example: '2030-01-01' },
            uploadedDate: { type: 'string', example: '2025-01-05' },
            fileName: { type: 'string', example: 'cac-certificate-new.pdf' },
            fileSize: { type: 'string', example: '245KB' },
            fileType: { type: 'string', example: 'application/pdf' },
            validFor: { type: 'string', example: '5 years' },
            hasValidityPeriod: { type: 'boolean', example: true }
          },
          required: ['documentType', 'fileUrl', 'uploadedDate', 'fileName', 'fileSize', 'fileType', 'hasValidityPeriod']
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Document replaced successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'document uploaded successfully' },
        document: { type: 'object', description: 'The newly created verification document record' }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Vendor or company not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Failed to replace document (validation error or invalid token)' 
  })
  async replaceDocument(
    @Req() req:any,
    @Param('id') id: string,
    @Body() replaceDocumentDto: replaceDocumentDto
  ) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = req.headers.authorization.split(' ')[1];
    const decoded = this.jwtService.decode(token);

    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const vendorId = decoded._id;

    try {
      return await this.vendorsService.replaceDocument(id, replaceDocumentDto, vendorId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('deactivate-my-account')
  @ApiOperation({ summary: 'Deactivate vendor account' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Vendor account deactivated successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Vendor not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Failed to deactivate vendor account' })
  async deactivateMyAccount(
    @Req() req: any
  ) {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }
    const token = req.headers.authorization.split(' ')[1];
    const decoded = this.jwtService.decode(token);

    if (!decoded || !decoded._id) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return this.vendorsService.deactivateMyAccount(decoded._id);
  }

  /**
   * Delete a vendor account
   * 
   * @param id - Vendor ID (MongoDB ObjectId)
   * @returns Deleted vendor record
   * 
   * @example
   * DELETE /vendors/507f1f77bcf86cd799439011
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(id);
  }
}
