// src/payments/services/paystack-split.service.ts
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { 
  CreateSplitDto,
  UpdateSplitDto,
  InitializePaymentWithSplitDto,
} from 'src/payments/dto/split-payment.dto';
import { paymentType } from 'src/payments/entities/payment.schema';

@Injectable()
export class PaystackSplitService {
  private readonly logger = new Logger(PaystackSplitService.name);
  private readonly paystackClient: AxiosInstance;
  private readonly baseUrl = 'https://api.paystack.co';

  constructor(private readonly configService: ConfigService) {
    const secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
    
    if (!secretKey) {
      throw new Error('PAYSTACK_SECRET_KEY is not configured');
    }

    this.paystackClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000, // 30 seconds timeout
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async createSplit(createSplitDto: CreateSplitDto) {
    try {
      const response = await this.paystackClient.post('/split', createSplitDto);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to create split');
    }
  }

  async listSplits(page = 1, perPage = 50) {
    try {
      const response = await this.paystackClient.get('/split', {
        params: { page, perPage },
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to list splits');
    }
  }

  async getSplit(id: string) {
    try {
      const response = await this.paystackClient.get(`/split/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get split');
    }
  }

  async updateSplit(id: string, updateSplitDto: UpdateSplitDto) {
    try {
      const response = await this.paystackClient.put(
        `/split/${id}`,
        updateSplitDto,
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to update split');
    }
  }

  async deleteSplit(id: string) {
    try {
      const response = await this.paystackClient.delete(`/split/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to delete split');
    }
  }

  async addSubaccountToSplit(id: string, subaccount: string, share: number) {
    try {
      const response = await this.paystackClient.post(
        `/split/${id}/subaccount/add`,
        { subaccount, share },
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to add subaccount to split');
    }
  }

  async removeSubaccountFromSplit(id: string, subaccount: string) {
    try {
      const response = await this.paystackClient.post(
        `/split/${id}/subaccount/remove`,
        { subaccount },
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to remove subaccount from split');
    }
  }

  async initializeTransaction(dto: InitializePaymentWithSplitDto, email:string, reference:string) {
    try {
      const splitCode = this.configService.get<string>('PAYSTACK_SPLIT_CODE');
      const payload = {
        email: email,
        amount: dto.amount * 100,
        split_code: splitCode || 'SPL_3yyVlNI9mE',
        reference: reference,
        callback_url: `http://localhost:3000/payment-callback`,
        metadata: dto.metadata,
      };

      this.logger.log(`Initializing Paystack transaction with reference: ${reference}`);
      this.logger.debug(`Payload: ${JSON.stringify(payload)}`);

      const response = await this.paystackClient.post(
        '/transaction/initialize',
        payload,
      );
      
      this.logger.log(`Transaction initialized successfully: ${reference}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Transaction initialization failed for reference: ${reference}`);
      this.handleError(error, 'Failed to initialize transaction');
    }
  }

  async verifyTransaction(reference: string) {
    try {
      const response = await this.paystackClient.get(
        `/transaction/verify/${reference}`,
      );
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to verify transaction');
    }
  }

  async listTransactions(page = 1, perPage = 50) {
    try {
      const response = await this.paystackClient.get('/transaction', {
        params: { page, perPage },
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to list transactions');
    }
  }

  async getTransaction(id: string) {
    try {
      const response = await this.paystackClient.get(`/transaction/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error, 'Failed to get transaction');
    }
  }

  private handleError(error: any, defaultMessage: string): never {
    this.logger.error(defaultMessage, error);

    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || error.message || defaultMessage;
      const statusCode = error.response?.status || HttpStatus.BAD_REQUEST;

      throw new HttpException(
        {
          statusCode,
          message,
          error: error.response?.data || 'Paystack API Error',
        },
        statusCode,
      );
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: defaultMessage,
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}