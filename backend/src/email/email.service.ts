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
      attempts: 0,
    });

    // Clean up expired OTPs
    this.cleanupExpiredOtps();

    return code;
  }

  // Verify an OTP code for an email
  verifyOtp(
    email: string,
    code: string,
  ): { isValid: boolean; message?: string } {
    const otpRecord = this.otpStore.get(email);

    if (!otpRecord) {
      return { isValid: false, message: 'No OTP found for this email' };
    }

    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      return {
        isValid: false,
        message: 'Maximum verification attempts exceeded',
      };
    }

    if (new Date() > otpRecord.expiresAt) {
      return { isValid: false, message: 'OTP has expired' };
    }

    if (otpRecord.code !== code) {
      otpRecord.attempts += 1;
      return {
        isValid: false,
        message: `Invalid OTP. ${MAX_OTP_ATTEMPTS - otpRecord.attempts} attempts remaining.`,
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
        <div style='padding:1rem 2rem; align-items:center; justify-content:center; display:block'> 
          <div style="padding:1rem; display:block">
              <img src="https://images.unsplash.com/photo-1748959504388-9eb3143984e6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" style="width:80px; height:60px; border-radius:10px"/>
              <h2 style="font-family: Arial, sans-serif; font-weight:500; text-align:center;">Hi ${userName.split(' ')[0]}, Your Signup verification <br/>Code</h2>
            <div style="display:flex; align-items:center; justify-content:center; gap:1rem">
              ${otp.split('').map(
                (str) => `
               <div style="height:50px; width:50px; padding:1rem; background-color:red; box-shadow:0px 0px 8px 0px rgba(0,0,0,0.1); background-color:#fff; border-radius:10px; border:1px solid #e8e8e8; display:flex; align-items:center">
                ${str}
               </div>
              `,
              )}
            </div>
            <p style="color:rgba(130,130,130,0.86)">This code will expire in ${OTP_EXPIRY_MINUTES} minutes.</p>
            <p style="color:rgba(130,130,130,0.66); font-family: Arial, sans-serif;">Don't share this code to anyone!</p>
            <div style="
          background-color: #faf6eb;
          padding: 1rem 1.2rem;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          font-family: Arial, sans-serif;
          color: #5c4a24;
          max-width: 420px;
          line-height: 1.5;
          font-size: 14px;
        ">
          <div style="font-weight: bold; display: flex; align-items: center;">
            <span style="margin-right: 6px;">⚠️</span>
            Was this request not made by you?
          </div>

          <div style="margin-top: 6px; color:rgba(130,130,130,0.76)">
            This code was generated from a request made using Chrome browser on 
            <strong>macOS</strong> on 
            <strong>12/02/2024 AH</strong>.
            If you did not initiate this request, you can safely ignore this email.
          </div>
              
        </div>
        <p style="font-family: Arial, sans-serif;">
          <span style="color:rgba(130,130,130,0.66)">
            This is an automated message.         
          </span>
          Please do not reply.
        </p>
      </div>
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
        throw new ConflictException(`Failed to send email`);
      }

      this.logger.log(`OTP sent successfully to ${email}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending OTP email:', error);

      // Don't hide the actual error in development
      if (error instanceof ConflictException) {
        throw error;
      }

      throw new ConflictException(
        'Failed to send verification email. Please try again.',
      );
    }
  }

  async sendApplicationStatusUpdate(email: string, vendorName: string, applicationId: string, status: string, notes?: string) {
    try {
      const emailConfig = this.configService.get('email');
      const statusMessages = {
        'APPROVED': {
          subject: 'Application Approved',
          message: 'Your application has been approved!',
          color: '#4CAF50'
        },
        'REJECTED': {
          subject: 'Application Rejected',
          message: 'Your application has been rejected.',
          color: '#F44336'
        },
        'PENDING': {
          subject: 'Application Status Update',
          message: 'Your application status has been updated to Pending.',
          color: '#FFC107'
        },
        'REVIEW': {
          subject: 'Application Under Review',
          message: 'Your application is currently under review.',
          color: '#2196F3'
        },
        'RETURNED': {
          subject: 'Application Returned for Updates',
          message: 'Your application has been returned for additional information.',
          color: '#FF9800'
        },
        'CANCELLED': {
          subject: 'Application Cancelled',
          message: 'Your application has been cancelled.',
          color: '#9E9E9E'
        }
      };

      const statusInfo = statusMessages[status] || {
        subject: 'Application Status Update',
        message: `Your application status has been updated to ${status}.`,
        color: '#9C27B0'
      };

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://images.unsplash.com/photo-1748959504388-9eb3143984e6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                 style="width: 120px; height: auto; border-radius: 10px; margin-bottom: 20px;" 
                 alt="Company Logo">
          </div>
          
          <h2 style="color: ${statusInfo.color}; text-align: center;">${statusInfo.subject}</h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Hello ${vendorName.split(' ')[0]},</p>
            <p>${statusInfo.message}</p>
            
            ${notes ? `<div style="background-color: #fff3e0; padding: 12px; border-left: 4px solid ${statusInfo.color}; margin: 15px 0;">
              <p style="margin: 0; font-style: italic;">${notes}</p>
            </div>` : ''}
            
            <p>Application ID: <strong>${applicationId}</strong></p>
            <p>Status: <strong style="color: ${statusInfo.color}">${status}</strong></p>
          </div>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${this.configService.get('app.frontendUrl')}/applications/${applicationId}" 
               style="display: inline-block; padding: 12px 24px; 
                      background-color: ${statusInfo.color}; 
                      color: white; text-decoration: none; 
                      border-radius: 4px;">
              View Application
            </a>
          </p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>If you have any questions, please contact our support team.</p>
          </div>
        </div>
      `;

      const result = await this.resend.emails.send({
        from: emailConfig?.from || 'noreply@ezconadvisory.com',
        to: [email],
        subject: statusInfo.subject,
        html: emailHtml,
      });

      if (result.error) {
        this.logger.error('Failed to send application status email:', result.error);
        return false;
      }

      this.logger.log(`Application status email sent to ${email}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending application status email:', error);
      return false;
    }
  }

  async sendResetPasswordLink(resetLink: string, email: string) {
    const emailConfig = this.configService.get('email');
    const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>Password Reset Request</h2>
              <p>You requested to reset your password. Click the button below to set a new password:</p>
              <a href="${resetLink}" style="
                display: inline-block;
                padding: 12px 24px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
              ">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p>${resetLink}</p>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
            </div>
          `;

    await this.resend.emails.send({
      from: emailConfig?.from || 'noreply@procurement.gov.ng',
      to: [email],
      subject: 'Password Reset Request',
      html: emailHtml,
    });

    return {
      message:
        'If an account with this email exists, a password reset link has been sent',
    };
  }

  async sendApplicationApprovalEmail(email: string, vendorName: string, paymentLink: string): Promise<void> {
    try {
      const emailConfig = this.configService.get('email');

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #1a365d; margin: 0;">Application Approved</h2>
          </div>

          <p>Dear ${vendorName},</p>

          <p>Your application has been approved. Please proceed to payment for certificate issuance.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${paymentLink}"
               style="display: inline-block; padding: 12px 24px; background-color: #3182ce; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Proceed to Payment
            </a>
          </div>

          <p>If you have any questions or need further assistance, please contact support.</p>

          <p>Best regards,<br/>Procurement Portal Team</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `;

      const result = await this.resend.emails.send({
        from: emailConfig?.from || 'noreply@procurement.gov.ng',
        to: [email],
        subject: 'Your Application Has Been Approved',
        html: emailHtml,
      });

      if (result.error) {
        this.logger.error('Failed to send approval email:', result.error);
        throw new ConflictException('Failed to send approval email');
      }

      this.logger.log(`Approval email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send approval email to ${email}:`, error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException('Failed to send approval email');
    }
  }

  //

  // Clean up expired OTPs from the store
  private cleanupExpiredOtps(): void {
    const now = new Date();
    for (const [email, otp] of this.otpStore.entries()) {
      if (now > otp.expiresAt) {
        this.otpStore.delete(email);
      }
    }
  }

  // async sendApplicationApprovalEmail(email: string, vendorName: string, certificateLink:string): Promise<void> {
  //   try {
  //     const emailConfig = this.configService.get('email');
  //     const fromEmail = emailConfig?.from || 'noreply@procurement.gov.ng';
  //     const apiUrl = this.configService.get('app.frontendUrl') || 'https://procurement.gov.ng';
      
  //     const emailHtml = `
  //       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
  //         <div style="text-align: center; margin-bottom: 20px;">
  //           <h1 style="color: #1a365d;">Application Approved! 🎉</h1>
  //         </div>
          
  //         <p>Dear ${vendorName},</p>
          
  //         <p>We are pleased to inform you that your procurement application has been successfully approved!</p>
          
  //         <p>Your certificate has been issued and is now available for download. This certificate serves as proof of your registration with our procurement portal.</p>
          
  //         <div style="text-align: center; margin: 30px 0;">
  //           <a href="${appUrl}${certificateLink}" 
  //              style="display: inline-block; padding: 12px 24px; background-color: #3182ce; color: white; 
  //                     text-decoration: none; border-radius: 4px; font-weight: bold;">
  //             View Your Certificate
  //           </a>
  //         </div>
          
  //         <p>If you have any questions or need further assistance, please don't hesitate to contact our support team.</p>
          
  //         <p>Best regards,<br>Procurement Portal Team</p>
          
  //         <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
  //           <p>This is an automated message. Please do not reply to this email.</p>
  //         </div>
  //       </div>
  //     `;

  //     await this.resend.emails.send({
  //       from: `Procurement Portal <${fromEmail}>`,
  //       to: email,
  //       subject: 'Your Procurement Application Has Been Approved',
  //       html: emailHtml,
  //     });

  //     this.logger.log(`Approval email sent to ${email}`);
  //   } catch (error) {
  //     this.logger.error(`Failed to send approval email to ${email}:`, error);
  //     throw new Error('Failed to send approval email');
  //   }
  // }
}
