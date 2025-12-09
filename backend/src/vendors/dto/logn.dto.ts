import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class loginDto {
    @ApiProperty({
        description: 'Email address of the vendor',
        example: 'vendor@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password for the vendor account',
        minLength: 8,
        example: 'SecurePass123!',
    })
    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![\n.])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
    })
    password: string;
   
}