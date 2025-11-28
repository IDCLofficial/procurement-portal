import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { SplitPaymentService } from './payments.service';
import { SplitPaymentController } from './payments.controller';
import { PaystackSplitService } from '../paystack/paystack.service';
import { Payment, PaymentSchema } from './entities/payment.schema';
import { VendorsModule } from '../vendors/vendors.module';
import { Company, CompanySchema } from '../companies/entities/company.schema';
import { Application, ApplicationSchema } from '../applications/entities/application.schema';

@Module({
  imports: [
    HttpModule, 
    ConfigModule,
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Application.name, schema: ApplicationSchema }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    VendorsModule
  ],
  controllers: [SplitPaymentController],
  providers: [SplitPaymentService, PaystackSplitService],
  exports: [SplitPaymentService]
})
export class PaymentsModule {}
