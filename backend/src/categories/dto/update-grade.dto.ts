import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateGradeDto {
    @ApiProperty({ 
        example: 60000, 
        description: "Updated registration cost",
        required: false
    })
    @IsNumber()
    @IsOptional()
    registrationCost?: number;

    @ApiProperty({ 
        example: 1500000, 
        description: "Updated financial capacity requirement",
        required: false
    })
    @IsNumber()
    @IsOptional()
    financialCapacity?: number;
    
    @ApiProperty({ 
        example: 1500000, 
        description: "Updated financial capacity requirement",
        required: false
    })
    @IsNumber()
    @IsOptional()
    renewalFee?: number;


    @ApiProperty({ 
        example: "2025-02-01", 
        description: "Updated effective date",
        required: false
    })
    @IsString()
    @IsOptional()
    effectiveDate?: string;
}
