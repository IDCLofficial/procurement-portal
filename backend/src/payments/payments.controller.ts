import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initiate')
  async initiate(@Body() body: { email: string; amount: number }) {
    return this.paymentsService.initializePayment(body.email, body.amount);
  }

  @Get('verify')
  async verify(@Query('reference') reference: string) {
    return this.paymentsService.verifyPayment(reference);
  }
  
}
