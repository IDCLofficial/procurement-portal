import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignApplicationDto {
  @ApiProperty({
    description: 'User ID to assign the application to',
    example: '507f1f77bcf86cd799439011',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Full name of the user being assigned',
    example: 'John Doe',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({
    description: 'ID of the admin performing the assignment',
    example: '507f1f77bcf86cd799439012',
    required: false
  })
  @IsString()
  @IsOptional()
  assignedBy?: string;

  @ApiProperty({
    description: 'Name of the admin performing the assignment',
    example: 'Admin User',
    required: false
  })
  @IsString()
  @IsOptional()
  assignedByName?: string;

  @ApiProperty({
    description: 'Role of the user performing the assignment',
    example: 'Admin',
    required: false
  })
  @IsString()
  @IsOptional()
  assignedByRole?: string;

  @ApiProperty({
    description: 'IP address of the user performing the assignment',
    example: '192.168.1.1',
    required: false
  })
  @IsString()
  @IsOptional()
  ipAddress?: string;
}
