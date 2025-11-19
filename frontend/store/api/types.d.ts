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


export { CreateVendorRequest, VerifyVendorRequest, LoginVendorRequest, LoginVendorResponse, ResponseSuccess, User };