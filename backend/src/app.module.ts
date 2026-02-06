import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VendorsModule } from './vendors/vendors.module';
import { EmailModule } from './email/email.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CompaniesModule } from './companies/companies.module';
import { CacModule } from './cac/cac.module';
import { DocumentsModule } from './documents/documents.module';
import { CategoriesModule } from './categories/categories.module';
import { ApplicationsModule } from './applications/applications.module';
import { UsersModule } from './users/users.module';
import { JwtStrategy } from './config/jwt.strategy';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PaymentsModule } from './payments/payments.module';
import { CertificatesModule } from './certificates/certificates.module';
import { SlaModule } from './sla/sla.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MdaModule } from './mda/mda.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,      // Time window in milliseconds (60 seconds)
        limit: 15,       // Max number of requests per IP within ttl
      },
    ]),
    ScheduleModule.forRoot(),
    PassportModule,
    VendorsModule,
    EmailModule,
    CompaniesModule,
    CacModule,
    DocumentsModule,
    CategoriesModule,
    ApplicationsModule,
    UsersModule,
    PaymentsModule,
    CertificatesModule,
    SlaModule,
    NotificationsModule,
    MdaModule,
    WalletModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
