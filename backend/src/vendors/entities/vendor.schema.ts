import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type VendorDocument = Vendor & Document;

export enum companyForm{
  STEP1="company",
  STEP2="directors",
  STEP3="bankDetails",
  STEP4="documents",
  STEP5="categoriesAndGrade",
  COMPLETE="complete"
}

@Schema({ timestamps: true })
export class Vendor {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phoneNo: string;

  @Prop({ required: true })
  password: string;

  @Prop({required:true, default: false })
  isVerified: boolean;

  @Prop({required:false, default:" "})
  certificateId:string;

  @Prop({required:false, ref:"Company"})
  companyId:Types.ObjectId;

  @Prop({required:true, enum:companyForm, default:companyForm.STEP1})
  companyForm:companyForm

  @Prop({ default: 0 })
  otpFailedAttempts: number;

  @Prop({ type: Date })
  otpLockoutUntil?: Date;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);

// Add indexes for better query performance
VendorSchema.index({ email: 1 });
VendorSchema.index({ verificationToken: 1 });
