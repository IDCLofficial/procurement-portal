import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, BadRequestException, Req, Headers, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiBearerAuth, ApiHeader, ApiConsumes } from '@nestjs/swagger';
import { updateRegistrationDto } from './dto/update-registration.dto';
import { loginDto } from './dto/logn.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('vendors')
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

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
   * Get all vendor accounts
   * 
   * @returns Array of all registered vendors
   * 
   * @example
   * GET /vendors
   */
  @Get()
  findAll() {
    return this.vendorsService.findAll();
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
  findOne(@Headers('authorization') authHeader: string) {
    return this.vendorsService.getProfile(authHeader);
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
              validFrom: { type: 'string', example: '2023-01-01' },
              validTo: { type: 'string', example: '2028-01-01' }
            }
          },
          description: 'Document metadata (files uploaded separately via files field)'
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
    return this.vendorsService.registerCompany(req, updateRegistrationDto, files);
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
  @Patch('profile/:id')
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorsService.update(id, updateVendorDto);
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
}
