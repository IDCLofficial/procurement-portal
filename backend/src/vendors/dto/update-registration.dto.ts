import { IsArray, IsObject, IsOptional } from "class-validator"
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
export type documents={
    documentType:string,
    documentUrl:string,  // URL returned from Sirv after uploading via /documents endpoint
    validFrom?:string,
    validTo?:string
}
type category={
    sector:string,
    service:string,
}
export type categoriesAndGrade={
    categories:category[],
    grade:string
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
    documents:documents[]

    @IsOptional()
    @IsObject()
    categoriesAndGrade:categoriesAndGrade
}