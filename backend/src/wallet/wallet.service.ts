import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Payment } from 'src/payments/entities/payment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Payment.name) private PaymentModel: Model<Payment>,
  ) {}
  
  create(createWalletDto: CreateWalletDto) {
    const wallet = new this.PaymentModel(createWalletDto);
    return wallet.save();
  }

  async getSummary() {
    const procurementPercentage = 0.5
    const idclPercentage = 0.25
    const iirsPercentage = 0.25
    const totalPercentage = 1

    const processingPayments = await this.PaymentModel.aggregate([
      {
        $match: { type: 'processing fee' }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const totalProcessingFees = processingPayments.length > 0 ? processingPayments[0].totalAmount : 0;
    
    return {
      totalProcessingFees,
      procurementPercentage: totalProcessingFees * procurementPercentage,
      idclPercentage: totalProcessingFees * idclPercentage,
      iirsPercentage: totalProcessingFees * iirsPercentage,
      totalPercentage: totalProcessingFees * totalPercentage
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  update(id: number, updateWalletDto: UpdateWalletDto) {
    return `This action updates a #${id} wallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
