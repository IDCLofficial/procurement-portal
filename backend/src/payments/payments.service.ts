import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  private readonly secretKey: string
  private readonly initializeUrl: string
  private readonly verifyUrl: string

  constructor(private configservice:ConfigService){
    this.secretKey = this.configservice.get<string>('PAYSTACK_SECRET_KEY') || 'sk_test_xxxxxxxxxxxxxxxxxxxxx'
    this.initializeUrl = this.configservice.get<string>('PAYSTACK_INITIALIZE_URL') || 'https://api.paystack.co/transaction/initialize'
    this.verifyUrl = this.configservice.get<string>('PAYSTACK_VERIFY_URL') || 'https://api.paystack.co/transaction/verify/';
  }
async initializePayment(email: string, amount: number) {
    try {
      const response = await axios.post(
        this.initializeUrl,
        {
          email,
          amount: amount * 100, // Paystack uses kobo (multiply by 100)
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (err) {
      throw new BadRequestException(err.response.data);
    }
  }
  
  async verifyPayment(reference: string) {
    try {
      const response = await axios.get(`${this.verifyUrl}${reference}`, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      });
      return response.data;
    } catch (err) {
      throw new BadRequestException(err.response.data);
    }
  }



}

