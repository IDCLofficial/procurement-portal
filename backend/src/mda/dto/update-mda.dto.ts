import { PartialType } from '@nestjs/swagger';
import { CreateMdaDto } from './create-mda.dto';

export class UpdateMdaDto extends PartialType(CreateMdaDto) {}
