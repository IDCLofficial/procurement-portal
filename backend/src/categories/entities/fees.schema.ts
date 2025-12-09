import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type FeesDocument = Fees & Document;

export enum Grade {
    A="A",
    B="B",
    C="C"
}

@Schema({timestamps:true})
export class Fees {
    @Prop({required:true, enum:Grade})
    grade:Grade

    @Prop({required:true, type:Number})
    fee:number

    @Prop({required:true, type:String})
    effectiveDate:string

}

export const FeesSchema = SchemaFactory.createForClass(Fees);
