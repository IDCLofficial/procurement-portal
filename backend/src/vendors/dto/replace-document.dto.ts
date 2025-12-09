import type { necessaryDocument } from "./update-registration.dto";
import { IsObject } from "class-validator";

export class replaceDocumentDto {
    @IsObject()
    document:necessaryDocument
}