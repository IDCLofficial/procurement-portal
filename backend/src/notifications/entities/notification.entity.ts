import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum NotificationType {
  PAYMENT_RECIEVED = 'Payment Recieved',
  APPLICATION_SUBMITTED = 'Application Submitted',
  STATUS_UPDATED = 'Status Updated',
  APPLICATION_APPROVED = 'Application Approved',
  APPLICATION_REJECTED = 'Application Rejected',
  FORWARDED_TO_REGISTRAR = 'Forwarded to Registrar',
  CLARIFICATION='Clarification Required',
  SLA_BREACH = 'SLA Breach',
  DOCUMENT_EXPIRED = 'Document Expired',
  CERTIFICATE_RENEWAL_DUE_SOON = 'Certificate Renewal Due Soon',
  CERTIFICATE_EXPIRED = 'Certificate Expired',
  REGISTRATION_RENEWAL_DUE_SOON = 'Registration Renewal Due Soon'
}

export enum NotificationRecipient {
  ADMIN = 'Admin',
  VENDOR = 'Vendor',
  REGISTRAR = 'Registrar',
  DESK_OFFICER = 'Desk Officer',
}

export enum priority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, enum: Object.values(NotificationType) })
  type: NotificationType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({required:true, type:Types.ObjectId, ref:'Vendor'})
  vendorId: Types.ObjectId;

  @Prop({ required: true, enum: Object.values(NotificationRecipient) })
  recipient: NotificationRecipient;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  recipientId?: Types.ObjectId;
  
  @Prop({required: true, enum:Object.values(priority)})
  priority : priority;

  @Prop({ type: Types.ObjectId, ref: 'Application', required: false })
  applicationId?: Types.ObjectId;

  @Prop({ default: false })
  isRead: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
