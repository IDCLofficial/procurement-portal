import { IsArray, IsObject, IsOptional, IsString } from "class-validator"
import { idType } from "src/companies/entities/company.schema"

export type registerCompany={
    companyName:string,
    cacNumber:string,
    tin:string,
    businessAddres:string,
    lga:string,
    website?:string
}
export type directors={
    name:string,
    email:string,
    phone:string,
    idType:idType,
    id:string
}
export type bankDetails={
    bankName:string,
    accountNumber:number,
    accountName:string
}
export type necessaryDocument={
    fileUrl:string,
    validFrom?:string,
    validTo?:string,
    documentType:string,
    uploadedDate:string,
    fileName:string,
    fileSize:string,
    fileType:string,
    validFor?:string,
    hasValidityPeriod:boolean
}
export type category={
    sector:string,
    service:string
}
export type categoryAndGrade={
    category:string,
    mda:string,
    grade:string
}
export enum mode{
    REGISTRATION="registration",
    RENEWAL="renewal"
}


export class updateRegistrationDto{
    @IsOptional()
    @IsObject()
    company:registerCompany

    @IsOptional()
    @IsArray()
    directors:directors[]

    @IsOptional()
    @IsObject()
    bankDetails:bankDetails

    @IsOptional()
    @IsArray()
    documents:necessaryDocument[]

    @IsOptional()
    @IsObject()
    categoryAndGrade:categoryAndGrade

    @IsOptional()
    @IsString()
    mode:mode
}