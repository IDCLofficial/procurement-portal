import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


export enum certificateStatus{
    APPROVED="approved",
    EXPIRED = "expired",
    REVOKED = "revoked",
}
export type CertificateDocument = Certificate & Document;

@Schema({timestamps:true})
export class Certificate {
    @Prop({required:true, unique:true})
    certificateId: string;

    @Prop({ type: Types.ObjectId, ref: 'Vendor', required: true })
    contractorId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref:'Company', required:true})
    company: Types.ObjectId;

    @Prop({required:true})
    contractorName: string;

    @Prop({required:true})
    rcBnNumber: string;

    @Prop({required:true})
    grade: string;

    @Prop({required:true})
    lga: string;

    @Prop({required:true, enum: certificateStatus})
    status: certificateStatus;

    @Prop({required:true})
    validUntil: Date;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
