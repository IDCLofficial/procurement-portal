import { IsEnum, IsNotEmpty } from 'class-validator';
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
}
