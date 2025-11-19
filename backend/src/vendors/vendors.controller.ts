import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, BadRequestException } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody} from '@nestjs/swagger';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { updateRegistrationDto } from './dto/update-registration.dto';
import { loginDto } from './dto/logn.dto';

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
   * Get a single vendor profile by ID
   * 
   * @param id - Vendor ID (MongoDB ObjectId)
   * @returns Vendor profile details
   * 
   * @example
   * GET /vendors/profile/507f1f77bcf86cd799439011
   */
  @Get('profile/:id')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
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
  @Patch('/register-company/:id')
  @ApiOperation({ 
    summary: 'Register company details for a vendor',
    description: 'Updates vendor registration with company information, directors, bank details, documents, and service categories. All fields are optional to allow partial updates.'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Company registration updated successfully'
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
    type: updateRegistrationDto,
    examples: {
      complete: {
        summary: 'Complete company registration',
        value: {
          company: {
            companyName: 'Tech Solutions Ltd',
            cacNumber: 'RC123456',
            tin: '12345678-0001',
            businessAddres: '123 Business Street, Victoria Island',
            lga: 'Lagos Island',
            website: 'https://techsolutions.com'
          },
          directors: [
            {
              fullName: 'Jane Smith',
              idType: 'National ID',
              id: 'NIN12345678',
              phone: 2348012345678,
              email: 'jane.smith@techsolutions.com'
            }
          ],
          bankDetails: {
            bankName: 'First Bank of Nigeria',
            accountNumber: 1234567890,
            accountName: 'Tech Solutions Ltd'
          },
          documents: [
            {
              documentType: 'CAC Certificate',
              validFrom: '2023-01-01',
              validTo: '2028-01-01'
            }
          ],
          categoriesAndGrade: {
            categories: [
              {
                sector: 'Information Technology',
                service: 'Software Development'
              }
            ],
            grade: 'Grade A'
          }
        }
      },
      partial: {
        summary: 'Partial update - company info only',
        value: {
          company: {
            companyName: 'Tech Solutions Ltd',
            cacNumber: 'RC123456',
            tin: '12345678-0001',
            businessAddres: '123 Business Street',
            lga: 'Lagos Island'
          }
        }
      }
    }
  })
  registerCompany(@Param('id') id: string, @Body() updateRegistrationDto:updateRegistrationDto) {
    return this.vendorsService.registerCompany(id, updateRegistrationDto);
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
