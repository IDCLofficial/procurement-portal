import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum expiryEnum {
    yes="yes",
    no="no"
}
export enum renewalFreq {
    none="n/a",
    annual="annual"
}
export enum Status{
    PENDING="Pending",
    NEED_REVIEW="Needs Review",
    APPROVED="Approved",
    REJECTED="Rejected"
}

export type PresetDocument = verificationDocPreset & Document;
export type verificationDocument = verificationDocuments & Document;

@Schema({timestamps:true})
export class verificationDocPreset {
    @Prop({required:true})
    documentName:string;
    
    @Prop({required:true, default:false})
    isRequired:boolean;

    @Prop({required:true, default:"no"})
    hasExpiry:expiryEnum;

    @Prop({required:true, default:"n/a"})
    renewalFrequency:renewalFreq;
}

@Schema({timestamps:true})
export class verificationDocuments{
    @Prop({required:true, type:Types.ObjectId, ref:'Vendor'})
    vendor: Types.ObjectId;
    
    @Prop({required:true})
    fileUrl:string;

    @Prop({required:false})
    validFrom?:string;

    @Prop({required:false})
    validTo?:string;

    @Prop({required:true})
    documentType:string;

    @Prop({required:true})
    uploadedDate:string;

    @Prop({required:true})
    fileName:string;

    @Prop({required:true})
    fileSize:string;

    @Prop({required:true})
    fileType:string;

    @Prop({required:false})
    validFor?:string;

    @Prop({required:true})
    hasValidityPeriod:boolean;

    @Prop({required:true, default:Status.PENDING})
    status:Status;
}

export const VerificationDocumentPresetSchema = SchemaFactory.createForClass(verificationDocPreset);
export const VerificationDocumentSchema = SchemaFactory.createForClass(verificationDocuments);

