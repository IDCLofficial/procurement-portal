import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum ApplicationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export enum SLAStatus {
    OVERDUE = 'Overdue',
    ON_TIME = 'On Time'
}

export enum CurrentStatus {
    PENDING_DESK_REVIEW = 'Pending Desk Review',
    FORWARDED_TO_REGISTRAR = 'Forwarded to Registrar',
    PENDING_PAYMENT = 'Pending Payment',
    CLARIFICATION_REQUESTED = 'Clarification Requested',
    SLA_BREACH = 'SLA Breach',
    APPROVED = 'Approved',
    REJECTED = 'Rejected'
}

export enum ApplicationType {
    NEW = 'New',
    RENEWAL = 'Renewal',
    UPGRADE = 'Upgrade'
}

export type ApplicationDocument = Application & Document

@Schema({timestamps:true})
export class Application {
    @Prop({ required: true })
    applicationId: string;
    
    @Prop({ required: true })
    contractorName: string;

    @Prop({ type: Types.ObjectId, ref: 'Company' })
    companyId: Types.ObjectId;

    @Prop({ required: true })
    rcBnNumber: string;

    @Prop({ required: true })
    sectorAndGrade: string;

    @Prop({ required: true })
    grade: string;

    @Prop({ required: true, enum: Object.values(ApplicationType) })
    type: ApplicationType;

    @Prop({ required: true })
    submissionDate: Date;

    @Prop({ enum: Object.values(SLAStatus) })
    slaStatus: SLAStatus;
    
    @Prop({ type: Types.ObjectId, ref: 'User' })
    assignedTo: Types.ObjectId;

    @Prop()
    assignedToName: string;

    @Prop({ required: true, enum: Object.values(ApplicationStatus), default: ApplicationStatus.PENDING })
    applicationStatus: CurrentStatus;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

