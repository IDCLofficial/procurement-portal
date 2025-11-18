import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { verificationDocPreset, VerificationDocumentPresetSchema, verificationDocuments, VerificationDocumentSchema } from './entities/document.schema';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: verificationDocPreset.name, schema: VerificationDocumentPresetSchema },
      { name: verificationDocuments.name, schema: VerificationDocumentSchema },
    ]),
    MulterModule.register({
      storage: multer.memoryStorage(), // buffer upload
    }),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
