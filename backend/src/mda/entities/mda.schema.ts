import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type mdaDocument = Mda & Document;

@Schema({timestamps:true})
export class Mda {
    @Prop({required:true})
    name: string;
    
    @Prop({required:true})
    code: string;
}

export const MdaSchema = SchemaFactory.createForClass(Mda);
