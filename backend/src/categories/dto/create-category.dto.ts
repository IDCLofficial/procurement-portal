import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsLowercase, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Grade } from "../entities/category.schema";

export class CreateCategoryDto {
    @ApiProperty({example:"sector"})
    @IsString()
    @IsNotEmpty()
    @IsLowercase()
    sector:string;

    @ApiProperty({example:"grade"})
    @IsNotEmpty()
    @IsEnum(Grade)
    grade:Grade;

    @ApiProperty({example:"fee"})
    @IsNotEmpty()
    @IsNumber()
    fee:number;

    @ApiProperty({example:"effective date"})
    @IsNotEmpty()
    @IsString()
    effectiveDate:string;
}
