import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

interface OtpRecord {
  code: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
}

const OTP_EXPIRY_MINUTES = 15;
const MAX_OTP_ATTEMPTS = 3;

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend;
  private otpStore: Map<string, OtpRecord> = new Map();

  constructor(private configService: ConfigService) {
    const emailConfig = this.configService.get('email');
    if (!emailConfig?.apiKey) {
      this.logger.error('RESEND_API_KEY is not configured');
      throw new Error('RESEND_API_KEY is required');
    }
    this.resend = new Resend(emailConfig.apiKey);
    
    // Cleanup expired OTPs every 5 minutes to prevent memory leaks
    setInterval(() => this.cleanupExpiredOtps(), 5 * 60 * 1000);
  }

  // Generate a random OTP code
  private generateOtpCode(length = 5): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  // Create and store a new OTP for an email
  createOtp(email: string): string {
    const code = this.generateOtpCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);

    this.otpStore.set(email, {
      code,
      expiresAt,
      verified: false,
      attempts: 0
    });

    // Clean up expired OTPs
    this.cleanupExpiredOtps();

    return code;
  }

  // Verify an OTP code for an email
  verifyOtp(email: string, code: string): { isValid: boolean; message?: string } {
    const otpRecord = this.otpStore.get(email);
    
    if (!otpRecord) {
      return { isValid: false, message: 'No OTP found for this email' };
    }

    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      return { isValid: false, message: 'Maximum verification attempts exceeded' };
    }

    if (new Date() > otpRecord.expiresAt) {
      return { isValid: false, message: 'OTP has expired' };
    }

    if (otpRecord.code !== code) {
      otpRecord.attempts += 1;
      return { 
        isValid: false, 
        message: `Invalid OTP. ${MAX_OTP_ATTEMPTS - otpRecord.attempts} attempts remaining.` 
      };
    }

    otpRecord.verified = true;
    return { isValid: true };
  }

  // Send OTP email
  async sendOtpEmail(email: string, userName: string): Promise<boolean> {
    try {
      const otp = this.createOtp(email);
      const emailConfig = this.configService.get('email');
      
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Hello ${userName},</p>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <p>Best regards,<br>Procurement Bureau</p>
        </div>
      `;

      const result = await this.resend.emails.send({
        from: emailConfig?.from || 'noreply@ezconadvisory.com',
        to: [email],
        subject: 'Your Verification Code',
        html: emailHtml,
      });

      if (result.error) {
        this.logger.error('Failed to send OTP email:', result.error);        
        throw new ConflictException(`Failed to send email`)
      }

      this.logger.log(`OTP sent successfully to ${email}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending OTP email:', error);
      
      // Don't hide the actual error in development
      if (error instanceof ConflictException) {
        throw error;
      }
      
      throw new ConflictException('Failed to send verification email. Please try again.')
    }
  }

  // Clean up expired OTPs from the store
  private cleanupExpiredOtps(): void {
    const now = new Date();
    for (const [email, otp] of this.otpStore.entries()) {
      if (now > otp.expiresAt) {
        this.otpStore.delete(email);
      }
    }
  }
}
