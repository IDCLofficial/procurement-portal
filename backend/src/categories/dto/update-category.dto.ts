import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class UpdateCategoryFieldsDto {
  @ApiProperty({
    example: 50000,
    description: 'Category fee amount',
    required: false
  })
  @IsOptional()
  @IsNumber()
  fee?: number;

  @ApiProperty({
    example: '2025-01-01',
    description: 'Effective date for the category',
    required: false
  })
  @IsOptional()
  @IsString()
  effectiveDate?: string;
}
