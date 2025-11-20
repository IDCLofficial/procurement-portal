import { IsArray, IsObject, IsOptional } from "class-validator"

export type registerCompany={
    companyName:string,
    cacNumber:string,
    tin:string,
    businessAddres:string,
    lga:string,
    website?:string
}
export type directors={
    fullName:string,
    idType:string,
    id:string,
    phone:number,
    email:string
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
    @IsObject()
    @IsOptional()
    company:registerCompany

    @IsArray()
    @IsOptional()
    directors:directors[]

    @IsObject()
    @IsOptional()
    bankDetails:bankDetails

    @IsArray()
    @IsOptional()
    documents:documents[]

    @IsObject()
    @IsOptional()
    categoriesAndGrade:categoriesAndGrade
}