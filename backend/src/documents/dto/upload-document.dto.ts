import { IsNotEmpty, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Types } from "mongoose";

export class CreateDocumentDto {
    @ApiProperty({
        description: 'The MongoDB ObjectId of the vendor this document belongs to',
        example: '507f1f77bcf86cd799439011',
        required: true,
        type: String // Important for Swagger to know this is a string representation of ObjectId
    })
    @IsNotEmpty()
    @IsString()
    vendor: string;

    @ApiProperty({
        description: 'Name of the document',
        example: 'Business License',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    documentName: string;

    @ApiProperty({
        description: 'Date from which the document is valid (ISO 8601 format)',
        example: '2025-01-01',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    validFrom: string;

    @ApiProperty({
        description: 'Date until which the document is valid (ISO 8601 format)',
        example: '2025-12-31',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    validTo: string;
}