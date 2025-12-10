import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application, ApplicationSchema } from './entities/application.schema';
import { Certificate, CertificateSchema } from '../certificates/entities/certificate.schema';
import { Company, CompanySchema } from '../companies/entities/company.schema';
import { User, UserSchema } from '../users/entities/user.schema';
import { VendorsModule } from '../vendors/vendors.module';
import { Vendor, VendorSchema } from 'src/vendors/entities/vendor.schema';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
      { name: Certificate.name, schema: CertificateSchema },
      { name: Company.name, schema: CompanySchema },
      { name: User.name, schema: UserSchema },
      {name:Vendor.name, schema:VendorSchema}
    ]),
    VendorsModule,
    AuditLogsModule
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
