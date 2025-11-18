import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './entities/company.schema';

@Module({
  imports:[MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
