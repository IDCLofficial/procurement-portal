import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PaystackSplitService } from 'src/paystack/paystack.service';
import {
  CreateSplitDto,
  UpdateSplitDto,
  InitializePaymentWithSplitDto,
} from 'src/payments/dto/split-payment.dto';

@Injectable()
export class SplitPaymentService {
  private readonly logger = new Logger(SplitPaymentService.name);

  constructor(private readonly paystackSplitService: PaystackSplitService) {}

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

  async initializePaymentWithSplit(dto: InitializePaymentWithSplitDto) {
    try {
      this.logger.log(`Initializing payment with split: ${dto.split_code}`);
      
      // Generate reference if not provided
      if (!dto.reference) {
        dto.reference = this.generateReference();
      }

      const result = await this.paystackSplitService.initializeTransaction(dto);

      // Save transaction to database
      // await this.saveTransactionToDatabase(result.data);

      this.logger.log(`Payment initialized: ${dto.reference}`);
      return result;
    } catch (error) {
      this.logger.error(`Error initializing payment: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  async verifyPayment(reference: string) {
    try {
      this.logger.log(`Verifying payment: ${reference}`);
      const result = await this.paystackSplitService.verifyTransaction(reference);

      // Update transaction status in database
      // await this.updateTransactionStatus(reference, result.data.status);

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
    return `split_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}