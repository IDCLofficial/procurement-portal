import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type GradeDocument = Grade & Document;

@Schema({ timestamps: true })
export class Grade {
    @Prop({required:true})
    category:string;

    @Prop({ required: true })
    grade: string;

    @Prop({ required: true })
    registrationCost: number;

    @Prop({ required: true})
    renewalFee:number;

    @Prop({ required: true })
    financialCapacity: number;

}

export const GradeSchema = SchemaFactory.createForClass(Grade);
GradeSchema.index({ category: 1, grade: 1 }, { unique: true });