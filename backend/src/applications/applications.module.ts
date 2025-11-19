import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application, ApplicationSchema } from './entities/application.schema';
import { Certificate, CertificateSchema } from '../certificates/entities/certificate.schema';
import { Company, CompanySchema } from '../companies/entities/company.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
      { name: Certificate.name, schema: CertificateSchema },
      { name: Company.name, schema: CompanySchema }
    ])
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
