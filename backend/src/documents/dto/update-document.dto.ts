import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDto } from './upload-document.dto';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {}
