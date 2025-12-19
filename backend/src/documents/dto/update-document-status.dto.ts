import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Status, type statusObject } from '../entities/document.schema';

export class UpdateDocumentStatusDto {
  @ApiProperty({
    description: 'Status object containing status and optional message',
    required: true
  })
  @IsNotEmpty()
  @IsEnum(Status)
  status: statusObject;
}
