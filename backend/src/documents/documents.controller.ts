import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/upload-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { createDocumentPresetDto } from './dto/create-document-preset.dto';
import { ApiBody, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Verification Documents')
@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
  ) {}


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

  @ApiOperation({summary:"set the Documents that will be uploaded by the vendor companies"})
  @ApiProperty({type: createDocumentPresetDto})
  @ApiResponse({status:200, description:"Document preset set successfully"})
  @Post('set-preset')
  setPreset(@Body() createDocumentPresetDto: createDocumentPresetDto){
    return this.documentsService.setPreset(createDocumentPresetDto);
  }

  @ApiOperation({summary:"Get all documents"})
  @ApiResponse({status:200, description:"All documents"})
  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @ApiOperation({summary:"Get a document by id"})
  @ApiResponse({status:200, description:"Document found"})
  @Get(':id')
  findDocsByCompany(@Param('id') id: string) {
    return this.documentsService.findDocsByCompany(id);
  }

  @ApiOperation({summary:"Update a document by id"})
  @ApiProperty({type:UpdateDocumentDto})
  @ApiResponse({status:200, description:"Document updated successfully"})
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(+id, updateDocumentDto);
  }

  @ApiOperation({summary:"Delete a document by id"})
  @ApiResponse({status:200, description:"Document deleted successfully"})
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  }
}
