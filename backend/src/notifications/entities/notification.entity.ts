import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum NotificationType {
  APPLICATION_SUBMITTED = 'Application Submitted',
  STATUS_UPDATED = 'Status Updated',
  APPLICATION_APPROVED = 'Application Approved',
  APPLICATION_REJECTED = 'Application Rejected',
  FORWARDED_TO_REGISTRAR = 'Forwarded to Registrar',
}

export enum NotificationRecipient {
  ADMIN = 'Admin',
  VENDOR = 'Vendor',
  REGISTRAR = 'Registrar',
  DESK_OFFICER = 'Desk Officer',
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

  @Prop({ required: true, enum: Object.values(NotificationRecipient) })
  recipient: NotificationRecipient;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  recipientId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Application', required: true })
  applicationId: Types.ObjectId;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: Object })
  metadata?: {
    applicationNumber?: string;
    companyName?: string;
    oldStatus?: string;
    newStatus?: string;
    [key: string]: any;
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
