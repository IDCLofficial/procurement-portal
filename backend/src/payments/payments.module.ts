import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SplitPaymentService } from './payments.service';
import { SplitPaymentController } from './payments.controller';
import { PaystackSplitService } from '../paystack/paystack.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [SplitPaymentController],
  providers: [SplitPaymentService, PaystackSplitService],
})
export class PaymentsModule {}
