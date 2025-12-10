import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ActivityType {
  APPROVED='Company registration approved',
  ACCOUNT_CREATED = 'Account Created',
  PROFILE_UPDATED = 'Profile Updated',
  COMPANY_REGISTERED = 'Company Registered',
  COMPANY_UPDATED = 'Company Updated',
  APPLICATION_CREATED = 'Application Created',
  APPLICATION_SUBMITTED = 'Application Submitted',
  PAYMENT_INITIATED = 'Payment Initiated',
  PAYMENT_COMPLETED = 'Payment Completed',
  PAYMENT_FAILED = 'Payment Failed',
  DOCUMENT_UPLOADED = 'Document Uploaded',
  DOCUMENT_UPDATED = 'Document Updated',
  PROFILE_RENEWAL_INITIATED = 'Profile Renewal Initiated',
  PROFILE_RENEWAL_COMPLETED = 'Profile Renewal Completed',
  PASSWORD_CHANGED = 'Password Changed',
  LOGIN = 'Login',
  LOGOUT = 'Logout'
}

export type VendorActivityLogDocument = VendorActivityLog & Document;

@Schema({ timestamps: true })
export class VendorActivityLog {
  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true, index: true })
  vendorId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(ActivityType) })
  activityType: ActivityType;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Object, required: false })
  metadata?: Record<string, any>;

  @Prop({ required: false })
  ipAddress?: string;

  @Prop({ required: false })
  userAgent?: string;
}

export const VendorActivityLogSchema = SchemaFactory.createForClass(VendorActivityLog);

// Index for efficient querying
VendorActivityLogSchema.index({ vendorId: 1, createdAt: -1 });
