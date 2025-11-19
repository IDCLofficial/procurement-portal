import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCompanyDto {
    @ApiProperty({ description: 'ObjectId of the vendor', example: '507f1f77bcf86cd799439011' })
    @IsString()
    vendorId: Types.ObjectId;

    @ApiProperty({ description: 'Name of the company', example: 'Tech Innovators Inc.' })
    @IsString()
    @IsNotEmpty()
    companyName: string;

    @ApiProperty({ description: 'CAC number', example: 'RC123456' })
    @IsString()
    @IsNotEmpty()
    cacNumber: string;

    @ApiProperty({ description: 'TIN', example: '1234567890' })
    @IsString()
    @IsNotEmpty()
    tin: string;

    @ApiProperty({ description: 'Address of the company', example: '123 Tech Street, Silicon Valley' })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({ description: 'Local Government Area', example: 'Silicon Valley LGA' })
    @IsString()
    @IsNotEmpty()
    lga: string;

    @ApiProperty({ description: 'Website of the company', example: 'https://www.techinnovators.com', required: false })
    @IsOptional()
    @IsString()
    website?: string;
}
