import { apiSlice } from './';
import endpoints from './endpoints.const';
import { CompleteVendorRegistrationRequest, CreateVendorRequest, LoginVendorRequest, LoginVendorResponse, ResendVerificationOtpRequest, User, VerifyVendorRequest } from './types';

export const vendorApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createVendor: builder.mutation<unknown, CreateVendorRequest>({
            query: (body) => ({
                url: endpoints.createVendor,
                method: 'POST',
                body,
            }),
        }),
        verifyVendor: builder.mutation<unknown, VerifyVendorRequest>({
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
        completeVendorRegistration: builder.mutation<unknown, CompleteVendorRegistrationRequest>({
            query: (body) => ({
                url: endpoints.complete_vendor_registration,
                method: 'PATCH',
                body,
            }),
        }),
    })
})

export const { 
    useCreateVendorMutation,
    useVerifyVendorMutation,
    useLoginVendorMutation,
    useResendVerificationOtpMutation,
    useGetProfileQuery,
} = vendorApi;