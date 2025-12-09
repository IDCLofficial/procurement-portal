import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificatesService } from './certificates.service';
import { CertificatesController } from './certificates.controller';
import { Certificate, CertificateSchema } from './entities/certificate.schema';
import { Company, CompanySchema } from '../companies/entities/company.schema';
import { Vendor, VendorSchema } from '../vendors/entities/vendor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Certificate.name, schema: CertificateSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Vendor.name, schema: VendorSchema }
    ])
  ],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
