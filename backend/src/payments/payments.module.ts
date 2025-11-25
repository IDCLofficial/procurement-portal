import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PaystackService } from '../paystack/paystack.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaystackService],
})
export class PaymentsModule {}
