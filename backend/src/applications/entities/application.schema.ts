import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum ApplicationStatus {
    PENDING_DESK_REVIEW = 'Pending Desk Review',
    FORWARDED_TO_REGISTRAR = 'Forwarded to Registrar',
    PENDING_PAYMENT = 'Pending Payment',
    CLARIFICATION_REQUESTED = 'Clarification Requested',
    SLA_BREACH = 'SLA Breach',
    APPROVED = 'Approved',
    REJECTED = 'Rejected'
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
    NEW = 'new',
    RENEWAL = 'renewal',
    UPGRADE = 'upgrade'
}

export type StatusHistoryObject = {
    status: ApplicationStatus;
    timestamp: Date;
    notes?: string;
    updatedBy?: Types.ObjectId;
    updatedByName?: string;
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

    @Prop({
        type: [{
            status: { type: String, enum: Object.values(ApplicationStatus), required: true },
            timestamp: { type: Date, required: true },
            notes: { type: String, required: false },
            _id: false
        }],
        default: function() {
            return [{
                status: ApplicationStatus.PENDING_DESK_REVIEW,
                timestamp: new Date()
            }];
        }
    })
    applicationTimeline: StatusHistoryObject[];

    @Prop({ required: true, enum: Object.values(ApplicationStatus), default: ApplicationStatus.PENDING_DESK_REVIEW })
    currentStatus: ApplicationStatus;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

