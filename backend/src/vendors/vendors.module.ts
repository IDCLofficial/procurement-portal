import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { Vendor, VendorSchema } from './entities/vendor.schema';
import { EmailService } from '../email/email.service';
import { PassportModule } from '@nestjs/passport';
import TokenHandlers from 'src/lib/generateToken';

console.log('JWT_SECRET:', process.env.JWT_SECRET);

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }]),
  ],
  controllers: [VendorsController],
  providers: [VendorsService, EmailService, TokenHandlers],
  exports: [VendorsService],
})
export class VendorsModule {}
