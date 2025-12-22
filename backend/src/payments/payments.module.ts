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
import { Vendor, VendorSchema } from 'src/vendors/entities/vendor.schema';
import { User, UserSchema } from '../users/entities/user.schema';
import { AdminGuard } from '../guards/admin.guard';
import { Notification, NotificationSchema } from 'src/notifications/entities/notification.entity';
import { ApplicationsModule } from '../applications/applications.module';

@Module({
  imports: [
    HttpModule, 
    ConfigModule,
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Application.name, schema: ApplicationSchema },
      { name: Vendor.name, schema: VendorSchema },
      { name: User.name, schema: UserSchema },
      { name:Notification.name, schema:NotificationSchema }
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
    VendorsModule,
    ApplicationsModule
  ],
  controllers: [SplitPaymentController],
  providers: [SplitPaymentService, PaystackSplitService, AdminGuard],
  exports: [SplitPaymentService, ApplicationsModule]
})
export class PaymentsModule {}
