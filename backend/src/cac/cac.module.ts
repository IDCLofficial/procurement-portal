import { Module } from '@nestjs/common';
import { CacLookupService } from './cac.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [CacLookupService],
  exports: [CacLookupService],
})
export class CacModule {}
