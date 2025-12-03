import { Controller, Get, Query, HttpStatus, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';

@ApiTags('Certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Search and filter certificates',
    description: 'Search certificates by contractor name, RC/BN number, registration ID, or certificate ID. Filter by category, grade, LGA, and status. Supports pagination.'
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by contractor name, RC/BN number, registration ID, or certificate ID',
    example: 'ABC Construction'
  })  
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by Category',
    example: 'Works'
  })
  @ApiQuery({
    name: 'grade',
    required: false,
    type: String,
    description: 'Filter by contractor grade',
    example: 'Grade A'
  })
  @ApiQuery({
    name: 'lga',
    required: false,
    type: String,
    description: 'Filter by Local Government Area',
    example: 'Owerri Municipal'
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by certificate status',
    example: 'Approved'
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
    description: 'Certificates retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: {
          type: 'number',
          example: 25,
          description: 'Total number of certificates matching the filters'
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
          example: 3,
          description: 'Total number of pages'
        },
        certificates: {
          type: 'array',
          description: 'Array of certificate objects',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
              certificateId: { type: 'string', example: 'IMO-CONT-2025-0001' },
              contractorName: { type: 'string', example: 'ABC Construction Ltd' },
              rcBnNumber: { type: 'string', example: 'RC1234567' },
              tin: { type: 'string', example: 'TIN-98765432' },
              address: { type: 'string', example: '123 Owerri Road, Owerri' },
              lga: { type: 'string', example: 'Owerri Municipal' },
              phone: { type: 'string', example: '+234 803 123 4567' },
              email: { type: 'string', example: 'info@abcconstruction.com' },
              website: { type: 'string', example: 'www.abcconstruction.com' },
              approvedSectors: { type: 'array', items: { type: 'string' }, example: ['WORKS'] },
              categories: { type: 'array', items: { type: 'string' }, example: ['Building Construction'] },
              grade: { type: 'string', example: 'Grade A' },
              status: { type: 'string', example: 'approved' },
              validUntil: { type: 'string', format: 'date-time', example: '2025-12-31T00:00:00.000Z' },
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
    description: 'Failed to retrieve certificates'
  })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('grade') grade?: string,
    @Query('lga') lga?: string,
    @Query('status') status?: string,
    @Query('category') category?: string
  ) {
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;
    return this.certificatesService.findAll(pageNum, limitNum, search, grade, lga, status, category);
  }

  @Get('category/:category')
  @ApiOperation({
    summary: 'Get certificates by company category',
    description: 'Retrieves all certificates for companies in a specific category/sector. Supports pagination.'
  })
  @ApiParam({
    name: 'category',
    required: true,
    type: String,
    description: 'Company category/sector to filter by',
    example: 'Construction'
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
    description: 'Number of results per page',
    example: 10
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Certificates retrieved successfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to retrieve certificates'
  })
  findByCategory(
    @Param('category') category: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 10;
    return this.certificatesService.findByCategory(category, pageNum, limitNum);
  }

  @Get(':certificateId')
  @ApiOperation({ 
    summary: 'Get certificate by certificate ID',
    description: 'Retrieves a specific certificate using its certificate ID (e.g., CERT-2025-0001)'
  })
  @ApiParam({
    name: 'certificateId',
    required: true,
    description: 'Certificate ID in format CERT-YYYY-XXXX',
    example: 'CERT-2025-0001'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Certificate retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        certificateId: { type: 'string', example: 'IMO-CONT-2025-0001' },
        contractorName: { type: 'string', example: 'ABC Construction Ltd' },
        registrationId: { type: 'string', example: 'IMO-CONT-2024-001' },
        rcBnNumber: { type: 'string', example: 'RC1234567' },
        tin: { type: 'string', example: 'TIN-98765432' },
        address: { type: 'string', example: '123 Owerri Road, Owerri' },
        lga: { type: 'string', example: 'Owerri Municipal' },
        phone: { type: 'string', example: '+234 803 123 4567' },
        email: { type: 'string', example: 'info@abcconstruction.com' },
        website: { type: 'string', example: 'www.abcconstruction.com' },
        approvedSectors: { type: 'array', items: { type: 'string' }, example: ['WORKS'] },
        categories: { type: 'array', items: { type: 'string' }, example: ['Building Construction'] },
        grade: { type: 'string', example: 'Grade A' },
        status: { type: 'string', example: 'approved' },
        validUntil: { type: 'string', format: 'date-time', example: '2025-12-31T00:00:00.000Z' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Certificate not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to retrieve certificate'
  })
  findByCertificateId(@Param('certificateId') certificateId: string) {
    return this.certificatesService.findByCertificateId(certificateId);
  }

  @Get(':certificateId')
  @ApiOperation({ 
    summary: 'Get detailed certificate information',
    description: 'Retrieves comprehensive certificate details including company information, contact details, sector classification, and registration status'
  })
  @ApiParam({
    name: 'certificateId',
    required: true,
    description: 'Certificate ID in format CERT-YYYY-XXXX',
    example: 'CERT-2025-0001'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Detailed certificate information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        certificate: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            certificateId: { type: 'string', example: 'CERT-2025-0001' },
            contractorName: { type: 'string', example: 'ABC Construction Ltd' },
            registrationId: { type: 'string', example: 'IMO-CONT-2024-001' },
            rcBnNumber: { type: 'string', example: 'RC1234567' },
            grade: { type: 'string', example: 'Grade A' },
            lga: { type: 'string', example: 'Owerri Municipal' },
            status: { type: 'string', example: 'Approved' },
            validUntil: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        companyInformation: {
          type: 'object',
          nullable: true,
          properties: {
            cacNumber: { type: 'string', example: 'RC1234567' },
            tin: { type: 'string', example: 'TIN-98765432' },
            address: { type: 'string', example: '123 Owerri Road, Owerri' },
            lga: { type: 'string', example: 'Owerri Municipal' },
            website: { type: 'string', example: 'www.abcconstruction.com' },
            category: { type: 'string', example: 'Building Construction' },
            grade: { type: 'string', example: 'Grade A' }
          }
        },
        contactInformation: {
          type: 'object',
          nullable: true,
          properties: {
            phone: { type: 'string', example: '+234 803 123 4567' },
            email: { type: 'string', example: 'info@abcconstruction.com' },
            address: { type: 'string', example: '123 Owerri Road, Owerri' },
            lga: { type: 'string', example: 'Owerri Municipal' },
            website: { type: 'string', example: 'www.abcconstruction.com' }
          }
        },
        sectorAndClassification: {
          type: 'object',
          nullable: true,
          properties: {
            approvedSectors: { type: 'string', example: 'WORKS' },
            category: { type: 'string', example: 'Building Construction' },
            grade: { type: 'string', example: 'Grade A' }
          }
        },
        registrationStatus: {
          type: 'object',
          properties: {
            currentStatus: { type: 'string', example: 'Approved' },
            registrationId: { type: 'string', example: 'IMO-CONT-2024-001' },
            validUntil: { type: 'string', format: 'date-time', example: '2025-12-31T00:00:00.000Z' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Certificate not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to retrieve detailed certificate'
  })
  getDetailedCertificate(@Param('certificateId') certificateId: string) {
    return this.certificatesService.getDetailedCertificate(certificateId);
  }
  
}
