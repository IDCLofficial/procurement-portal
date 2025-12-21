import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './entities/company.schema';
import { verificationDocuments } from 'src/documents/entities/document.schema';

@Module({
  imports:[MongooseModule.forFeature([
    { name: 'Company', schema: CompanySchema },
    { name: 'verificationDocuments', schema: verificationDocuments }
  ])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
