import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { CreateCashoutDto } from './dto/create-cashout.dto';
import { Payment } from 'src/payments/entities/payment.schema';
import { Company } from 'src/companies/entities/company.schema';
import { Cashout, CashoutStatus, CashoutEntity } from './entities/cashout.schema';
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

    // Get all cashed out transaction IDs
    const completedCashouts = await this.CashoutModel.find({
      status: CashoutStatus.COMPLETED
    }).select('cashedOutTransactions entity').exec();

    const cashedOutTransactionIds: string[] = completedCashouts.reduce((acc: string[], cashout) => {
      return acc.concat(cashout.cashedOutTransactions || []);
    }, []);

    // Get count of cashed out vs uncashed transactions
    const totalProcessingFeePayments = await this.PaymentModel.countDocuments({
      type: 'processing fee',
      status: 'completed'
    });

    const cashedOutPaymentsCount = await this.PaymentModel.countDocuments({
      type: 'processing fee',
      status: 'completed',
      paymentId: { $in: cashedOutTransactionIds }
    });

    const uncashedPaymentsCount = totalProcessingFeePayments - cashedOutPaymentsCount;

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
      remitted: {
        totalAmountGenerated: totalRemitted,
        iirsTransactions: remittedMap['IIRS']?.count || 0,
        mdaTransactions: remittedMap['MDA']?.count || 0,
        bpppiTransactions: remittedMap['BPPPI']?.count || 0,
        totalPayments: cashoutsByEntity.reduce((sum, item) => sum + item.count, 0),
        lastCashout: {
          amount: lastCashout,
          date: lastCashoutRecord?.cashoutDate || null
        },
        entities: {
          iirs: {
            amount: iirsRemitted,
            percentage: `${iirsPercentage * 100}%`,
            count: remittedMap['IIRS']?.count || 0
          },
          mda: {
            amount: mdaRemitted,
            percentage: `${mdaPercentage * 100}%`,
            count: remittedMap['MDA']?.count || 0
          },
          bpppi: {
            amount: bpppiRemitted,
            percentage: `${bpppiPercentage * 100}%`,
            count: remittedMap['BPPPI']?.count || 0
          },
          idcl: {
            amount: idclRemitted,
            percentage: `${idclPercentage * 100}%`,
            count: remittedMap['IDCL']?.count || 0
          }
        }
      },
      unremitted: {
        totalAmountGenerated: totalUnremitted,
        iirsTransactions: iirsTransactions,
        mdaTransactions: mdaTransactions,
        bpppiTransactions: bpppiTransactions,
        totalPayments: totalNumberOfPayments,
        entities: {
          iirs: {
            amount: iirsUnremitted,
            percentage: `${iirsPercentage * 100}%`,
            allocated: iirsAllocated
          },
          mda: {
            amount: mdaUnremitted,
            percentage: `${mdaPercentage * 100}%`,
            allocated: mdaAllocated
          },
          bpppi: {
            amount: bpppiUnremitted,
            percentage: `${bpppiPercentage * 100}%`,
            allocated: bpppiAllocated
          },
          idcl: {
            amount: idclUnremitted,
            percentage: `${idclPercentage * 100}%`,
            allocated: idclAllocated
          }
        }
      },
      summary: {
        totalAmountGenerated,
        totalRemitted,
        totalUnremitted,
        totalNumberOfPayments,
        transactionTracking: {
          totalCompletedPayments: totalProcessingFeePayments,
          cashedOutPayments: cashedOutPaymentsCount,
          uncashedPayments: uncashedPaymentsCount,
          cashedOutPercentage: totalProcessingFeePayments > 0 
            ? ((cashedOutPaymentsCount / totalProcessingFeePayments) * 100).toFixed(2) + '%'
            : '0%'
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

      // Get recent cashouts
      const recentCashouts = await this.CashoutModel.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select({
          cashoutId: 1,
          entity: 1,
          mdaName: 1,
          amount: 1,
          status: 1,
          description: 1,
          transactionReference: 1,
          cashoutDate: 1,
          approvedBy: 1,
          createdAt: 1,
          updatedAt: 1
        })
        .exec();

      return {
        transactions: recentTransactions,
        count: recentTransactions.length,
        stats: stats.reduce((acc, stat) => {
          acc[stat._id] = {
            count: stat.count,
            totalAmount: stat.totalAmount
          };
          return acc;
        }, {}),
        recentCashouts: recentCashouts,
        cashoutCount: recentCashouts.length
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

      // Get all completed cashouts to determine which transactions have already been cashed out
      const completedCashouts = await this.CashoutModel.find({
        status: CashoutStatus.COMPLETED
      }).select('cashedOutTransactions').exec();

      const alreadyCashedOutTransactionIds: string[] = completedCashouts.reduce((acc: string[], cashout) => {
        return acc.concat(cashout.cashedOutTransactions || []);
      }, []);

      // Build match query based on entity
      let matchQuery: any = { 
        type: 'processing fee',
        status: 'completed'
      };

      // If entity is MDA, filter by specific MDA name
      if (createCashoutDto.entity === CashoutEntity.MDA && createCashoutDto.mdaName) {
        // Get companies for this MDA
        const companies = await this.CompanyModel.find({
          mda: createCashoutDto.mdaName
        }).select('_id').exec();
        
        const companyIds = companies.map(c => c._id);
        matchQuery.companyId = { $in: companyIds };
      }

      // Get uncashed transactions for this entity
      const uncashedTransactions = await this.PaymentModel.find({
        ...matchQuery,
        paymentId: { $nin: alreadyCashedOutTransactionIds }
      })
      .sort({ createdAt: 1 }) // Oldest first
      .select('paymentId amount createdAt description')
      .exec();

      // Select transactions that sum up to the cashout amount (or close to it)
      let runningTotal = 0;
      const selectedTransactions: string[] = [];
      const entityPercentage = 0.25; // Each entity gets 25%

      for (const transaction of uncashedTransactions) {
        const entityShare = transaction.amount * entityPercentage;
        if (runningTotal + entityShare <= createCashoutDto.amount) {
          selectedTransactions.push(transaction.paymentId);
          runningTotal += entityShare;
        }
        if (runningTotal >= createCashoutDto.amount) {
          break;
        }
      }

      const newCashout = new this.CashoutModel({
        cashoutId,
        entity: createCashoutDto.entity,
        mdaName: createCashoutDto.mdaName,
        amount: createCashoutDto.amount,
        description: createCashoutDto.description,
        bankDetails: createCashoutDto.bankDetails,
        notes: createCashoutDto.notes,
        cashedOutTransactions: selectedTransactions,
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
