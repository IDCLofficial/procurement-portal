import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpStatus } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/upload-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto';
import { createDocumentPresetDto } from './dto/create-document-preset.dto';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Status } from './entities/document.schema';

@ApiTags('Verification Documents')
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
  ) {}


  /**
   * Upload a document for vendor verification
   * 
   * @param {CreateDocumentDto} createDocumentDto - Document metadata including vendor ID and document details
   * @param {Express.Multer.File} file - The uploaded file from multipart/form-data request
   * @returns {Promise<Object>} The uploaded document record with file URL
   * @throws {BadRequestException} If file is missing or invalid
   * @throws {ConflictException} If upload to storage fails
   */
  @ApiOperation({summary:"Upload a document"})
  @ApiProperty({type:CreateDocumentDto})
  @ApiBody({type:CreateDocumentDto})
  @ApiResponse({status:200, description:"Document uploaded successfully"})
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.documentsService.uploadFile(file, createDocumentDto);
  }

  /**
   * Set document presets that vendors must upload during registration
   * 
   * Defines the required documents, their expiry settings, and renewal frequency.
   * Used by administrators to configure which documents vendors need to provide.
   * 
   * @param {createDocumentPresetDto} createDocumentPresetDto - Document preset configuration
   * @returns {Promise<Object>} The created document preset record
   * @throws {ConflictException} If preset creation fails
   */
  @ApiOperation({summary:"set the Documents that will be uploaded by the vendor companies"})
  @ApiProperty({type: createDocumentPresetDto})
  @ApiResponse({status:200, description:"Document preset set successfully"})
  @Post('set-preset')
  setPreset(@Body() createDocumentPresetDto: createDocumentPresetDto){
    return this.documentsService.setPreset(createDocumentPresetDto);
  }

  /**
   * Retrieve all verification documents in the system
   * 
   * Returns all uploaded vendor documents across all vendors.
   * Useful for admin dashboards and document management.
   * 
   * @returns {Promise<Array>} Array of all verification documents
   */
  @ApiOperation({summary:"Get all documents"})
  @ApiResponse({status:200, description:"All documents"})
  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  /**
   * Retrieve all documents for a specific vendor
   * 
   * Fetches all verification documents associated with a vendor by their ID.
   * Returns documents with their status, URLs, and validity information.
   * 
   * @param {string} id - The vendor ID (MongoDB ObjectId)
   * @returns {Promise<Array>} Array of documents belonging to the vendor
   * @throws {NotFoundException} If vendor not found or has no documents
   */
  @ApiOperation({summary:"Get documents for a company by its id"})
  @ApiResponse({status:200, description:"Documents found"})
  @Get(':id')
  findDocsByVendor(@Param('id') id: string) {
    return this.documentsService.findDocsByVendor(id);
  }

  /**
   * Update the verification status of a document
   * 
   * Allows administrators to change the status of a vendor's document during the
   * verification process. Status transitions:
   * - Pending: Initial state after upload
   * - Needs Review: Flagged for additional review
   * - Approved: Document verified and accepted
   * - Rejected: Document rejected, vendor must re-upload
   * 
   * @param {string} id - The document ID (MongoDB ObjectId)
   * @param {UpdateDocumentStatusDto} updateDocumentStatusDto - New status value
   * @returns {Promise<Object>} Updated document with new status
   * @throws {NotFoundException} If document with given ID not found
   * @throws {BadRequestException} If status value is invalid
   */
  @Patch('status/:id')
  @ApiOperation({ 
    summary: 'Update document status',
    description: 'Updates the verification status of a document. Status can be Pending, Needs Review, Approved, or Rejected.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Document ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiBody({ 
    type: UpdateDocumentStatusDto,
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
    description: 'Document status updated successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
        vendor: { type: 'string', example: '507f1f77bcf86cd799439012' },
        documentName: { type: 'string', example: 'CAC Certificate' },
        documentUrl: { type: 'string', example: 'https://bucket.s3.sirv.com/uploads/document.pdf' },
        validFrom: { type: 'string', example: '2023-01-01' },
        validTo: { type: 'string', example: '2028-01-01' },
        status: { type: 'string', enum: ['Pending', 'Needs Review', 'Approved', 'Rejected'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Document not found'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status value or request data'
  })
  updateDocumentStatus(@Param('id') id: string, @Body() updateDocumentStatusDto: UpdateDocumentStatusDto) {
    return this.documentsService.updateDocumentStatus(id, updateDocumentStatusDto);
  }
}
