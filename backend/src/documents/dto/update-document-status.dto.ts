import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../entities/document.schema';

class StatusObject {
  @ApiProperty({ enum: Status, enumName: 'Status' })
  @IsEnum(Status)
  status: Status;

  @ApiProperty({ required: false })
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
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => StatusObject)
  status: StatusObject;
}
