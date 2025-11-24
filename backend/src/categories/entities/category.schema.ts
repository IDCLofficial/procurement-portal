import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CategoryDocument = Category & Document;

export enum Grade {
    A="A",
    B="B",
    C="C"
}

@Schema({timestamps:true})
export class Category {
    @Prop({required:true})
    sector:string;

    @Prop({required:true, enum:Grade})
    grade:Grade

    @Prop({required:true})
    fee:number

    @Prop({required:true})
    effectiveDate:string
}

export const CategorySchema = SchemaFactory.createForClass(Category);
