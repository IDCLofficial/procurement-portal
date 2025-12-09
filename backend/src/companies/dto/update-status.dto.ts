import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../entities/company.schema';

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Status of the company',
    enum: Status,
    example: Status.APPROVED,
    required: true
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
