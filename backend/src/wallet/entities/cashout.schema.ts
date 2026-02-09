import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum CashoutEntity {
    IIRS = 'IIRS',
    MDA = 'MDA',
    BPPPI = 'BPPPI',
    IDCL = 'IDCL'
}

export enum CashoutStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

export type CashoutDocument = Cashout & Document;

@Schema({ timestamps: true })
export class Cashout {
    @Prop({ required: true, unique: true })
    cashoutId: string; // e.g., CASH-2024-001

    @Prop({ required: true, enum: Object.values(CashoutEntity) })
    entity: CashoutEntity;

    @Prop({ required: false })
    mdaName?: string; // Specific MDA name if entity is MDA

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, enum: Object.values(CashoutStatus), default: CashoutStatus.PENDING })
    status: CashoutStatus;

    @Prop({ required: true })
    description: string;

    @Prop({ required: false })
    transactionReference?: string;

    @Prop({ required: false })
    cashoutDate?: Date;

    @Prop({ required: false })
    approvedBy?: string; // Admin user ID or name

    @Prop({ required: false, type: MongooseSchema.Types.Mixed })
    bankDetails?: {
        accountName: string;
        accountNumber: string;
        bankName: string;
    };

    @Prop({ required: false })
    notes?: string;
}

export const CashoutSchema = SchemaFactory.createForClass(Cashout);
