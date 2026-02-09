import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CashoutEntity } from '../entities/cashout.schema';

class BankDetailsDto {
  @ApiProperty({ example: 'ABC Company Ltd' })
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({ example: 'First Bank' })
  @IsString()
  @IsNotEmpty()
  bankName: string;
}

export class CreateCashoutDto {
  @ApiProperty({ 
    enum: CashoutEntity,
    example: CashoutEntity.IIRS,
    description: 'Entity receiving the cashout'
  })
  @IsEnum(CashoutEntity)
  @IsNotEmpty()
  entity: CashoutEntity;

  @ApiProperty({ 
    example: 'Ministry of Works',
    required: false,
    description: 'Specific MDA name if entity is MDA'
  })
  @IsString()
  @IsOptional()
  mdaName?: string;

  @ApiProperty({ 
    example: 125000,
    description: 'Amount to cash out'
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ 
    example: 'Quarterly cashout for IIRS - Q1 2024',
    description: 'Description of the cashout'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ 
    type: BankDetailsDto,
    required: false,
    description: 'Bank account details for the cashout'
  })
  @ValidateNested()
  @Type(() => BankDetailsDto)
  @IsOptional()
  bankDetails?: BankDetailsDto;

  @ApiProperty({ 
    example: 'Additional notes about this cashout',
    required: false
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
