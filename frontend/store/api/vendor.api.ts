import { apiSlice } from './';
import endpoints from './endpoints.const';
import { ActivityLogResponse, Application, ApplicationTimeline, CompanyDetailsResponse, CompleteVendorRegistrationRequest, CreateVendorRequest, InitPaymentRequest, InitPaymentResponse, LoginVendorRequest, LoginVendorResponse, PaymentHistoryResponse, RegisterCompanyResponse, ResendVerificationOtpRequest, User, VerifyVendorRequest } from './types';

export const vendorApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createVendor: builder.mutation<unknown, CreateVendorRequest>({
            query: (body) => ({
                url: endpoints.createVendor,
                method: 'POST',
                body,
            }),
        }),
        verifyVendor: builder.mutation<{ token: string }, VerifyVendorRequest>({
            query: (body) => ({
                url: endpoints.verifyVendor,
                method: 'POST',
                body,
            }),
        }),
        resendVerificationOtp: builder.mutation<unknown, ResendVerificationOtpRequest>({
            query: (body) => ({
                url: endpoints.resendVerificationCode,
                method: 'POST',
                body,
            }),
        }),
        loginVendor: builder.mutation<LoginVendorResponse, LoginVendorRequest>({
            query: (body) => ({
                url: endpoints.loginVendor,
                method: 'POST',
                body,
            }),
        }),
        getProfile: builder.query<User, void>({
            query: () => ({
                url: endpoints.getProfile,
                method: 'GET',
            }),
        }),
        getCompanyDetails: builder.query<CompanyDetailsResponse, void>({
            query: () => ({
                url: endpoints.getCompanyDetails,
                method: 'GET',
            }),
        }),
        completeVendorRegistration: builder.mutation<RegisterCompanyResponse, CompleteVendorRegistrationRequest>({
            query: (body) => ({
                url: endpoints.complete_vendor_registration,
                method: 'PATCH',
                body,
            }),
        }),
        initPayment: builder.mutation<InitPaymentResponse, InitPaymentRequest>({
            query: (body) => ({
                url: endpoints.initPayment,
                method: 'POST',
                body,
            }),
        }),
        verifyPayment: builder.query<unknown, string>({
            query: (reference: string) => ({
                url: endpoints.verifyPayment(reference),
                method: 'GET',
            }),
        }),
        getApplication: builder.query<Application, void>({
            query: () => ({
                url: endpoints.getApplication,
                method: 'GET',
            }),
        }),
        getApplicationTimeline: builder.query<ApplicationTimeline, void>({
            query: () => ({
                url: endpoints.vendorApplicationTimeline,
                method: 'GET',
            }),
        }),
        getPaymentHistory: builder.query<PaymentHistoryResponse, { page?: number; limit?: number; search?: string, year?: string, type?: string } | void>({
            query: (params) => ({
                url: endpoints.myPaymentsHistory,
                method: 'GET',
                params: params ? { page: params.page || 1, limit: params.limit || 10, search: params.search || '', year: params.year || '', type: params.type || '' } : { page: 1, limit: 10 },
            }),
        }),
        getMyActivityLogs: builder.query<ActivityLogResponse[], void>({
            query: () => ({
                url: endpoints.myActivityLogs,
                method: 'GET',
            }),
        }),
    })
})

export const { 
    useCreateVendorMutation,
    useVerifyVendorMutation,
    useLoginVendorMutation,
    useResendVerificationOtpMutation,
    useCompleteVendorRegistrationMutation,
    useGetProfileQuery,
    useGetCompanyDetailsQuery,
    useInitPaymentMutation,
    useVerifyPaymentQuery,
    useGetApplicationQuery,
    useGetApplicationTimelineQuery,
    useGetPaymentHistoryQuery,
    useGetMyActivityLogsQuery,
} = vendorApi;