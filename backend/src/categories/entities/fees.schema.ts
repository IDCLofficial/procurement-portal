import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type FeesDocument = Fees & Document;

export enum Grade {
    A="A",
    B="B",
    C="C"
}

@Schema({timestamps:true})
export class Fees {
    @Prop({required:true})
    sector:string;

    @Prop({required:true, enum:Grade})
    grade:Grade

    @Prop({required:true})
    fee:number

    @Prop({required:true})
    effectiveDate:string

}

export const FeesSchema = SchemaFactory.createForClass(Fees);
