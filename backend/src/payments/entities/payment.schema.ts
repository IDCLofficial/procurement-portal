import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApplicationType } from 'src/applications/entities/application.schema';

export enum PaymentStatus {
    PENDING = 'pending',
    VERIFIED = 'verified',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ required: true, unique: true })
    paymentId: string; // e.g., PAY-2024-001

    @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
    companyId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Application', required: false })
    applicationId?: Types.ObjectId;

    @Prop({ required: true })
    amount: number; // e.g., 110000

    @Prop({ required: true, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING })
    status: PaymentStatus;

    @Prop({ required: true, enum: Object.values(ApplicationType) })
    type: ApplicationType;

    @Prop({ required: true })
    description: string; // e.g., "Initial Registration - Works Grade A"

    @Prop({ required: false })
    category?: string; // e.g., "WORKS, ICT"

    @Prop({ required: false })
    grade?: string; // e.g., "Grade A"

    @Prop({ required: false })
    transactionReference?: string; // e.g., "PYSTACK-app-2024-009"

    @Prop({ required: false })
    paystackReference?: string; // Paystack transaction reference

    @Prop({ required: false })
    paymentDate?: Date; // Date when payment was verified

    @Prop({ required: false })
    verificationMessage?: string; // e.g., "Payment has been confirmed via Paystack gateway"

    @Prop({ required: false })
    receiptUrl?: string; // URL to download receipt
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
