import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Certificate } from "@/app/admin/types";

type RootStateForAuth = {
    auth: {
        user: {
            token?: string;
        } | null;
    };
};

export const certificateApi = createApi({
    reducerPath: "certificateApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootStateForAuth;
            const token = state.auth.user?.token;

            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),

    tagTypes: ["Certificates"],

    // GET CERTIFICATES
    endpoints: (builder) => ({
        getCertificates: builder.query<
            any,
            {
                status?: string;
                page?: number;
                limit?: number;
                search?: string;
                grade?: string;
                lga?: string;
            }
        >({
            query: ({ status, page, limit, search, grade, lga } = {}) => {
                const params = new URLSearchParams();
                if (status) params.append("status", status);
                if (page !== undefined) params.append("page", page.toString());
                if (limit !== undefined) params.append("limit", limit.toString());
                if (search) params.append("search", search);
                if (grade) params.append("grade", grade);
                if (lga) params.append("lga", lga);

                const queryString = params.toString();
                return `/certificates${queryString ? `?${queryString}` : ""}`;
            },
          
            providesTags: ["Certificates"],
        }),
        getCertificateById: builder.query<Certificate, string>({
            query: (id) => `/certificates/${id}`,
            providesTags: ["Certificates"],
        }),
    }),
});

export const { useGetCertificatesQuery, useGetCertificateByIdQuery } = certificateApi;