import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';

class NotificationChannelsDto {
  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  email?: boolean;
}

class NotificationPreferencesDto {
  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  documentExpiryAlerts?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  renewalReminders?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  applicationUpdates?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  paymentConfirmations?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  systemUpdates?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  loginAlerts?: boolean;
}

export class UpdateVendorSettingsDto {
  @ApiPropertyOptional({ type: () => NotificationChannelsDto })
  @ValidateNested()
  @Type(() => NotificationChannelsDto)
  @IsOptional()
  notificationChannels?: NotificationChannelsDto;

  @ApiPropertyOptional({ type: () => NotificationPreferencesDto })
  @ValidateNested()
  @Type(() => NotificationPreferencesDto)
  @IsOptional()
  notificationPreferences?: NotificationPreferencesDto;
}