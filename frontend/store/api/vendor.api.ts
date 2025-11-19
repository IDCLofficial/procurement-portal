import { apiSlice } from './';
import endpoints from './endpoints.const';
import { CreateVendorRequest, LoginVendorRequest, LoginVendorResponse, User, VerifyVendorRequest } from './types';

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
    })
})

export const { 
    useCreateVendorMutation,
    useVerifyVendorMutation,
    useLoginVendorMutation,
    useGetProfileQuery,
} = vendorApi;