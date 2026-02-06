import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum Role {
    DESK_OFFICER = "Desk officer",
    AUDITOR = "Auditor",
    REGISTRAR = "Registrar",
    ADMIN = "Admin",
    MINISTRY="Ministry",
    IIRS="iirs"
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, type: String })
    fullName: string;

    @Prop({ required: true, unique: true, type: String })
    email: string;

    @Prop({ required: true, type: String })
    phoneNo: string;

    @Prop({ required: true, enum: Role, type: String })
    role: Role;

    @Prop({required: false, type: String})
    mda?: string;

    @Prop({ required: true, type: String })
    password: string;

    @Prop({ required: true, default: true, type: Boolean })
    isActive: boolean;

    @Prop({ required: true, default: 0, type: Number })
    assignedApps: number;

    @Prop({ type: Date })
    lastLogin?: Date;

    @Prop({required: false, type: String})
    accessToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
