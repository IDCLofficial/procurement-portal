import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CategoryDocument = Category & Document;

@Schema({timestamps:true})
export class Category {
    @Prop({required:true})
    sector:string;

    @Prop({required:true})
    description:string;

    @Prop({required:true})
    registrationCost:number

    @Prop({required:true})
    financialCapacity:number
}

export const CategorySchema = SchemaFactory.createForClass(Category);
