import { Module } from '@nestjs/common';
import { MdaService } from './mda.service';
import { MdaController } from './mda.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MdaSchema } from './entities/mda.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {name:'Mda', schema:MdaSchema} 
    ])
  ],
  controllers: [MdaController],
  providers: [MdaService],
})
export class MdaModule {}
