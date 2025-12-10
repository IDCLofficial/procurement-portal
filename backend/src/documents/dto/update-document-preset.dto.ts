import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { expiryEnum, renewalFreq } from "../entities/document.schema";

export class UpdateDocumentPresetDto {
    @ApiProperty({ 
        description: "Name of the document", 
        example: "CAC Certificate",
        required: false
    })
    @IsString()
    @IsOptional()
    documentName?: string;

    @ApiProperty({ 
        description: "Is the document required", 
        example: true,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isRequired?: boolean;

    @ApiProperty({ 
        description: "Does the document have an expiry date", 
        example: "yes",
        required: false
    })
    @IsEnum(expiryEnum)
    @IsOptional()
    hasExpiry?: expiryEnum;

    @ApiProperty({ 
        description: "How often does the document need to be renewed", 
        example: "annual",
        required: false
    })
    @IsEnum(renewalFreq)
    @IsOptional()
    renewalFrequency?: renewalFreq;
}
