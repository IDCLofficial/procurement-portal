import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/upload-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto';
import { createDocumentPresetDto } from './dto/create-document-preset.dto';
import { UpdateDocumentPresetDto } from './dto/update-document-preset.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { verificationDocPreset, PresetDocument, verificationDocuments, verificationDocument, Status } from './entities/document.schema';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);
  private s3: S3Client;
  
  constructor(
    @InjectModel(verificationDocPreset.name) private documentPresetModel: Model<PresetDocument>,
    @InjectModel(verificationDocuments.name) private verificationDocumentModel: Model<verificationDocument>) {
    
    const accessKeyId = process.env.SIRV_S3_ACCESS_KEY;
    const secretAccessKey = process.env.SIRV_S3_SECRET_KEY;
    const endpoint = process.env.SIRV_S3_ENDPOINT;

    if (!accessKeyId || !secretAccessKey || !endpoint) {
      throw new Error('Missing required S3 configuration. Please check your environment variables.');
    }
    
    this.s3 = new S3Client({
      region: 'auto', // Sirv ignores regions
      endpoint,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true, // Important for Sirv
    });
  }

  async uploadFile(file: Express.Multer.File, createDocumentDto: CreateDocumentDto){
    try{
      const key = `uploads/${createDocumentDto.documentName ? createDocumentDto.documentName : Date.now()}_${file.originalname}`;

      await this.s3.send(
        new PutObjectCommand({
        Bucket: process.env.SIRV_S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    const newDoc = await this.verificationDocumentModel.insertMany({
        vendor: new Types.ObjectId(createDocumentDto.vendor),
        documentName: createDocumentDto.documentName,
        key:key,
        documentUrl: `https://${process.env.SIRV_S3_BUCKET}.s3.sirv.com/${key}`,
        validFrom: createDocumentDto.validFrom,
        validTo: createDocumentDto.validTo,
      })
      if(!newDoc){
        throw new BadRequestException('Document not created')
      }
      return newDoc;
    }catch(err){
      throw new BadRequestException(err.message)
    }
  }

  async getPresignedUrl(key: string) {
    return await getSignedUrl(
      this.s3,
      new PutObjectCommand({
        Bucket: process.env.SIRV_S3_BUCKET,
        Key: key,
      }),
      { expiresIn: 3600 },
    );
  }

  async setPreset(createDocumentPresetDto: createDocumentPresetDto):Promise<verificationDocPreset> {
    try{
      const isPreset = await this.documentPresetModel.findOne({documentName: createDocumentPresetDto.documentName})
      if(isPreset){
        throw new BadRequestException('Preset already exists')
      }
      const newPreset = new this.documentPresetModel(createDocumentPresetDto)
      return await newPreset.save();
    }catch(err){
      throw new BadRequestException(err.message)
    }
  }

  async getPresets(): Promise<verificationDocPreset[]> {
    try {
      const presets = await this.documentPresetModel.find().exec();
      return presets;
    } catch (err) {
      throw new BadRequestException('Failed to retrieve document presets', err.message);
    }
  }

  findAll() {
    return `This action returns all documents`;
  }

  async findDocsByVendor(id: string) {
    const docs = await this.verificationDocumentModel.find({vendor: new Types.ObjectId(id)})
    if(!docs){
      throw new BadRequestException('Documents not found')
    }
    return {
      vendor:new Types.ObjectId(id),
      documents:docs
    };
  }

  async updateDocumentStatus(id: string, updateDocumentStatusDto: UpdateDocumentStatusDto): Promise<verificationDocuments> {
    try {

      // Validate that NEED_REVIEW or REJECTED status must have a message

      if (
        (updateDocumentStatusDto.status.status === Status.NEED_REVIEW || 
         updateDocumentStatusDto.status.status === Status.REJECTED) &&
        !updateDocumentStatusDto.status.message
      ) {
        throw new BadRequestException(
          `A message is required when status is "${updateDocumentStatusDto.status.status}"`
        );
      }
      
      const document = await this.verificationDocumentModel.findByIdAndUpdate(id, {
        status: updateDocumentStatusDto.status
      });
      
      if (!document) {
        throw new NotFoundException('Document not found');
      }
     
      return document
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      throw new BadRequestException('Failed to update document status', err.message);
    }
  }

  async updatePreset(id: string, updateDocumentPresetDto: UpdateDocumentPresetDto): Promise<verificationDocPreset> {
    try {
      const preset = await this.documentPresetModel.findById(id);
      
      if (!preset) {
        throw new NotFoundException('Document preset not found');
      }

      // Update only the provided fields
      if (updateDocumentPresetDto.documentName !== undefined) {
        preset.documentName = updateDocumentPresetDto.documentName;
      }
      if (updateDocumentPresetDto.isRequired !== undefined) {
        preset.isRequired = updateDocumentPresetDto.isRequired;
      }
      if (updateDocumentPresetDto.hasExpiry !== undefined) {
        preset.hasExpiry = updateDocumentPresetDto.hasExpiry;
      }
      if (updateDocumentPresetDto.renewalFrequency !== undefined) {
        preset.renewalFrequency = updateDocumentPresetDto.renewalFrequency;
      }

      return await preset.save();
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error(`Failed to update document preset: ${err.message}`);
      throw new BadRequestException('Failed to update document preset');
    }
  }

  async deletePreset(id: string): Promise<verificationDocPreset> {
    try {
      const preset = await this.documentPresetModel.findByIdAndDelete(id);
      
      if (!preset) {
        throw new NotFoundException('Document preset not found');
      }
      
      return preset;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw err;
      }
      this.logger.error(`Failed to delete document preset: ${err.message}`);
      throw new BadRequestException('Failed to delete document preset');
    }
  }
}
