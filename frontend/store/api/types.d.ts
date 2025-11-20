interface CreateVendorRequest {
    fullname: string;
    email: string;
    phoneNo: string;
    password: string;
}

interface VerifyVendorRequest {
    email: string;
    otp: string;
}

interface ResendVerificationOtpRequest {
    email: string;
}

interface LoginVendorRequest {
    email: string;
    password: string;
}


interface ResponseError {
    error: {
        status: number;
        data: {
            message: string;
            error: string;
            statusCode: number;
        };
    };
}

interface User {
    _id: string;
    fullname: string;
    email: string;
    phoneNo: string;
    certificateId: string;
    isVerified: boolean;
    companyForm: VendorSteps;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ResponseSuccess {
    data: {
        user: User;
        token: string;
    };
}

type LoginVendorResponse = ResponseSuccess | ResponseError;

enum VendorSteps {
    COMPLETE = "complete",
    COMPANY = "company",
    DIRECTORS = "directors",
    BANK_DETAILS = "bankDetails",
    DOCUMENTS = "documents",
    CATEGORIES_AND_GRADE = "categoriesAndGrade",
}

interface CompleteVendorRegistrationRequest {
    [VendorSteps.COMPANY]?: {
        companyName: string;
        cacNumber: string;
        tin: string;
        businessAddres: string;
        lga: string;
        website: string;
    };
    [VendorSteps.DIRECTORS]?: {
        fullName: string;
        idType: string;
        id: string;
        phone: number;
        email: string;
    }[];
    [VendorSteps.BANK_DETAILS]?: {
        bankName: string;
        accountNumber: number;
        accountName: string;
    };
    [VendorSteps.DOCUMENTS]?: {
        documentType: string;
        validFrom?: string;
        validTo?: string;
    }[];
    [VendorSteps.CATEGORIES_AND_GRADE]?: {
        categories: {
            sector: string;
            service: string;
        }[];
        grade: string;
    };
}




export { CreateVendorRequest, VerifyVendorRequest, ResendVerificationOtpRequest, LoginVendorRequest, LoginVendorResponse, ResponseSuccess, ResponseError, User, CompleteVendorRegistrationRequest, VendorSteps };