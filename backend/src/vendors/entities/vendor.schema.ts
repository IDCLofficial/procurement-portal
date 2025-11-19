import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type VendorDocument = Vendor & Document;

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

  @Prop({required:true, default:" "})
  certificateId:string
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);

// Add indexes for better query performance
VendorSchema.index({ email: 1 });
VendorSchema.index({ verificationToken: 1 });
