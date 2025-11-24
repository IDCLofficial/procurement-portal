import { ApiProperty } from "@nestjs/swagger";
import { IsLowercase, IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({example:"sector"})
    @IsString()
    @IsNotEmpty()
    @IsLowercase()
    sector:string;
}
