import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from "class-validator";
import {expiryEnum, renewalFreq} from "../entities/document.schema"

export class createDocumentPresetDto{
    @ApiProperty({description:"Name of the document",example:"Document name"})
    @IsString()
    @IsNotEmpty()
    documentName:string;

    @ApiProperty({description:"Is the document required",example:true})
    @IsBoolean()
    @IsNotEmpty()
    isRequired: boolean;

    @ApiProperty({description:"Does the document have an expiry date",example:"yes"})
    @IsEnum(expiryEnum)
    @IsNotEmpty()
    hasExpiry: expiryEnum;

    @ApiProperty({description:"How often does the document need to be renewed",example:"annual"})
    @IsEnum(renewalFreq)
    @IsNotEmpty()
    renewalFrequency: renewalFreq;
}