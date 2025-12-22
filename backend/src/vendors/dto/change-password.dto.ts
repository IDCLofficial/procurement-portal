import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class changePasswordDto {
    @IsNotEmpty()
    @IsString()
    currentPassword:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![\n.])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
    })
    newPassword: string;

    @IsNotEmpty()
    @IsString()
    confirmPassword:string

}