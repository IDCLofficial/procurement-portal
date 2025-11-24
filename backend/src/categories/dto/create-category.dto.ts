import { ApiProperty } from "@nestjs/swagger";
import { IsLowercase, IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({example:"works"})
    @IsString()
    @IsNotEmpty()
    @IsLowercase()
    sector:string;

    @ApiProperty({example:"Construction & Engineering"})
    @IsString()
    @IsNotEmpty()
    description:string;
}
