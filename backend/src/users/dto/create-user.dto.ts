import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { Role } from '../entities/user.schema';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    minLength: 2,
  })
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString({ message: 'Full name must be a string' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@education.gov',
    format: 'email',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '08012345678',
  })
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^0[789][01]\d{8}$/, { message: 'Invalid phone number format. Must be 11 digits starting with 070-091' })
  phoneNo: string;

  @ApiProperty({
    description: 'Role of the user in the system',
    enum: Role,
    example: Role.DESK_OFFICER,
  })
  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(Role, { message: 'Invalid role. Must be one of: Desk officer, Auditor, Registrar' })
  role: Role;

  @ApiProperty({
    description: 'MDA of the user in the system',
    example: 'Education',
  })
  @IsNotEmpty({ message: 'MDA is required' })
  @IsString({ message: 'MDA must be a string' })
  mda: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'SecurePass123!',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;
}
