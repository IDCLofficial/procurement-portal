import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, BadRequestException } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody} from '@nestjs/swagger';

@ApiTags('vendors')
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  //create a new vendor account
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

  @ApiOperation({ summary: 'Vendor login' })
  @ApiBody({
    description: 'Vendor login credentials',
    type: Object,
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
  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.vendorsService.login(body.email, body.password);
  }
  

  //get all vendor accounts
  @Get()
  findAll() {
    return this.vendorsService.findAll();
  }

  // get a single vendor account
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorsService.findOne(id);
  }

  // update a vendor account
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorsService.update(id, updateVendorDto);
  }

  // delete a vendor account
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorsService.remove(id);
  }

  // Verify vendor email
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
}
