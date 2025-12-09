import { IsArray, IsOptional } from "class-validator";
import { necessaryDocument } from "./update-registration.dto";

export class renewRegistrationDto{
    @IsOptional()
    @IsArray()
    documents:necessaryDocument[]
}
