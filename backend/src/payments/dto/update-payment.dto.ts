import { PartialType } from '@nestjs/mapped-types';
import { CreateSplitDto } from './split-payment.dto';

export class UpdatePaymentDto extends PartialType(CreateSplitDto) {}
