import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignApplicationDto {
  @ApiProperty({
    description: 'User ID to assign the application to',
    example: '507f1f77bcf86cd799439011',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Full name of the user being assigned',
    example: 'John Doe',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  userName: string;
}
