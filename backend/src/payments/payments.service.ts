import { Injectable, BadRequestException, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaystackSplitService } from 'src/paystack/paystack.service';
import {
  CreateSplitDto,
  UpdateSplitDto,
  InitializePaymentWithSplitDto,
} from 'src/payments/dto/split-payment.dto';
import { Payment, PaymentDocument, PaymentStatus, paymentType } from './entities/payment.schema';
import { Company, CompanyDocument } from 'src/companies/entities/company.schema';
import { Application, ApplicationDocument, ApplicationStatus, ApplicationType } from 'src/applications/entities/application.schema';
import { companyForm, renewalSteps, Vendor, VendorDocument } from 'src/vendors/entities/vendor.schema';
import { VendorsService } from 'src/vendors/vendors.service';
import { ActivityType } from 'src/vendors/entities/vendor-activity-log.schema';
import { Notification, NotificationDocument, NotificationRecipient, NotificationType, priority } from 'src/notifications/entities/notification.entity';
import { User, UserDocument } from 'src/users/entities/user.schema';
import { ApplicationsService } from 'src/applications/applications.service';

@Injectable()
export class SplitPaymentService {
  private readonly logger = new Logger(SplitPaymentService.name);

  constructor(
    private readonly paystackSplitService: PaystackSplitService,
    private vendorService:VendorsService,
    private applicationService: ApplicationsService,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
    @InjectModel(Vendor.name) private vendorModel:Model<VendorDocument>,
    @InjectModel(Notification.name) private notificationModel:Model<NotificationDocument>,
    @InjectModel(User.name) private userModel:Model<UserDocument>,
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
      console.log(paymentReference);
      const result = await this.paystackSplitService.initializeTransaction(dto, user.email, paymentReference);

      //

      // Create payment document and save to database
      const paymentId = await this.generatePaymentId();

      // Convert categories array to comma-separated string
      const categoryString = company.category

      const payment = new this.paymentModel({
        paymentId,
        companyId: new Types.ObjectId(company._id as Types.ObjectId),
        amount: dto.amount, // Convert from kobo to naira,
        category: categoryString || 'N/A',
        grade: company.grade,
        status: PaymentStatus.PENDING,
        type: dto.type,
        paymentDate: new Date(),
        description: dto.description,
        transactionReference: paymentReference,
      });

      await payment.save();
      this.logger.log(`Payment document created: ${paymentId}`);

      this.logger.log(`Payment initialized: ${payment.transactionReference}`);

      return {
        authorization_url:result.data.authorization_url
      }
    
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
        const payment = await this.paymentModel.findOneAndUpdate({ transactionReference: reference }, 
          {
            $set: {
              paymentDate:new Date()
            }
          }
        );
        if (!payment) {
          throw new NotFoundException("Payment record not found");
        } 

        // Log payment completion activity
        await this.vendorService.createActivityLog(
          userId,
          ActivityType.PAYMENT_COMPLETED,
          `Payment of ₦${payment.amount.toLocaleString()} completed successfully`,
          {
            paymentId: payment.paymentId,
            amount: payment.amount,
            reference: reference,
            grade: payment.grade,
            type: payment.type
          }
        );

        if(payment.type === paymentType.PROCESSINGFEE){
          
          vendor.companyForm = companyForm.COMPLETE
          await vendor.save();
          
          const createApplication = await this.applicationService.createApplicationDoc(
            ApplicationType.NEW,
            company,
            payment
          )
          // Log application submission activity
          await this.vendorService.createActivityLog(
            userId,
            ActivityType.APPLICATION_SUBMITTED,
            `Application ${createApplication.applicationId} submitted for ${payment.grade} grade`,
            {
              applicationId: createApplication.applicationId,
              grade: payment.grade,
              type: payment.type,
              companyName: company.companyName
            }
          );
          this.logger.log(`Activity logs created for payment and application submission`);
          // Update payment record with application ID and status
          await this.paymentModel.findOneAndUpdate(
            { transactionReference: reference },
            {
              status: PaymentStatus.VERIFIED,
              paymentDate: new Date(),
              verificationMessage: 'Payment has been confirmed via Paystack gateway',
              applicationId: createApplication.applicationId,
            }
          );
          
          //notifiy the vendor
          await this.notificationModel.create({
            type: NotificationType.APPLICATION_SUBMITTED,
            title: 'Application Submitted',
            message: `Your payment has been recieved and your application has been submitted successfully. It may take around 1-7 working days for your documents to be reviewed.`,
            recipient: NotificationRecipient.VENDOR,
            vendorId: vendor._id,
            priority: priority.LOW,
            isRead: false,
          });
          const admins = await this.userModel.find({ role: 'Admin' });
          for (const admin of admins){
            await this.notificationModel.create({
              type: NotificationType.APPLICATION_SUBMITTED,
              title: 'Application Recieved',
              message: `${vendor.fullname} just submitted an application.`,
              recipient: NotificationRecipient.ADMIN,
              recipientId: admin._id,
              priority: priority.HIGH,
              isRead: false,
            });
          }
        } else if(payment.type === paymentType.RENEWAL){
          const submitRenewalApp = await this.applicationService.createApplicationDoc(
            ApplicationType.RENEWAL,
            company,
            payment
          )
          vendor.renewalStep = renewalSteps.COMPLETE
          await vendor.save();

          // Log application submission activity
          await this.vendorService.createActivityLog(
            userId,
            ActivityType.APPLICATION_SUBMITTED,
            `Application ${submitRenewalApp.applicationId} submitted for ${payment.grade} grade`,
            {
              applicationId: submitRenewalApp.applicationId,
              grade: payment.grade,
              type: payment.type,
              companyName: company.companyName
            }
          );

          //notify the vendor
          await this.notificationModel.create({
            type: NotificationType.APPLICATION_SUBMITTED,
            title: 'Renewal Application Submitted',
            message: `Your payment has been recieved and your renewal documents have been submitted successfully. It may take up to 1-7 working days to have your documents reviewed`,
            recipient: NotificationRecipient.VENDOR,
            vendorId: vendor._id,
            priority: priority.LOW,
            isRead: false,
          });

          //notify the Admin
          const admins = await this.userModel.find({ role: 'Admin' });
          for (const admin of admins){
            await this.notificationModel.create({
              type: NotificationType.APPLICATION_SUBMITTED,
              title: 'Renewal Application Recieved',
              message: `${vendor.fullname} just submitted a renewal application.`,
              recipient: NotificationRecipient.ADMIN,
              recipientId: admin._id,
              priority: priority.HIGH,
              isRead: false,
            });
          }
        }else if(payment.type === paymentType.CERTIFICATEFEE){
          try{
            const certificate = await this.applicationService.generateCertificate(company._id);
            
            if(!certificate){
              throw new ConflictException("failed to generate certificate")
            }

            await this.vendorModel.findOneAndUpdate({
              _id:certificate.contractorId
            }, {
              $set: {
                certificateId:certificate.certificateId
              }
            })
            
            const updatedApplication = await this.applicationModel.findOneAndUpdate(
              {
                companyId: company._id,
                type:ApplicationType.NEW
              },
              {status: ApplicationStatus.VERIFIED},
              {new:true}
            ).exec();

            console.log(updatedApplication)

            if(!updatedApplication){
              throw new NotFoundException("application not found")
            }

            console.log()
            // Log application submission activity
            await this.vendorService.createActivityLog(
              userId,
              ActivityType.CERTIFICATE_ISSUED,
              `Payment recieved, your certificate has been issued`,
              {
                grade: payment.grade,
                type: payment.type,
                companyName: company.companyName
              }
            );
  
            //notify the vendor
            await this.notificationModel.create({
              type: NotificationType.APPLICATION_SUBMITTED,
              title: 'Certificate Issued',
              message: `Your payment has been recieved and your certificate has been issued successfully.`,
              recipient: NotificationRecipient.VENDOR,
              vendorId: vendor._id,
              priority: priority.LOW,
              isRead: false,
            });
  
            //notify the Admin
            const admins = await this.userModel.find({ role: 'Admin' });
            for (const admin of admins){
              await this.notificationModel.create({
                type: NotificationType.APPLICATION_SUBMITTED,
                title: 'Certificate Issued',
                message: `${vendor.fullname} just paid for certificate issuance`,
                recipient: NotificationRecipient.ADMIN,
                recipientId: admin._id,
                priority: priority.LOW,
                isRead: false,
              });
            }
            this.logger.log(`Payment verified and updated: ${reference}`);
          }catch(e){
            this.logger.error(e)
            throw new ConflictException("failed to update vendor document")
          }
        }
      }else{
        throw new ConflictException('The payment was not successful')
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


  async getAllPayments(page = 1, limit = 20, status?: string) {
    try {
      this.logger.log(`Fetching all payments - Page: ${page}, Limit: ${limit}, Status: ${status || 'all'}`);

      const skip = (page - 1) * limit;
      const query = status ? { status } : {};

      const [payments, total] = await Promise.all([
        this.paymentModel
          .find(query)
          .populate('companyId', 'companyName cacNumber email phoneNumber')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.paymentModel.countDocuments(query),
      ]);

      return {
        success: true,
        data: payments,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(`Error fetching all payments: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }
}