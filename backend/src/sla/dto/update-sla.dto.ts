import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateSlaDto {
    @ApiProperty({ 
        example: 5, 
        description: 'Desk Officer Review time in business days',
        required: false
    })
    @IsNumber()
    @IsOptional()
    @Min(1)
    deskOfficerReview?: number;

    @ApiProperty({ 
        example: 3, 
        description: 'Registrar Review time in business days',
        required: false
    })
    @IsNumber()
    @IsOptional()
    @Min(1)
    registrarReview?: number;

    @ApiProperty({ 
        example: 7, 
        description: 'Clarification Response time in business days',
        required: false
    })
    @IsNumber()
    @IsOptional()
    @Min(1)
    clarificationResponse?: number;

    @ApiProperty({ 
        example: 2, 
        description: 'Payment Verification time in business days',
        required: false
    })
    @IsNumber()
    @IsOptional()
    @Min(1)
    paymentVerification?: number;

    @ApiProperty({ 
        example: 10, 
        description: 'Total Processing Target in business days',
        required: false
    })
    @IsNumber()
    @IsOptional()
    @Min(1)
    totalProcessingTarget?: number;
}
