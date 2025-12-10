import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type AuditLogDocument = AuditLog & Document;

export enum AuditAction {
  // Application Actions
  APPLICATION_SUBMITTED = "Application Submitted",
  APPLICATION_REVIEWED = "Application Reviewed",
  APPLICATION_FORWARDED = "Application Forwarded",
  APPLICATION_APPROVED = "Application Approved",
  APPLICATION_REJECTED = "Application Rejected",
  CLARIFICATION_REQUESTED = "Clarification Requested",
  CLARIFICATION_SUBMITTED = "Clarification Submitted",
  
  // Certificate Actions
  CERTIFICATE_GENERATED = "Certificate Generated",
  CERTIFICATE_REVOKED = "Certificate Revoked",
  CERTIFICATE_RENEWED = "Certificate Renewed",
  
  // User Actions
  USER_CREATED = "User Created",
  USER_UPDATED = "User Updated",
  USER_DELETED = "User Deleted",
  USER_ACTIVATED = "User Activated",
  USER_DEACTIVATED = "User Deactivated",
  
  // Settings Actions
  SETTINGS_UPDATED = "Settings Updated",
  SLA_UPDATED = "SLA Updated",
  
  // Document Actions
  DOCUMENT_UPLOADED = "Document Uploaded",
  DOCUMENT_VERIFIED = "Document Verified",
  DOCUMENT_REJECTED = "Document Rejected",
  
  // Report Actions
  REPORT_GENERATED = "Report Generated",
  
  // Payment Actions
  PAYMENT_INITIATED = "Payment Initiated",
  PAYMENT_VERIFIED = "Payment Verified",
  PAYMENT_FAILED = "Payment Failed"
}

export enum AuditSeverity {
  INFO = "Info",
  WARNING = "Warning",
  SUCCESS = "Success",
  ERROR = "Error"
}

export enum EntityType {
  APPLICATION = "Application",
  CERTIFICATE = "Certificate",
  USER = "User",
  SETTINGS = "Settings",
  DOCUMENT = "Document",
  REPORT = "Report",
  PAYMENT = "Payment"
}

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ required: true })
  timestamp: Date;

  @Prop({ required: true })
  actor: string; // Name of the person who performed the action

  @Prop({ type: Types.ObjectId, ref: 'Vendor', required: false })
  actorId?: Types.ObjectId; // Reference to the user who performed the action

  @Prop({ required: true })
  role: string; // Role of the actor (e.g., desk officer, registrar, system admin, vendor)

  @Prop({ required: true, enum: Object.values(AuditAction) })
  action: AuditAction;

  @Prop({ required: true, enum: Object.values(EntityType) })
  entityType: EntityType;

  @Prop({ required: true })
  entityId: string; // ID of the entity affected (e.g., app-2024-001, cert-2024-001)

  @Prop({ required: true })
  details: string; // Description of what happened

  @Prop({ required: true, enum: Object.values(AuditSeverity), default: AuditSeverity.INFO })
  severity: AuditSeverity;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ type: Object, required: false })
  metadata?: Record<string, any>; // Additional contextual data
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
