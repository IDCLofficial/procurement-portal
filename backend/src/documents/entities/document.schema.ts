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
    @Prop({required:true, type:Types.ObjectId, ref:'Company', default:"691b16becc8430c0c0352e13"})
    companyId: Types.ObjectId;
    
    @Prop({required:true})
    documentName:string;

    @Prop({required:true})
    documentUrl:string;

    @Prop({required:true, default:" "})
    validFrom:string;

    @Prop({required:true, default:" "})
    validTo:string;
}

export const VerificationDocumentPresetSchema = SchemaFactory.createForClass(verificationDocPreset);
export const VerificationDocumentSchema = SchemaFactory.createForClass(verificationDocuments);

