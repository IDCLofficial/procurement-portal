import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export enum Status{
    PENDING="Pending",
    NEED_REVIEW="Needs Review",
    APPROVED="Approved",
    REJECTED="Rejected"
}

export enum idType{
    NIN="NIN",
    VOTERS_CARD="Voters Card",
    DRIVERS_LICENSE="Drivers License",
    INTERNATIONAL_PASSPORT="International Passport"
}

export type CompanyDocument = Company & Document;
export type DirectorsDocument = Directors & Document

export enum documentType {"NIN","International Passport", "Drivers licence", "Voters card"}

export type Director = {
    name: string,
    email: string,
    phone: string,
    idType:idType,
    id: string
}

@Schema({ timestamps: true })
export class Company {
    @ApiProperty({ description: 'ObjectId of the user', example: '507f1f77bcf86cd799439011' })
    @Prop({ type: Types.ObjectId, required: true })
    userId: Types.ObjectId;

    @ApiProperty({ description: 'Name of the company', example: 'Tech Innovators Inc.' })
    @Prop({ required: true })
    companyName: string;

    @ApiProperty({ description: 'CAC number', example: 'RC123456' })
    @Prop({ required: true })
    cacNumber: string;

    @ApiProperty({ description: 'TIN', example: '1234567890' })
    @Prop({ required: true })
    tin: string;

    @ApiProperty({ description: 'Address of the company', example: '123 Tech Street, Silicon Valley' })
    @Prop({ required: true })
    address: string;

    @ApiProperty({ description: 'Local Government Area', example: 'Silicon Valley LGA' })
    @Prop({ required: true })
    lga: string;

    @Prop({ 
        required: false, 
        type: Array,
        default:[]
    })
    categories: object[]
    
    @Prop({ 
        required: false, 
        type: String,
        default:""
    })
    grade?: string

    @Prop({
        required:false,
        type:[Types.ObjectId],
        ref:"Document"
    })
    documents?: Types.ObjectId[];

    @ApiProperty({ description: 'Website of the company', example: 'https://www.techinnovators.com', required: false })
    @Prop()
    website?: string;

    @ApiProperty({ description: 'Bank name', example: 'First Bank', required: true, default:" " })
    @Prop({ required: false })
    bankName?: string;

    @ApiProperty({ description: 'Account number', example: 1234567890, required: true, default:0 })
    @Prop({ required: false })
    accountNumber?: number;

    @ApiProperty({ description: 'Account name', example: 'Tech Innovators Inc.', required: true, default:" " })
    @Prop({ required: false })
    accountName?: string;

    @Prop({
        required:false,
        type:Types.ObjectId,
        ref:"Directors"
    })
    directors?:Types.ObjectId
}

@Schema({ timestamps: true })
export class Directors {
    @ApiProperty({ description: 'ObjectId of the user', example: '507f1f77bcf86cd799439011' })
    @Prop({ type: Types.ObjectId, required: true })
    userId: Types.ObjectId;

    @Prop({type: Array})
    directors: Director[]
}

export const CompanySchema = SchemaFactory.createForClass(Company);
export const DirectorsSchema = SchemaFactory.createForClass(Directors)
