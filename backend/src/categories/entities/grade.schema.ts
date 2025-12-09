import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type GradeDocument = Grade & Document;

@Schema({ timestamps: true })
export class Grade {
    @Prop({ required: true, unique: true })
    grade: string;

    @Prop({ required: true })
    registrationCost: number;

    @Prop({ required: true })
    financialCapacity: number;

    @Prop({required:true, type:String})
    effectiveDate:string

}

export const GradeSchema = SchemaFactory.createForClass(Grade);