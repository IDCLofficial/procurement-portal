import { IsString, IsEnum, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/user.schema';

/**
 * DTO for editing user information
 * Only allows updating fullName and role fields
 */
export class EditUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    required: false,
    minLength: 2,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  fullName?: string;

  @ApiProperty({
    description: 'User role in the system',
    enum: Role,
    example: Role.DESK_OFFICER,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Role must be one of: Desk officer, Auditor, Registrar, Admin' })
  role?: Role;

  @ApiProperty({
    description: 'MDA of the user in the system',
    example: 'Education',
    required: false,
  })
  @IsOptional()
  @IsString()
  mda?: string;
}
