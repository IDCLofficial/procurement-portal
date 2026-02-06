import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, IsUppercase } from "class-validator";

export class CreateGradeDto {
    @ApiProperty({
        example:"Works",
        description:"Category name"
    })
    @IsNotEmpty()
    @IsString()
    category:string;

    @ApiProperty({ 
        example: "A", 
        description: "Grade type (A, B, C, or D)"
    })
    @IsNotEmpty()
    @IsString()
    @IsUppercase()
    grade: string;

    @ApiProperty({ 
        example: 50000, 
        description: "Registration cost for this grade"
    })
    @IsNumber()
    @IsNotEmpty()
    registrationCost: number;

    @ApiProperty({
        example: 25000,
        description: "Renewal fee for this grade"
    })
    @IsNumber()
    @IsNotEmpty()
    renewalFee: number;

    @ApiProperty({ 
        example: '500000 - 1000000', 
        description: "Financial capacity requirement for this grade"
    })
    @IsString()
    @IsNotEmpty()
    financialCapacity: string;
}
