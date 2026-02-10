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
    const iirsPercentage = 0.1;
    const mdaPercentage = 0.2;
    const bpppiPercentage = 0.6;
    const ministryOfJusticePercentage = 0.1;

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
    const idclAllocated = totalAmountGenerated * ministryOfJusticePercentage;

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

    // Get count of cashed out vs uncashed transactions using isCashout field
    const totalProcessingFeePayments = await this.PaymentModel.countDocuments({
      type: 'processing fee',
      status: 'completed'
    });

    const cashedOutPaymentsCount = await this.PaymentModel.countDocuments({
      type: 'processing fee',
      status: 'completed',
      isCashout: true
    });

    const uncashedPaymentsCount = await this.PaymentModel.countDocuments({
      type: 'processing fee',
      status: 'completed',
      isCashout: { $ne: true }
    });

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
            percentage: `${ministryOfJusticePercentage * 100}%`,
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
            percentage: `${ministryOfJusticePercentage * 100}%`,
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

  async getIirsTransactions(page: number = 1, limit: number = 20) {
    const iirsPercentage = 0.1; // 10%
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await this.PaymentModel.countDocuments({
      type: 'processing fee',
      status: 'completed'
    });

    // Get paginated processing fee transactions
    const processingFeePayments = await this.PaymentModel.aggregate([
      {
        $match: { 
          type: 'processing fee',
          status: 'completed'
        }
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
        $project: {
          paymentId: 1,
          amount: 1,
          status: 1,
          paymentDate: 1,
          category: 1,
          grade: 1,
          description: 1,
          isCashout: 1,
          companyName: '$company.companyName',
          companyMda: '$company.mda',
          companyId: '$company._id',
          createdAt: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);

    // Calculate totals
    const totalProcessingFeesResult = await this.PaymentModel.aggregate([
      {
        $match: { 
          type: 'processing fee',
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const totalProcessingFees = totalProcessingFeesResult.length > 0 ? totalProcessingFeesResult[0].totalAmount : 0;
    const allocatedAmount = totalProcessingFees * iirsPercentage;

    // Get cashout history for IIRS
    const cashouts = await this.CashoutModel.find({
      entity: 'IIRS'
    })
    .sort({ createdAt: -1 })
    .exec();

    const totalCashedOut = cashouts
      .filter(c => c.status === CashoutStatus.COMPLETED)
      .reduce((sum, c) => sum + c.amount, 0);

    return {
      entity: 'IIRS',
      transactions: processingFeePayments,
      pagination: {
        currentPage: page,
        limit: limit,
        totalTransactions: total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      },
      summary: {
        totalTransactions: total,
        totalProcessingFees,
        allocatedAmount,
        iirsPercentage: `${iirsPercentage * 100}%`,
        totalCashedOut,
        availableBalance: allocatedAmount - totalCashedOut
      },
      cashoutHistory: cashouts
    };
  }

  async getMyMdaTransactions(mdaName: string, page: number = 1, limit: number = 20) {
    const mdaPercentage = 0.2; // 20%
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await this.PaymentModel.aggregate([
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
        $count: 'total'
      }
    ]);

    const total = totalCount.length > 0 ? totalCount[0].total : 0;

    // Get paginated processing fees for companies under this MDA
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
      },
      {
        $skip: skip
      },
      {
        $limit: limit
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
      pagination: {
        currentPage: page,
        limit: limit,
        totalTransactions: total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      },
      summary: {
        totalTransactions: total,
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

      // Build match query based on entity
      let matchQuery: any = { 
        type: 'processing fee',
        status: 'completed',
        isCashout: { $ne: true } // Only uncashed transactions
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

      // Get all uncashed transactions for this entity
      const uncashedTransactions = await this.PaymentModel.find(matchQuery)
        .sort({ createdAt: 1 }) // Oldest first
        .select('_id paymentId amount createdAt description')
        .exec();

      if (uncashedTransactions.length === 0) {
        throw new BadRequestException('No unremitted transactions available for cashout');
      }

      // Determine entity-specific percentage
      let entityPercentage: number;
      switch (createCashoutDto.entity) {
        case CashoutEntity.IIRS:
          entityPercentage = 0.1; // 10%
          break;
        case CashoutEntity.MDA:
          entityPercentage = 0.2; // 20%
          break;
        case CashoutEntity.BPPPI:
          entityPercentage = 0.6; // 60%
          break;
        case CashoutEntity.IDCL:
          entityPercentage = 0.1; // 10% (Ministry of Justice)
          break;
        default:
          throw new BadRequestException('Invalid entity');
      }

      // Calculate total unremitted amount for this entity
      let totalUnremittedAmount = 0;
      const selectedTransactions: string[] = [];
      const selectedTransactionIds: any[] = [];

      for (const transaction of uncashedTransactions) {
        const entityShare = transaction.amount * entityPercentage;
        totalUnremittedAmount += entityShare;
        selectedTransactions.push(transaction.paymentId);
        selectedTransactionIds.push(transaction._id);
      }

      // Mark all selected transactions as cashed out
      await this.PaymentModel.updateMany(
        { _id: { $in: selectedTransactionIds } },
        { $set: { isCashout: true } }
      );

      const newCashout = new this.CashoutModel({
        cashoutId,
        entity: createCashoutDto.entity,
        mdaName: createCashoutDto.mdaName,
        amount: totalUnremittedAmount, // Use calculated amount instead of user input
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
}
