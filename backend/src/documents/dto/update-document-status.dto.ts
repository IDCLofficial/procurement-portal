import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../entities/document.schema';

export class UpdateDocumentStatusDto {
  @ApiProperty({
    description: 'Status of the document',
    enum: Status,
    example: Status.APPROVED,
    required: true
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
