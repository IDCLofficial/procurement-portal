import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SlaDocument = Sla & Document;

@Schema({ timestamps: true })
export class Sla {
    @Prop({ required: true, type: Number, default: 5 })
    deskOfficerReview: number; // Business Days - Time allowed for initial document review

    @Prop({ required: true, type: Number, default: 3 })
    registrarReview: number; // Business Days - Time for final approval decision

    @Prop({ required: true, type: Number, default: 7 })
    clarificationResponse: number; // Business Days - Time for vendor to respond to clarifications

    @Prop({ required: true, type: Number, default: 2 })
    paymentVerification: number; // Business Days - Time to verify payment status

    @Prop({ required: true, type: Number, default: 10 })
    totalProcessingTarget: number; // Business Days - Overall target for complete application processing
}

export const SlaSchema = SchemaFactory.createForClass(Sla);
