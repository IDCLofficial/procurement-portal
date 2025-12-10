import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { SlaService } from './sla.service';
import { SlaController } from './sla.controller';
import { Sla, SlaSchema } from './entities/sla.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sla.name, schema: SlaSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [SlaController],
  providers: [SlaService],
  exports: [SlaService],
})
export class SlaModule {}
