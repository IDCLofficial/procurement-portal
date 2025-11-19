import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Status } from './entities/company.schema';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

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
   * Update company status
   * 
   * @param id - Company ID (MongoDB ObjectId)
   * @param updateStatusDto - New status data
   * @returns Updated company record
   * 
   * @example
   * PATCH /companies/status/507f1f77bcf86cd799439011
   * Body: {
   *   "status": "Approved"
   * }
   */
  @Patch('status/:id')
  @ApiOperation({ 
    summary: 'Update company status',
    description: 'Updates the status of a company. Status can be Pending, Needs Review, Approved, or Rejected.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Company ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({ 
    type: UpdateStatusDto,
    examples: {
      pending: {
        summary: 'Set status to Pending',
        value: {
          status: Status.PENDING
        }
      },
      needsReview: {
        summary: 'Set status to Needs Review',
        value: {
          status: Status.NEED_REVIEW
        }
      },
      approved: {
        summary: 'Set status to Approved',
        value: {
          status: Status.APPROVED
        }
      },
      rejected: {
        summary: 'Set status to Rejected',
        value: {
          status: Status.REJECTED
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Company status updated successfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status value or request data'
  })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.companiesService.updateStatus(id, updateStatusDto);
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
