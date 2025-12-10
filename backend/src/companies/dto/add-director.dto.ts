import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { documentType } from '../entities/company.schema';

export default class AddDirectorDto {
    @ApiProperty({ description: 'Name of the director', example: 'John Doe' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Email of the director', example: 'john.doe@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Phone number of the director', example: '+1234567890' })
    @IsString()
    phone: string;

    @ApiProperty({description:"id type", example:"NIN", enum:documentType})
    @IsString()
    @IsEnum(documentType)
    idType: documentType;

    @ApiProperty({ description: 'ID of the director', example: 'D12345' })
    @IsString()
    id: string;
}