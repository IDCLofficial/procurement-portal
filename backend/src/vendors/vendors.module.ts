import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { Vendor, VendorSchema } from './entities/vendor.schema';
import { EmailService } from '../email/email.service';
import TokenHandlers from 'src/lib/generateToken';
import { Company, CompanySchema, Directors, DirectorsSchema } from 'src/companies/entities/company.schema';
import { verificationDocuments, VerificationDocumentSchema } from 'src/documents/entities/document.schema';
import { Payment, PaymentSchema } from 'src/payments/entities/payment.schema';
import { Application, ApplicationSchema } from 'src/applications/entities/application.schema';
import { VendorActivityLog, VendorActivityLogSchema } from './entities/vendor-activity-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }]),
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    MongooseModule.forFeature([{ name: Directors.name, schema: DirectorsSchema }]),
    MongooseModule.forFeature([{ name: verificationDocuments.name, schema: VerificationDocumentSchema }]),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    MongooseModule.forFeature([{ name: Application.name, schema: ApplicationSchema }]),
    MongooseModule.forFeature([{ name: VendorActivityLog.name, schema: VendorActivityLogSchema }]),
    
  ],
  controllers: [VendorsController],
  providers: [VendorsService, EmailService, TokenHandlers],
  exports: [VendorsService],
})
export class VendorsModule {}
