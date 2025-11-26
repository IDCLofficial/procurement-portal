import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { GradeType } from "../entities/grade.schema";

export class CreateGradeDto {
    @ApiProperty({ 
        example: "A", 
        enum: GradeType,
        description: "Grade type (A, B, C, or D)"
    })
    @IsEnum(GradeType)
    @IsNotEmpty()
    grade: GradeType;

    @ApiProperty({ 
        example: 50000, 
        description: "Registration cost for this grade"
    })
    @IsNumber()
    @IsNotEmpty()
    registrationCost: number;

    @ApiProperty({ 
        example: 1000000, 
        description: "Financial capacity requirement for this grade"
    })
    @IsNumber()
    @IsNotEmpty()
    financialCapacity: number;

    @ApiProperty({ 
        example: "2025-01-01", 
        description: "Effective date for this grade"
    })
    @IsString()
    @IsNotEmpty()
    effectiveDate: string;
}
