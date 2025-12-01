import { Injectable, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaystackSplitService } from 'src/paystack/paystack.service';
import {
  CreateSplitDto,
  UpdateSplitDto,
  InitializePaymentWithSplitDto,
} from 'src/payments/dto/split-payment.dto';
import { Payment, PaymentDocument, PaymentStatus } from './entities/payment.schema';
import { Company, CompanyDocument } from 'src/companies/entities/company.schema';
import { NotFound } from '@aws-sdk/client-s3';
import { Application, ApplicationDocument } from 'src/applications/entities/application.schema';
import { ApplicationSubmittedEvent } from 'src/notifications/events/application-submitted.event';
import { Vendor, VendorDocument } from 'src/vendors/entities/vendor.schema';

@Injectable()
export class SplitPaymentService {
  private readonly logger = new Logger(SplitPaymentService.name);

  constructor(
    private readonly paystackSplitService: PaystackSplitService,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    @InjectModel(Vendor.name) private vendorModel:Model<VendorDocument>,
    private readonly configService: ConfigService,
  ) { }

  async createSplit(createSplitDto: CreateSplitDto) {
    try {
      this.logger.log(`Creating split: ${createSplitDto.name}`);

      // Validate split shares
      this.validateSplitShares(createSplitDto);

      const result = await this.paystackSplitService.createSplit(createSplitDto);

      // You can save split details to your database here
      // await this.saveSplitToDatabase(result.data);

      this.logger.log(`Split created successfully: ${result.data.split_code}`);
      return result;
    } catch (error) {
      this.logger.error(`Error creating split: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async listSplits(page = 1, perPage = 50) {
    try {
      return await this.paystackSplitService.listSplits(page, perPage);
    } catch (error) {
      this.logger.error(`Error listing splits: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async getSplit(id: string) {
    try {
      return await this.paystackSplitService.getSplit(id);
    } catch (error) {
      this.logger.error(`Error getting split: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async updateSplit(id: string, updateSplitDto: UpdateSplitDto) {
    try {
      this.logger.log(`Updating split: ${id}`);
      return await this.paystackSplitService.updateSplit(id, updateSplitDto);
    } catch (error) {
      this.logger.error(`Error updating split: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async deleteSplit(id: string) {
    try {
      this.logger.log(`Deleting split: ${id}`);
      return await this.paystackSplitService.deleteSplit(id);
    } catch (error) {
      this.logger.error(`Error deleting split: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async addSubaccountToSplit(id: string, subaccount: string, share: number) {
    try {
      this.logger.log(`Adding subaccount to split: ${id}`);
      return await this.paystackSplitService.addSubaccountToSplit(
        id,
        subaccount,
        share,
      );
    } catch (error) {
      this.logger.error(`Error adding subaccount: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async removeSubaccountFromSplit(id: string, subaccount: string) {
    try {
      this.logger.log(`Removing subaccount from split: ${id}`);
      return await this.paystackSplitService.removeSubaccountFromSplit(
        id,
        subaccount,
      );
    } catch (error) {
      this.logger.error(`Error removing subaccount: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async initializePaymentWithSplit(dto: InitializePaymentWithSplitDto, user: any) {
    try {
      const splitCode = this.configService.get<string>('PAYSTACK_SPLIT_CODE');
      this.logger.log(`Initializing payment with split: ${splitCode}`);

      console.log(user)
      const company = await this.companyModel.findOne({userId:new Types.ObjectId(user._id)});

      if(!company){
        throw new NotFoundException("company not found")
      }
      
      const paymentReference = this.generateReference();
      console.log(paymentReference)

      const result = await this.paystackSplitService.initializeTransaction(dto, user.email, paymentReference);

      //

      // Create payment document and save to database
      const paymentId = await this.generatePaymentId();

      // Convert categories array to comma-separated string
      const categoryString = company.categories
        .map(cat => cat.sector)
        .filter(Boolean)
        .join(', ')
        .toUpperCase();

      const payment = new this.paymentModel({
        paymentId,
        companyId: new Types.ObjectId(company._id as Types.ObjectId),
        amount: dto.amount / 100, // Convert from kobo to naira,
        category: categoryString || 'N/A',
        grade: company.grade,
        status: PaymentStatus.PENDING,
        type: dto.type,
        description: dto.description,
        transactionReference: paymentReference,
        paystackReference: result.data.reference,
      });

      await payment.save();
      this.logger.log(`Payment document created: ${paymentId}`);

      this.logger.log(`Payment initialized: ${payment.paystackReference}`);
      
      return result
    
    } catch (error) {
      this.logger.error(`Error initializing payment: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async verifyPayment(reference: string, userId: any) {
    try {
      this.logger.log(`Verifying payment: ${reference}`);
      const result = await this.paystackSplitService.verifyTransaction(reference);

      // Update transaction status in database
      if (result.data.status === 'success') {
        // Find the company
        const vendor  = await this.vendorModel.findById(userId);
        if(!vendor){
          throw new NotFoundException("Vendor not found") 
        }
        const company = await this.companyModel.findById(vendor.companyId);
        if (!company) {
          throw new NotFoundException("Company not found");
        }

        // Get the payment record to extract payment details
        const payment = await this.paymentModel.findOne({ transactionReference: reference });
        if (!payment) {
          throw new NotFoundException("Payment record not found");
        }

        // Generate unique application ID
        const applicationId = await this.generateApplicationId();

        // Create new application
        const newApplication = new this.applicationModel({
          applicationId,
          contractorName: company.companyName,
          companyId: new Types.ObjectId(company._id as Types.ObjectId),
          rcBnNumber: company.cacNumber,
          sectorAndGrade: payment.category && payment.grade
            ? `${payment.category} - ${payment.grade}`
            : payment.description,
          grade: payment.grade || 'N/A',
          type: payment.type as any, // Maps to ApplicationType (Registration, Renewal, Upgrade)
          submissionDate: new Date(),
          slaStatus: 'On Time',
          applicationStatus: 'Pending Desk Review',
        });

        await newApplication.save();
        this.logger.log(`Application created: ${applicationId}`);

        // Emit application submitted event
        // this.eventEmitter.emit(
        //   'application.submitted',
        //   new ApplicationSubmittedEvent(
        //     newApplication._id as Types.ObjectId,
        //     applicationId,
        //     company.companyName,
        //     company.userId,
        //     payment.grade || 'N/A',
        //     payment.type,
        //   ),
        // );
        this.logger.log(`Application submitted event emitted for: ${applicationId}`);

        // Update payment record with application ID and status
        await this.paymentModel.findOneAndUpdate(
          { transactionReference: reference },
          {
            status: PaymentStatus.VERIFIED,
            paymentDate: new Date(),
            verificationMessage: 'Payment has been confirmed via Paystack gateway',
            paystackReference: result.data.reference,
            applicationId: newApplication._id,
          }
        );
        this.logger.log(`Payment verified and updated: ${reference}`);
      }

      return result;
    } catch (error) {
      this.logger.error(`Error verifying payment: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  private validateSplitShares(createSplitDto: CreateSplitDto) {
    if (createSplitDto.type === 'percentage') {
      const totalShare = createSplitDto.subaccounts.reduce(
        (sum, sub) => sum + sub.share,
        0,
      );

      if (totalShare !== 100) {
        throw new BadRequestException(
          `Total percentage must equal 100. Current total: ${totalShare}`,
        );
      }
    }
  }

  private generateReference(): string {
    // Paystack only allows alphanumeric and "-,., =" characters
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000000);
    return `split-${timestamp}-${randomNum}`;
  }

  private async generatePaymentId(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.paymentModel.countDocuments();
    const paddedCount = String(count + 1).padStart(3, '0');
    return `PAY-${year}-${paddedCount}`;
  }

  private async generateApplicationId(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.applicationModel.countDocuments();
    const paddedCount = String(count + 1).padStart(3, '0');
    return `APP-${year}-${paddedCount}`;
  }
}