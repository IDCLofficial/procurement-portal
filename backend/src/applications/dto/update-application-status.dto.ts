import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus, CurrentStatus } from '../entities/application.schema';

export class UpdateApplicationStatusDto {
  @ApiProperty({
    description: 'Status of the application',
    enum: CurrentStatus,
    example: CurrentStatus.APPROVED,
    required: true
  })
  @IsEnum(CurrentStatus)
  @IsNotEmpty()
  applicationStatus: CurrentStatus;
}
