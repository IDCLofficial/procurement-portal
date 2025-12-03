import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '../entities/application.schema';

export class UpdateApplicationStatusDto {
  @ApiProperty({
    description: 'Status of the application',
    enum: ApplicationStatus,
    example: ApplicationStatus.APPROVED,
    required: true
  })
  @IsEnum(ApplicationStatus)
  @IsNotEmpty()
  applicationStatus: ApplicationStatus;

  @ApiProperty({
    description: 'Optional notes about the status change',
    example: 'Documents verified and approved',
    required: false
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'ID of the user updating the status',
    example: '507f1f77bcf86cd799439011',
    required: false
  })
  @IsString()
  @IsOptional()
  updatedBy?: string;

  @ApiProperty({
    description: 'Name of the user updating the status',
    example: 'John Doe',
    required: false
  })
  @IsString()
  @IsOptional()
  updatedByName?: string;

  @ApiProperty({
    description: 'Role of the user updating the status',
    example: 'desk officer',
    required: false
  })
  @IsString()
  @IsOptional()
  updatedByRole?: string;

  @ApiProperty({
    description: 'IP address of the user updating the status',
    example: '192.168.1.1',
    required: false
  })
  @IsString()
  @IsOptional()
  ipAddress?: string;
}
