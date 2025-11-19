import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum ApplicationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export type ApplicationDocument = Application & Document

@Schema({timestamps:true})
export class Application {
    @Prop()
    applicationId: string;
    
    @Prop()
    companyName: string;

    @Prop({ type: Types.ObjectId, ref: 'Company' })
    companyId: Types.ObjectId;

    @Prop()
    rcBnNumber: string;

    @Prop()
    grade: string;

    @Prop()
    lga: string;

    @Prop()
    applicationStatus: ApplicationStatus;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

