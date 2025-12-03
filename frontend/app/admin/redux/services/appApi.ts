import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Application } from "@/app/admin/types";
import type { RootState } from "../store";
import { mapApiApplicationToApplication } from "@/app/admin/utils/applicationMapper";

export const appApi = createApi({
    reducerPath: "appApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        credentials: "include",
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootState;
            const token = state.auth.user?.token;

            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),

    tagTypes: ["Applications"],

    // GET APPLICATIONS
    endpoints: (builder) => ({
        getApplications: builder.query<any, { status?: string; type?: string; page?: number; limit?: number }>({
            query: ({ status, type, page, limit } = {}) => {
                const params = new URLSearchParams();
                if (status) params.append('status', status);
                if (type) params.append('type', type);
                if (page !== undefined) params.append('page', page.toString());
                if (limit !== undefined) params.append('limit', limit.toString());

                const queryString = params.toString();
                return `/applications${queryString ? `?${queryString}` : ''}`;
            },
            transformResponse: (response: any) => {
                console.log('getApplications response here: ', response);
                const mappedApplications: Application[] = (response.applications ?? []).map(mapApiApplicationToApplication);
                return {
                    total: response.total,
                    page: response.page,
                    limit: response.limit,
                    totalPages: response.totalPages,
                    applications: mappedApplications,
                };
            },
            providesTags: ["Applications"],
        }),

        getApplicationById: builder.query<Application, string>({
            query: (id) => `/applications/${id}`,
            transformResponse: (app: any) => mapApiApplicationToApplication(app),
            providesTags: ["Applications"],
        }),

// ASSIGN APPLICATION TO USER
        assignApplication: builder.mutation<any, { applicationId: string; userId: string; userName: string }>({
            query: ({ applicationId, userId, userName }) => ({
                url: `/applications/assign/${applicationId}`,
                method: "PATCH",
                body: { userId, userName },
            }),
            invalidatesTags: ["Applications"],
        }),
        // get applications assigned to a particular user
        getApplicationsByUser: builder.query<any, string>({
            query: () => `/applications/my-assignments`,
            transformResponse: (response: any) => {
                console.log('getApplicationsByUser response', response);
                const mappedApplications: Application[] = (response.applications ?? []).map(mapApiApplicationToApplication);
                return {
                    total: response.total,
                    page: response.page,
                    limit: response.limit,
                    totalPages: response.totalPages,
                    applications: mappedApplications,
                };
            },
            providesTags: ["Applications"],
        }),
        // change application status
        changeApplicationStatus: builder.mutation<any, { applicationId: string; applicationStatus: string }>({
            query: ({ applicationId, applicationStatus }) => ({
                url: `/applications/status/${applicationId}`,
                method: "PATCH",
                body: { applicationStatus },
            }),
            invalidatesTags: ["Applications"],
        }),
    }),
});

export const { 
    useGetApplicationsQuery, 
    useGetApplicationByIdQuery, 
    useAssignApplicationMutation, 
    useGetApplicationsByUserQuery, 
    useChangeApplicationStatusMutation 
} = appApi;