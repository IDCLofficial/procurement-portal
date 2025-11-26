import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
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
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
      },
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
