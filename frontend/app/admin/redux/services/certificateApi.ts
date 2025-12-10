import { baseApi } from "./baseApi";
import type { Certificate } from "@/app/admin/types";
import type { CertificatesQueryParams, CertificatesResponse } from "@/app/admin/types/api";

export const certificateApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET CERTIFICATES
        getCertificates: builder.query<CertificatesResponse, CertificatesQueryParams>({
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

        // GET CERTIFICATE BY ID
        getCertificateById: builder.query<Certificate, string>({
            query: (id) => `/certificates/${id}`,
            providesTags: ["Certificates"],
        }),
    }),
});

export const { useGetCertificatesQuery, useGetCertificateByIdQuery } = certificateApi;