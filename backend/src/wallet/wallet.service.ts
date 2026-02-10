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
        $match: { type: 'processing fee', status: 'verified' }
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


    // Get remitted (completed) cashouts by entity
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

    // Get unremitted cashouts by entity
    const unremittedCashoutsByEntity = await this.CashoutModel.aggregate([
      {
        $match: { status: CashoutStatus.UNREMITTED }
      },
      {
        $group: {
          _id: '$entity',
          totalUnremitted: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const unremittedMap = unremittedCashoutsByEntity.reduce((acc, item) => {
      acc[item._id] = {
        amount: item.totalUnremitted,
        count: item.count
      };
      return acc;
    }, {});

    // Count total cashouts
    const totalCompletedCashouts = await this.CashoutModel.countDocuments({
      status: CashoutStatus.COMPLETED
    });

    const totalUnremittedCashouts = await this.CashoutModel.countDocuments({
      status: CashoutStatus.UNREMITTED
    });

    const iirsRemitted = remittedMap['IIRS']?.amount || 0;
    const mdaRemitted = remittedMap['MDA']?.amount || 0;
    const bpppiRemitted = remittedMap['BPPPI']?.amount || 0;
    const idclRemitted = remittedMap['IDCL']?.amount || 0;

    // Get unremitted amounts from unremitted cashouts
    const iirsUnremitted = unremittedMap['IIRS']?.amount || 0;
    const mdaUnremitted = unremittedMap['MDA']?.amount || 0;
    const bpppiUnremitted = unremittedMap['BPPPI']?.amount || 0;
    const idclUnremitted = unremittedMap['IDCL']?.amount || 0;

    const totalRemitted = iirsRemitted + mdaRemitted + bpppiRemitted + idclRemitted;
    const totalUnremitted = iirsUnremitted + mdaUnremitted + bpppiUnremitted + idclUnremitted;

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
          moj: {
            amount: idclRemitted,
            percentage: `${ministryOfJusticePercentage * 100}%`,
            count: remittedMap['IDCL']?.count || 0
          }
        }
      },
      unremitted: {
        totalAmountGenerated: totalUnremitted,
        iirsTransactions: unremittedMap['IIRS']?.count || 0,
        mdaTransactions: unremittedMap['MDA']?.count || 0,
        bpppiTransactions: unremittedMap['BPPPI']?.count || 0,
        totalPayments: unremittedCashoutsByEntity.reduce((sum, item) => sum + item.count, 0),
        entities: {
          iirs: {
            amount: iirsUnremitted,
            percentage: `${iirsPercentage * 100}%`,
            allocated: totalUnremitted * iirsPercentage,
            count: unremittedMap['IIRS']?.count || 0
          },
          mda: {
            amount: mdaUnremitted,
            percentage: `${mdaPercentage * 100}%`,
            allocated: totalUnremitted * mdaPercentage,
            count: unremittedMap['MDA']?.count || 0
          },
          bpppi: {
            amount: bpppiUnremitted,
            percentage: `${bpppiPercentage * 100}%`,
            allocated: totalUnremitted * bpppiPercentage,
            count: unremittedMap['BPPPI']?.count || 0
          },
          moj: {
            amount: idclUnremitted,
            percentage: `${ministryOfJusticePercentage * 100}%`,
            allocated: totalUnremitted * ministryOfJusticePercentage,
            count: unremittedMap['IDCL']?.count || 0
          }
        }
      },
      summary: {
        totalAmountGenerated,
        totalRemitted,
        totalUnremitted,
        totalNumberOfPayments,
        transactionTracking: {
          totalCashouts: totalCompletedCashouts + totalUnremittedCashouts,
          completedCashouts: totalCompletedCashouts,
          unremittedCashouts: totalUnremittedCashouts,
          completedPercentage: (totalCompletedCashouts + totalUnremittedCashouts) > 0 
            ? ((totalCompletedCashouts / (totalCompletedCashouts + totalUnremittedCashouts)) * 100).toFixed(2) + '%'
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
        $match: { type: 'processing fee', status: 'verified' }
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
      const matchQuery: any = { type: 'processing fee', status: 'verified' };
      
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
    try {
      const iirsPercentage = 0.1; // 10%
      const skip = (page - 1) * limit;

      // Get total count for pagination
      const total = await this.PaymentModel.countDocuments({
        type: 'processing fee',
        status: 'verified'
      });

      // Get paginated processing fee transactions
      const processingFeePayments = await this.PaymentModel.aggregate([
        {
          $match: { 
            type: 'processing fee',
            status: 'verified'
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
            status: 'verified'
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
    } catch (error) {
      throw new BadRequestException(`Failed to fetch IIRS transactions: ${error.message}`);
    }
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
        $match: { type: 'processing fee'}
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

  async createUnremittedCashouts(paymentId: string, amount: number, companyId: string) {
    try {
      // Get company to determine MDA
      const company = await this.CompanyModel.findById(companyId).exec();
      const mdaName = company?.mda || 'Unknown';

      // Define entity percentages
      const entities = [
        { entity: CashoutEntity.IIRS, percentage: 0.1, mdaName: null },
        { entity: CashoutEntity.MDA, percentage: 0.2, mdaName: mdaName },
        { entity: CashoutEntity.BPPPI, percentage: 0.6, mdaName: null },
        { entity: CashoutEntity.IDCL, percentage: 0.1, mdaName: null }
      ];

      const cashouts: any[] = [];

      for (const entityConfig of entities) {
        const entityAmount = amount * entityConfig.percentage;
        const count = await this.CashoutModel.countDocuments();
        const cashoutId = `CASH-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

        const cashout = new this.CashoutModel({
          cashoutId,
          entity: entityConfig.entity,
          mdaName: entityConfig.mdaName,
          amount: entityAmount,
          cashedOutTransactions: [paymentId],
          status: CashoutStatus.UNREMITTED,
          description: `Unremitted ${entityConfig.entity} share from payment ${paymentId}`,
          notes: `Auto-generated from processing fee payment. ${entityConfig.percentage * 100}% allocation.`
        });

        const savedCashout = await cashout.save();
        cashouts.push(savedCashout);
      }

      return cashouts;
    } catch (err) {
      console.error(`Failed to create unremitted cashouts: ${err.message}`);
      throw err;
    }
  }

  async generateCashoutsForVerifiedPayments() {
    try {
      // Find all verified processing fee payments that haven't been cashed out
      const uncashedPayments = await this.PaymentModel.find({
        type: 'processing fee',
        status: 'verified',
      }).exec();

      if (uncashedPayments.length === 0) {
        return {
          message: 'No verified payments found that need cashout documents',
          count: 0,
          payments: []
        };
      }

      let totalCashoutsCreated = 0;
      const processedPayments: any[] = [];

      for (const payment of uncashedPayments) {
        try {
          const cashouts = await this.createUnremittedCashouts(
            payment.paymentId,
            payment.amount,
            payment.companyId.toString()
          );
          
          // Mark payment as cashed out
          await this.PaymentModel.findByIdAndUpdate(payment._id, {
            $set: { isCashout: true }
          });

          totalCashoutsCreated += cashouts.length;
          processedPayments.push({
            paymentId: payment.paymentId,
            amount: payment.amount,
            cashoutsCreated: cashouts.length
          });
        } catch (error) {
          console.error(`Failed to create cashouts for payment ${payment.paymentId}: ${error.message}`);
        }
      }

      return {
        message: `Successfully generated cashout documents for ${uncashedPayments.length} payment(s)`,
        paymentsProcessed: uncashedPayments.length,
        totalCashoutsCreated: totalCashoutsCreated,
        payments: processedPayments
      };
    } catch (err) {
      throw new BadRequestException(`Failed to generate cashouts: ${err.message}`);
    }
  }

  async completeCashout(transactionReference: string, entity?: string, mdaName?: string) {
    try {
      // Build query to get unremitted cashouts
      const query: any = { status: CashoutStatus.UNREMITTED };
      
      if (entity) {
        query.entity = entity;
      }
      
      if (mdaName) {
        query.mdaName = mdaName;
      }

      // Get all unremitted cashouts matching the criteria
      const unremittedCashouts = await this.CashoutModel.find(query).exec();

      if (unremittedCashouts.length === 0) {
        throw new BadRequestException(
          `No unremitted cashouts found${entity ? ` for entity: ${entity}` : ''}${mdaName ? ` and MDA: ${mdaName}` : ''}`
        );
      }

      // Update all matching cashouts to completed status
      const cashoutIds = unremittedCashouts.map(c => c._id);
      const updateResult = await this.CashoutModel.updateMany(
        { _id: { $in: cashoutIds } },
        {
          $set: {
            status: CashoutStatus.COMPLETED,
            transactionReference: transactionReference,
            cashoutDate: new Date()
          }
        }
      );

      // Get the updated cashouts to return
      const completedCashouts = await this.CashoutModel.find({ _id: { $in: cashoutIds } }).exec();

      return {
        message: `Successfully completed ${updateResult.modifiedCount} cashout(s)`,
        count: updateResult.modifiedCount,
        cashouts: completedCashouts,
        totalAmount: completedCashouts.reduce((sum, c) => sum + c.amount, 0)
      };
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
