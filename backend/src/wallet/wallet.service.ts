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
    const bpppiPercentage = 0.25;
    const idclPercentage = 0.25;

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

    // Calculate allocated amounts for each entity
    const iirsAllocated = totalAmountGenerated * iirsPercentage;
    const mdaAllocated = totalAmountGenerated * mdaPercentage;
    const bpppiAllocated = totalAmountGenerated * bpppiPercentage;
    const idclAllocated = totalAmountGenerated * idclPercentage;

    // Get remitted (cashed out) amounts for each entity
    const cashoutsByEntity = await this.CashoutModel.aggregate([
      {
        $match: { status: CashoutStatus.COMPLETED }
      },
      {
        $group: {
          _id: '$entity',
          totalRemitted: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const remittedMap = cashoutsByEntity.reduce((acc, item) => {
      acc[item._id] = {
        amount: item.totalRemitted,
        count: item.count
      };
      return acc;
    }, {});

    const iirsRemitted = remittedMap['IIRS']?.amount || 0;
    const mdaRemitted = remittedMap['MDA']?.amount || 0;
    const bpppiRemitted = remittedMap['BPPPI']?.amount || 0;
    const idclRemitted = remittedMap['IDCL']?.amount || 0;

    // Calculate unremitted amounts
    const iirsUnremitted = iirsAllocated - iirsRemitted;
    const mdaUnremitted = mdaAllocated - mdaRemitted;
    const bpppiUnremitted = bpppiAllocated - bpppiRemitted;
    const idclUnremitted = idclAllocated - idclRemitted;

    const totalRemitted = iirsRemitted + mdaRemitted + bpppiRemitted + idclRemitted;
    const totalUnremitted = totalAmountGenerated - totalRemitted;

    // Calculate transaction counts (25% of total for each)
    const iirsTransactions = Math.round(totalNumberOfPayments * iirsPercentage);
    const mdaTransactions = Math.round(totalNumberOfPayments * mdaPercentage);
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
      totalRemitted,
      totalUnremitted,
      iirsTransactions,
      mdaTransactions,
      bpppiTransactions,
      totalNumberOfPayments,
      lastCashout,
      lastCashoutDate: lastCashoutRecord?.cashoutDate || null,
      lastCashoutEntity: lastCashoutRecord?.entity || null,
      entities: {
        iirs: {
          allocated: iirsAllocated,
          remitted: iirsRemitted,
          unremitted: iirsUnremitted,
          percentage: `${iirsPercentage * 100}%`,
          cashoutCount: remittedMap['IIRS']?.count || 0
        },
        mda: {
          allocated: mdaAllocated,
          remitted: mdaRemitted,
          unremitted: mdaUnremitted,
          percentage: `${mdaPercentage * 100}%`,
          cashoutCount: remittedMap['MDA']?.count || 0
        },
        bpppi: {
          allocated: bpppiAllocated,
          remitted: bpppiRemitted,
          unremitted: bpppiUnremitted,
          percentage: `${bpppiPercentage * 100}%`,
          cashoutCount: remittedMap['BPPPI']?.count || 0
        },
        idcl: {
          allocated: idclAllocated,
          remitted: idclRemitted,
          unremitted: idclUnremitted,
          percentage: `${idclPercentage * 100}%`,
          cashoutCount: remittedMap['IDCL']?.count || 0
        }
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

  async getRecentProcessingFeeTransactions(limit: number = 20, status?: string) {
    try {
      const matchQuery: any = { type: 'processing fee' };
      
      if (status) {
        matchQuery.status = status;
      }

      const recentTransactions = await this.PaymentModel.aggregate([
        {
          $match: matchQuery
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
          $lookup: {
            from: 'vendors',
            localField: 'vendorId',
            foreignField: '_id',
            as: 'vendor'
          }
        },
        {
          $unwind: '$vendor'
        },
        {
          $project: {
            paymentId: 1,
            amount: 1,
            status: 1,
            paymentDate: 1,
            category: 1,
            grade: 1,
            description: 1,
            transactionReference: 1,
            companyName: '$company.companyName',
            companyMda: '$company.mda',
            vendorEmail: '$vendor.email',
            vendorPhone: '$vendor.phoneNumber',
            createdAt: 1,
            updatedAt: 1
          }
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $limit: limit
        }
      ]);

      // Get summary stats
      const stats = await this.PaymentModel.aggregate([
        {
          $match: { type: 'processing fee' }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        }
      ]);

      return {
        transactions: recentTransactions,
        count: recentTransactions.length,
        stats: stats.reduce((acc, stat) => {
          acc[stat._id] = {
            count: stat.count,
            totalAmount: stat.totalAmount
          };
          return acc;
        }, {})
      };
    } catch (err) {
      throw new BadRequestException(`Failed to fetch recent transactions: ${err.message}`);
    }
  }

  async getMyMdaTransactions(mdaName: string) {
    const mdaPercentage = 0.25;

    // Get all processing fees for companies under this MDA
    const mdaPayments = await this.PaymentModel.aggregate([
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
        $match: { 'company.mda': mdaName }
      },
      {
        $project: {
          paymentId: 1,
          amount: 1,
          status: 1,
          paymentDate: 1,
          category: 1,
          grade: 1,
          description: 1,
          companyName: '$company.companyName',
          companyId: '$company._id',
          createdAt: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    // Calculate totals
    const totalProcessingFees = mdaPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const allocatedAmount = totalProcessingFees * mdaPercentage;

    // Get cashout history for this MDA
    const cashouts = await this.CashoutModel.find({
      entity: 'MDA',
      mdaName: mdaName
    })
    .sort({ createdAt: -1 })
    .exec();

    const totalCashedOut = cashouts
      .filter(c => c.status === CashoutStatus.COMPLETED)
      .reduce((sum, c) => sum + c.amount, 0);

    return {
      mdaName,
      transactions: mdaPayments,
      summary: {
        totalTransactions: mdaPayments.length,
        totalProcessingFees,
        allocatedAmount,
        mdaPercentage: `${mdaPercentage * 100}%`,
        totalCashedOut,
        availableBalance: allocatedAmount - totalCashedOut
      },
      cashoutHistory: cashouts
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
