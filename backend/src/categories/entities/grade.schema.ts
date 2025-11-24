import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type GradeDocument = Grade & Document;

export enum GradeType {
    A = "A",
    B = "B",
    C = "C",
    D = "D"
}

@Schema({ timestamps: true })
export class Grade {
    @Prop({ required: true, enum: GradeType, unique: true })
    grade: GradeType;

    @Prop({ required: true })
    registrationCost: number;

    @Prop({ required: true })
    financialCapacity: number;
}

export const GradeSchema = SchemaFactory.createForClass(Grade);