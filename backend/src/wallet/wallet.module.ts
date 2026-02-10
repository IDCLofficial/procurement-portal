import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Payment, PaymentSchema } from 'src/payments/entities/payment.schema';
import { Company, CompanySchema } from 'src/companies/entities/company.schema';
import { Cashout, CashoutSchema } from './entities/cashout.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Cashout.name, schema: CashoutSchema }
    ])
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService]
})
export class WalletModule {}
