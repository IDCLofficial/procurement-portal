import { VendorSteps } from "./enum";

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
        name: string;
        idType: string;
        id: string;
        phone: string;
        email: string;
    }[];
    [VendorSteps.BANK_DETAILS]?: {
        bankName: string;
        accountNumber: number;
        accountName: string;
    };
    [VendorSteps.DOCUMENTS]?: {
        id: string;
        fileUrl: string;
        validFrom?: string;
        validTo?: string;
        documentType: string;
        uploadedDate: string;
        fileName: string;
        fileSize: string;
        fileType: string;
        validFor: string;
        hasValidityPeriod: boolean;
    }[];
    [VendorSteps.CATEGORIES_AND_GRADE]?: {
        categories: {
            sector: string;
            service: string;
        }[];
        grade: string;
    };
}


interface RegisterCompanyResponse {
    message: string;
    result: {
        userId: string;
        companyName?: string;
        cacNumber?: string;
        tin?: string;
        address?: string;
        lga?: string;
        grade?: string;
        website?: string;
        _id: string;
        categories?: {
            sector: string;
            service: string;
        }[];
        createdAt: string;
        updatedAt: string;
        __v: number;
        directors?: {
            name: string;
            idType: "National Identification Number" | "International Passport" | "Driver's License" | "Voter's Card";
            id: string;
            phone: string;
            email: string;
        }[];
        documents?: {
            id: string;
            fileUrl: string;
            validFrom?: string;
            validTo?: string;
            documentType: string;
            uploadedDate: string;
            fileName: string;
            fileSize: string;
            fileType: string;
            validFor: string;
            hasValidityPeriod: boolean;
        }[];
        bankName?: string;
        accountNumber?: number;
        accountName?: string;
    };
    nextStep: string;
}

interface CompanyDetailsResponse {
    userId: string;
    companyName: string;
    cacNumber: string;
    tin: string;
    address: string;
    lga: string;
    grade: string;
    website: string;
    _id: string;
    categories: {
        sector: string;
        service: string;
    }[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    directors?: {
        name: string;
        idType: "National Identification Number" | "International Passport" | "Driver's License" | "Voter's Card";
        id: string;
        phone: string;
        email: string;
    }[];
    documents?: {
        _id: string;
        vendor: string;
        fileUrl: string;
        validFrom?: string;
        validTo?: string;
        documentType: string;
        uploadedDate: string;
        fileName: string;
        fileSize: string;
        fileType: string;
        validFor: string;
        hasValidityPeriod: boolean;
        status: {
            status: "pending" | "approved" | "needs review";
            message?: string;
        };
        createdAt: string;
        updatedAt: string;
        __v: number;
    }[];    
    bankName?: string;
    accountNumber?: number;
    accountName?: string;
}

interface DocumentRequirement {
    documentName: string;
    isRequired: boolean;
    hasExpiry: "yes" | "no";
    renewalFrequency: "annual" | "quarterly" | "monthly" | "never";
}

interface Category {
    _id: string;
    sector: string;
    description: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
}

interface Grade {
    _id: string;
    grade: string;
    registrationCost: number;
    financialCapacity: number;
    __v: number;
    createdAt: string;
    updatedAt: string;
}

interface CategoriesResponse {
    categories: Category[];
    grades: Grade[];
}

interface InitPaymentRequest {
    amount: number;
    type: "new" | "renewal";
    description?: string;
}
 
interface InitPaymentResponse {
    authorization_url: string;
}

interface Application {
    status: "Pending Desk Review" | "Forwarded to Registrar" | "Pending Payment" | "Clarification Requested" | "SLA Breach" | "Approved" | "Rejected";
    timestamp: string;
    notes: string;
}

type ApplicationTimeline = Array<{
    status: "Pending Desk Review" | "Forwarded to Registrar" | "Pending Payment" | "Clarification Requested" | "SLA Breach" | "Approved" | "Rejected";
    timestamp: string;
}>;

interface PaymentHistoryResponse {
    success: boolean;
    totalAmountPaid: number;
    totalThisYear: number;
    totalTransactions: number;
    paymentTable: {
        amount: number;
        reference: string;
        status: string;
        data: string;
        description: string;
        type: string;
    }[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export { CreateVendorRequest, VerifyVendorRequest, ResendVerificationOtpRequest, LoginVendorRequest, LoginVendorResponse, ResponseSuccess, ResponseError, User, CompleteVendorRegistrationRequest, RegisterCompanyResponse, CompanyDetailsResponse, DocumentRequirement, CategoriesResponse, InitPaymentRequest, InitPaymentResponse, Application, ApplicationTimeline, PaymentHistoryResponse };