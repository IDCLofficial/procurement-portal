import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Status } from './entities/company.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register a new company
   * 
   * @param createCompanyDto - Company registration data
   * @returns The newly created company record
   * 
   * @example
   * POST /companies
   * Body: {
   *   "companyName": "Tech Solutions Ltd",
   *   "cacNumber": "RC123456",
   *   "tin": "12345678-0001"
   * }
   */
  @Post()
  @ApiOperation({summary:"Register a company"})
  @ApiBody({type:CreateCompanyDto})
  @ApiResponse({status:201,description:"Company created successfully"})
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  /**
   * Get all registered companies with optional filtering and pagination
   * 
   * @param status - Optional filter by company status (Pending, Needs Review, Approved, Rejected)
   * @param page - Page number for pagination (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @returns Paginated list of companies with metadata
   * 
   * @example
   * GET /companies?status=Approved&page=1&limit=10
   */
  @Get()
  @ApiOperation({ 
    summary: 'Get all registered companies',
    description: 'Retrieves all registered companies with optional filtering by status and pagination. Returns paginated results with metadata.'
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: Status,
    description: 'Filter companies by status',
    example: Status.PENDING,
    examples: {
      pending: {
        summary: 'Get pending companies',
        value: Status.PENDING
      },
      needsReview: {
        summary: 'Get companies needing review',
        value: Status.NEED_REVIEW
      },
      approved: {
        summary: 'Get approved companies',
        value: Status.APPROVED
      },
      rejected: {
        summary: 'Get rejected companies',
        value: Status.REJECTED
      },
      all: {
        summary: 'Get all companies (no filter)',
        value: undefined
      }
    }
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (starts from 1)',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Companies retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: {
          type: 'number',
          example: 100,
          description: 'Total number of companies matching the filter'
        },
        page: {
          type: 'number',
          example: 1,
          description: 'Current page number'
        },
        limit: {
          type: 'number',
          example: 10,
          description: 'Number of items per page'
        },
        totalPages: {
          type: 'number',
          example: 10,
          description: 'Total number of pages'
        },
        companies: {
          type: 'array',
          description: 'Array of company objects',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              userId: { type: 'string', example: '507f1f77bcf86cd799439012' },
              companyName: { type: 'string', example: 'Tech Solutions Ltd' },
              cacNumber: { type: 'string', example: 'RC123456' },
              tin: { type: 'string', example: '12345678-0001' },
              address: { type: 'string', example: '123 Business Street' },
              lga: { type: 'string', example: 'Lagos Island' },
              status: { type: 'string', enum: ['Pending', 'Needs Review', 'Approved', 'Rejected'] },
              website: { type: 'string', example: 'https://techsolutions.com' },
              category: { type: 'string' },
              grade: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status value or failed to retrieve companies'
  })
  findAll(
    @Query('status') status?: Status,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;
    return this.companiesService.findAll(status, pageNum, limitNum);
  }

  /**
   * Get the company associated with the authenticated user
   * 
   * @description
   * This endpoint retrieves the company record for the currently authenticated user.
   * The user ID is extracted from the JWT token provided in the Authorization header.
   * The token must be in the format: "Bearer <token>"
   * 
   * @param req - Express request object containing the authorization header
   * @returns The company record associated with the user's ID
   * 
   * @throws {UnauthorizedException} If the token is missing, invalid, or expired
   * @throws {BadRequestException} If no company is found for the user
   * 
   * @example
   * GET /companies/my-company
   * Headers: {
   *   "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   */
  @Get('my-company')
  @ApiOperation({ 
    summary: 'Get company by authenticated user',
    description: 'Retrieves the company record associated with the currently authenticated user. Requires a valid JWT token in the Authorization header.'
  })
  @ApiBearerAuth()
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Company retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        userId: { type: 'string', example: '507f1f77bcf86cd799439012' },
        companyName: { type: 'string', example: 'Tech Solutions Ltd' },
        cacNumber: { type: 'string', example: 'RC123456' },
        tin: { type: 'string', example: '12345678-0001' },
        address: { type: 'string', example: '123 Business Street' },
        lga: { type: 'string', example: 'Lagos Island' },
        status: { type: 'string', enum: ['Pending', 'Needs Review', 'Approved', 'Rejected'], example: 'Approved' },
        website: { type: 'string', example: 'https://techsolutions.com' },
        category: { type: 'string', example: 'Technology' },
        grade: { type: 'string', example: 'A' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized - Invalid or missing token'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Company not found for this user'
  })
  getMyCompany(@Req() req: any) {
    // Extract token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      // Decode the JWT token
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      // Extract the _id from the decoded token
      const userId = decoded._id;
      if (!userId) {
        throw new UnauthorizedException('User ID not found in token');
      }

      return this.companiesService.findOne(userId);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Get a single company by ID
   * 
   * @param id - Company ID (MongoDB ObjectId)
   * @returns Company details
   * 
   * @example
   * GET /companies/507f1f77bcf86cd799439011
   */
  @Get(':id')
  @ApiOperation({summary:"Get a company by id"})
  @ApiQuery({name:"id",required:true,description:"Id of the vendor"})
  @ApiResponse({status:200,description:"Company fetched successfully"})
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  /**
   * Update company information
   * 
   * @param id - Company ID (MongoDB ObjectId)
   * @param updateCompanyDto - Updated company data
   * @returns Updated company record
   * 
   * @example
   * PATCH /companies/507f1f77bcf86cd799439011
   * Body: {
   *   "companyName": "Updated Tech Solutions Ltd",
   *   "website": "https://newtechsolutions.com"
   * }
   */
  @Patch(':id')
  @ApiOperation({summary:"Update a company by id"})
  @ApiQuery({name:"id",required:true,description:"Id of the vendor"})
  @ApiBody({type:UpdateCompanyDto})
  @ApiResponse({status:200,description:"Company updated successfully"})
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(+id, updateCompanyDto);
  }

  /**
   * Delete a company by ID
   * 
   * @param id - Company ID (MongoDB ObjectId)
   * @returns Deleted company record
   * 
   * @example
   * DELETE /companies/507f1f77bcf86cd799439011
   */
  @Delete(':id')
  @ApiOperation({summary:"Delete a company by id"})
  @ApiQuery({name:"id",required:true,description:"Id of the vendor"})
  @ApiResponse({status:200,description:"Company deleted successfully"})
  remove(@Param('id') id: string) {
    return this.companiesService.remove(+id);
  }
}
