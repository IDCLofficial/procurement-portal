import { Injectable } from '@nestjs/common';
import { PaystackService } from '../paystack/paystack.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly paystackService: PaystackService) {}

  /**
   * Initialize a payment transaction with Paystack
   * 
   * @param email - Customer email address
   * @param amount - Amount to charge in Naira (will be converted to kobo)
   * @returns Paystack initialization response with authorization URL and reference
   * @throws {HttpException} If Paystack API request fails
   * 
   * @description
   * Initiates a payment transaction with Paystack:
   * - Converts amount from Naira to kobo (multiply by 100)
   * - Generates a unique reference for the transaction
   * - Sends request to Paystack API with customer email and amount
   * - Returns authorization URL for customer to complete payment
   * - Returns transaction reference for verification
   * 
   * @example
   * const result = await initializePayment('customer@example.com', 5000);
   * // Returns: { status: true, message: "Authorization URL created", data: { authorization_url: "...", reference: "..." } }
   */
  async initializePayment(email: string, amount: number) {
    // Generate unique reference
    const reference = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Convert amount to kobo
    const amountInKobo = this.paystackService.getAmountInKobo(amount);

    const paymentData = {
      email,
      amount: amountInKobo,
      reference,
      callback_url: process.env.PAYSTACK_CALLBACK_URL || 'http://localhost:3000/payments/callback',
    };

    return await this.paystackService.initiatePayment(paymentData);
  }

  /**
   * Verify a payment transaction with Paystack
   * 
   * @param reference - Transaction reference returned from initialization
   * @returns Paystack verification response with transaction details
   * @throws {HttpException} If Paystack API request fails or reference is invalid
   * 
   * @description
   * Verifies a payment transaction with Paystack:
   * - Queries Paystack API with transaction reference
   * - Returns transaction status and details
   * - Confirms if payment was successful
   * - Provides customer and transaction metadata
   * 
   * @example
   * const result = await verifyPayment('abc123xyz');
   * // Returns: { status: true, message: "Verification successful", data: { status: "success", amount: 500000, ... } }
   */
  async verifyPayment(reference: string) {
    return await this.paystackService.verifyPayment(reference);
  }
}
