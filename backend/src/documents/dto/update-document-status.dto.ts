import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../entities/document.schema';

export class StatusObject {
  @ApiProperty({
    description: 'Status of the document',
    enum: Status,
    example: Status.APPROVED,
    required: true
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    description: 'Optional message explaining the status (required for NEED_REVIEW and REJECTED)',
    example: 'Document needs additional information',
    required: false
  })
  @IsString()
  @IsOptional()
  message?: string;
}

export class UpdateDocumentStatusDto {
  @ApiProperty({
    description: 'Status object containing status and optional message',
    type: StatusObject,
    required: true
  })
  @ValidateNested()
  @Type(() => StatusObject)
  @IsNotEmpty()
  status: StatusObject;
}
