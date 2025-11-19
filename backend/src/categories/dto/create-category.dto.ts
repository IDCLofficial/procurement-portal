import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({example:"sector"})
    @IsString()
    @IsNotEmpty()
    sector:string;

    @ApiProperty({example:"description"})
    @IsNotEmpty()
    description:string;

    @ApiProperty({example:"registrationCost"})
    @IsNumber()
    @IsNotEmpty()
    registrationCost:number;

    @ApiProperty({example:"financialCapacity"})
    @IsNumber()
    @IsNotEmpty()
    financialCapacity:number;
}
