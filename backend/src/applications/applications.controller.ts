import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { ApplicationStatus } from './entities/application.schema';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all applications',
    description: 'Retrieves all applications with optional filtering by status and pagination. Returns paginated results with metadata.'
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ApplicationStatus,
    description: 'Filter applications by status',
    example: ApplicationStatus.PENDING,
    examples: {
      pending: {
        summary: 'Get pending applications',
        value: ApplicationStatus.PENDING
      },
      approved: {
        summary: 'Get approved applications',
        value: ApplicationStatus.APPROVED
      },
      rejected: {
        summary: 'Get rejected applications',
        value: ApplicationStatus.REJECTED
      },
      all: {
        summary: 'Get all applications (no filter)',
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
    description: 'Applications retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: {
          type: 'number',
          example: 50,
          description: 'Total number of applications matching the filter'
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
          example: 5,
          description: 'Total number of pages'
        },
        applications: {
          type: 'array',
          description: 'Array of application objects',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              applicationId: { type: 'string', example: 'APP-2025-001' },
              companyName: { type: 'string', example: 'Tech Solutions Ltd' },
              applicationStatus: { 
                type: 'string', 
                enum: ['PENDING', 'APPROVED', 'REJECTED'],
                example: 'PENDING'
              },
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
    description: 'Invalid status value or failed to retrieve applications'
  })
  findAll(
    @Query('status') status?: ApplicationStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;
    return this.applicationsService.findAll(status, pageNum, limitNum);
  }

  @Patch('status/:id')
  @ApiOperation({ 
    summary: 'Update application status',
    description: 'Updates the status of an application. Status can be PENDING, APPROVED, or REJECTED.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Application ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({ 
    type: UpdateApplicationStatusDto,
    examples: {
      pending: {
        summary: 'Set status to Pending',
        value: {
          applicationStatus: ApplicationStatus.PENDING
        }
      },
      approved: {
        summary: 'Set status to Approved',
        value: {
          applicationStatus: ApplicationStatus.APPROVED
        }
      },
      rejected: {
        summary: 'Set status to Rejected',
        value: {
          applicationStatus: ApplicationStatus.REJECTED
        }
      }
    }
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Application status updated successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        applicationId: { type: 'string', example: 'APP-2025-001' },
        companyName: { type: 'string', example: 'Tech Solutions Ltd' },
        applicationStatus: { 
          type: 'string', 
          enum: ['PENDING', 'APPROVED', 'REJECTED'],
          example: 'APPROVED'
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Application not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status value or request data'
  })
  updateApplicationStatus(@Param('id') id: string, @Body() updateApplicationStatusDto: UpdateApplicationStatusDto) {
    return this.applicationsService.updateApplicationStatus(id, updateApplicationStatusDto);
  }
}
