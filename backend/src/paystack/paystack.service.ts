import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface PaystackInitiatePaymentDto {
  amount: number; // Amount in kobo (multiply by 100)
  email: string;
  reference: string;
  callback_url: string;
  metadata?: Record<string, any>;
}

export interface PaystackPaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyPaymentResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    amount: number;
    currency: string;
    status: string;
    reference: string;
    tx_ref: string;
    channel: string;
    gateway_response: string;
    customer: {
      id: number;
      email: string;
      customer_code: string;
      first_name: string;
      last_name: string;
    };
    paid_at: string;
    created_at: string;
    metadata: Record<string, any>;
  };
}

@Injectable()
export class PaystackService {
  private readonly secretKey: string;
  private readonly publicKey: string;
  private readonly baseUrl = 'https://api.paystack.co';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.secretKey =
      this.configService.get<string>('PAYSTACK_SECRET_KEY') || 'sk_test_...';
    this.publicKey =
      this.configService.get<string>('PAYSTACK_PUBLIC_KEY') || 'pk_test_...';
  }

  async initiatePayment(
    paymentData: PaystackInitiatePaymentDto,
  ): Promise<PaystackPaymentResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/transaction/initialize`,
          paymentData,
          {
            headers: {
              Authorization: `Bearer ${this.secretKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      if (!data.status) {
        throw new HttpException(
          data.message || 'Payment initiation failed',
          HttpStatus.BAD_REQUEST,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to initiate payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyPayment(
    reference: string,
  ): Promise<PaystackVerifyPaymentResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/transaction/verify/${reference}`,
          {
            headers: {
              Authorization: `Bearer ${this.secretKey}`,
            },
          },
        ),
      );

      if (!data.status) {
        throw new HttpException(
          data.message || 'Payment verification failed',
          HttpStatus.BAD_REQUEST,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to verify payment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  isPaymentSuccessful(
    paymentData: PaystackVerifyPaymentResponse['data'],
  ): boolean {
    return paymentData.status === 'success';
  }

  getAmountInNaira(amountInKobo: number): number {
    return amountInKobo / 100;
  }

  getAmountInKobo(amountInNaira: number): number {
    return Math.round(amountInNaira * 100);
  }
}
