import { IsString, IsEnum, IsNumber, IsArray, ValidateNested, IsOptional, Min, Max, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationType } from 'src/applications/entities/application.schema';
import { paymentType } from '../entities/payment.schema';

export enum SplitType {
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
}

export enum BearerType {
  ACCOUNT = 'account',
  SUBACCOUNT = 'subaccount',
  ALL_PROPORTIONAL = 'all-proportional',
  ALL = 'all',
}

export class SubaccountDto {
  @ApiProperty({ description: 'Subaccount code' })
  @IsString()
  subaccount: string;

  @ApiProperty({ description: 'Share amount or percentage', example: 20 })
  @IsNumber()
  @Min(0)
  share: number;
}

export class CreateSplitDto {
  @ApiProperty({ description: 'Name of the split' })
  @IsString()
  name: string;

  @ApiProperty({ enum: SplitType, description: 'Type of split' })
  @IsEnum(SplitType)
  type: SplitType;

  @ApiProperty({ type: [SubaccountDto], description: 'Array of subaccounts' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubaccountDto)
  subaccounts: SubaccountDto[];

  // @ApiProperty({ enum: BearerType, description: 'Who bears Paystack charges' })
  // @IsEnum(BearerType)
  // bearer_type: BearerType;

  // @ApiProperty({ description: 'Main account subaccount code' })
  // @IsString()
  // bearer_subaccount: string;
}

export class UpdateSplitDto {
  @ApiProperty({ description: 'Name of the split', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Active status', required: false })
  @IsOptional()
  active?: boolean;

  @ApiProperty({ enum: BearerType, required: false })
  @IsOptional()
  @IsEnum(BearerType)
  bearer_type?: BearerType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bearer_subaccount?: string;
}

export class InitializePaymentWithSplitDto {
  @ApiProperty({ description: 'Amount in kobo/cents' })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ enum: ApplicationType, description: 'Payment type' })
  @IsEnum(ApplicationType)
  type: paymentType;

  @ApiProperty({ description: 'Payment description', example: 'Initial Registration - Works Grade A' })
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}