import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { CreateCashoutDto } from './dto/create-cashout.dto';
import { Payment } from 'src/payments/entities/payment.schema';
import { Company } from 'src/companies/entities/company.schema';
import { Cashout, CashoutStatus } from './entities/cashout.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Payment.name) private PaymentModel: Model<Payment>,
    @InjectModel(Company.name) private CompanyModel: Model<Company>,
    @InjectModel(Cashout.name) private CashoutModel: Model<Cashout>,
  ) {}
  
  create(createWalletDto: CreateWalletDto) {
    const wallet = new this.PaymentModel(createWalletDto);
    return wallet.save();
  }

  async getSummary() {
    const iirsPercentage = 0.25;
    const mdaPercentage = 0.25;
    const bpppiPercentage = 0.25; // Procurement percentage

    // Get total amount from all processing fees
    const totalAmountResult = await this.PaymentModel.aggregate([
      {
        $match: { type: 'processing fee' }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalPayments: { $sum: 1 }
        }
      }
    ]);

    const totalAmountGenerated = totalAmountResult.length > 0 ? totalAmountResult[0].totalAmount : 0;
    const totalNumberOfPayments = totalAmountResult.length > 0 ? totalAmountResult[0].totalPayments : 0;

    // Calculate IIRS transactions (25% of total)
    const iirsTransactions = Math.round(totalNumberOfPayments * iirsPercentage);

    // Calculate MDA transactions (25% of total)
    const mdaTransactions = Math.round(totalNumberOfPayments * mdaPercentage);

    // Calculate BPPPI transactions (25% of total)
    const bpppiTransactions = Math.round(totalNumberOfPayments * bpppiPercentage);

    // Get last cashout amount
    const lastCashoutRecord = await this.CashoutModel.findOne({
      status: CashoutStatus.COMPLETED
    })
    .sort({ cashoutDate: -1 })
    .exec();

    const lastCashout = lastCashoutRecord ? lastCashoutRecord.amount : 0;

    return {
      totalAmountGenerated,
      iirsTransactions,
      mdaTransactions,
      bpppiTransactions,
      totalNumberOfPayments,
      lastCashout,
      lastCashoutDate: lastCashoutRecord?.cashoutDate || null,
      breakdown: {
        iirsAmount: totalAmountGenerated * iirsPercentage,
        mdaAmount: totalAmountGenerated * mdaPercentage,
        bpppiAmount: totalAmountGenerated * bpppiPercentage,
        idclAmount: totalAmountGenerated * 0.25
      }
    };
  }

  async getMdaTransactions() {
    const mdaPercentage = 0.25;

    // Aggregate processing fees by MDA
    const mdaTransactions = await this.PaymentModel.aggregate([
      {
        $match: { type: 'processing fee' }
      },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company'
        }
      },
      {
        $unwind: '$company'
      },
      {
        $group: {
          _id: '$company.mda',
          totalProcessingFees: { $sum: '$amount' },
          transactionCount: { $sum: 1 },
          payments: {
            $push: {
              paymentId: '$paymentId',
              amount: '$amount',
              companyName: '$company.companyName',
              category: '$category',
              grade: '$grade',
              paymentDate: '$paymentDate',
              status: '$status'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          mda: '$_id',
          totalProcessingFees: 1,
          allocatedAmount: { $multiply: ['$totalProcessingFees', mdaPercentage] },
          transactionCount: 1,
          payments: 1
        }
      },
      {
        $sort: { allocatedAmount: -1 }
      }
    ]);

    // Calculate totals
    const totalAllocated = mdaTransactions.reduce((sum, mda) => sum + mda.allocatedAmount, 0);
    const totalTransactions = mdaTransactions.reduce((sum, mda) => sum + mda.transactionCount, 0);

    return {
      mdas: mdaTransactions,
      summary: {
        totalMdas: mdaTransactions.length,
        totalTransactions,
        totalAllocated,
        mdaPercentage: `${mdaPercentage * 100}%`
      }
    };
  }

  async createCashout(createCashoutDto: CreateCashoutDto, approvedBy: string) {
    try {
      // Generate unique cashout ID
      const count = await this.CashoutModel.countDocuments();
      const cashoutId = `CASH-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

      const newCashout = new this.CashoutModel({
        cashoutId,
        entity: createCashoutDto.entity,
        mdaName: createCashoutDto.mdaName,
        amount: createCashoutDto.amount,
        description: createCashoutDto.description,
        bankDetails: createCashoutDto.bankDetails,
        notes: createCashoutDto.notes,
        approvedBy,
        status: CashoutStatus.PENDING
      });

      return await newCashout.save();
    } catch (err) {
      throw new BadRequestException(`Failed to create cashout: ${err.message}`);
    }
  }

  async completeCashout(cashoutId: string, transactionReference: string) {
    try {
      const cashout = await this.CashoutModel.findOne({ cashoutId });
      
      if (!cashout) {
        throw new BadRequestException('Cashout not found');
      }

      if (cashout.status === CashoutStatus.COMPLETED) {
        throw new BadRequestException('Cashout already completed');
      }

      cashout.status = CashoutStatus.COMPLETED;
      cashout.transactionReference = transactionReference;
      cashout.cashoutDate = new Date();

      return await cashout.save();
    } catch (err) {
      throw new BadRequestException(`Failed to complete cashout: ${err.message}`);
    }
  }

  async getCashoutHistory(entity?: string, limit: number = 50) {
    try {
      const query = entity ? { entity } : {};
      
      const cashouts = await this.CashoutModel.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();

      const totalCashedOut = await this.CashoutModel.aggregate([
        {
          $match: { 
            status: CashoutStatus.COMPLETED,
            ...(entity && { entity })
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      return {
        cashouts,
        totalCashedOut: totalCashedOut.length > 0 ? totalCashedOut[0].total : 0,
        count: cashouts.length
      };
    } catch (err) {
      throw new BadRequestException(`Failed to fetch cashout history: ${err.message}`);
    }
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
