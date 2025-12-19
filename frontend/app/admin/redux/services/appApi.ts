import { baseApi } from "./baseApi";
import type { Application } from "@/app/admin/types";
import { mapApiApplicationToApplication, type ApiApplication } from "@/app/admin/utils/applicationMapper";
import type {
    ApplicationsQueryParams,
    ApplicationsResponse,
    AssignApplicationRequest,
    ChangeApplicationStatusRequest,
} from "@/app/admin/types/api";

export const appApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET APPLICATIONS
        getApplications: builder.query<ApplicationsResponse, ApplicationsQueryParams>({
            query: ({ status, type, page, limit } = {}) => {
                const params = new URLSearchParams();
                if (status) params.append("status", status);
                if (type) params.append("type", type);
                if (page !== undefined) params.append("page", page.toString());
                if (limit !== undefined) params.append("limit", limit.toString());

                const queryString = params.toString();
                return `/applications${queryString ? `?${queryString}` : ""}`;
            },
            transformResponse: (response: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
                applications: unknown[];
            }): ApplicationsResponse => {
                const mappedApplications: Application[] = (response.applications ?? []).map(
                    (app) => mapApiApplicationToApplication(app as ApiApplication)
                );
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

        // GET APPLICATION BY ID
        getApplicationById: builder.query<Application, string>({
            query: (id) => `/applications/${id}`,
            transformResponse: (app: unknown) => mapApiApplicationToApplication(app as ApiApplication),
            providesTags: ["Applications"],
        }),

        // ASSIGN APPLICATION TO USER
        assignApplication: builder.mutation<Application, AssignApplicationRequest>({
            query: ({ applicationId, userId, userName }) => ({
                url: `/applications/assign/${applicationId}`,
                method: "PATCH",
                body: { userId, userName },
            }),
            invalidatesTags: ["Applications"],
        }),

        // GET APPLICATIONS ASSIGNED TO CURRENT USER
        getApplicationsByUser: builder.query<ApplicationsResponse, void>({
            query: () => `/applications/my-assignments`,
            transformResponse: (response: {
                total: number;
                page: number;
                limit: number;
                totalPages: number;
                applications: unknown[];
            }): ApplicationsResponse => {
                const mappedApplications: Application[] = (response.applications ?? []).map(
                    (app) => mapApiApplicationToApplication(app as ApiApplication)
                );
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

        // CHANGE APPLICATION STATUS
        changeApplicationStatus: builder.mutation<Application, ChangeApplicationStatusRequest>({
            query: ({ applicationId, applicationStatus, notes }) => ({
                url: `/applications/status/${applicationId}`,
                method: "PATCH",
                body: {
                    applicationStatus,
                    ...(notes ? { notes } : {}),
                },
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