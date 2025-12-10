import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class CreateVendorDto {
  @ApiProperty({
    description: 'Full name of the vendor',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty({
    description: 'Email address of the vendor',
    example: 'vendor@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Phone number of the vendor (11 digits)',
    example: '08012345678',
  })
  @IsString()
  @Matches(/^[0-9]{11}$/, {
    message: 'Phone number must be 11 digits',
  })
  phoneNo: string;

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
