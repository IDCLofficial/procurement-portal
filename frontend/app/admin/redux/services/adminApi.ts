import { baseApi } from "./baseApi";
import type { User } from "@/app/admin/types/user";
import type {
  LoginCredentials,
  LoginResponse,
  CreateUserRequest,
  CreateUserResponse,
  UpdateUserRoleRequest,
  DeleteUserResponse,
} from "@/app/admin/types/api";

type TransactionsApiResponse = {
  success: boolean;
  data: unknown[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type GetAuditLogsParams = {
  entityType?: string;
  entityId?: string;
  actor?: string;
  action?: string;
  severity?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  skip?: number;
};

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL USERS
    getUsers: builder.query<User[], void>({
      query: () => "/users/usersByName",
      providesTags: ["Users"],
    }),

    // CREATE USER
    createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // Login
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        body,
      }),
    }),

    // UPDATE USER ROLE
    updateUserRole: builder.mutation<User, UpdateUserRoleRequest>({
      query: ({ userId, role }) => ({
        url: `/users/${userId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),

    // DELETE USER
    deleteUser: builder.mutation<DeleteUserResponse, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    // GET ALL TRANSACTIONS
    getTransactions: builder.query<unknown[], void>({
      query: () => "/vendor-payments/all",
      transformResponse: (response: TransactionsApiResponse) => {
        console.log("Transactions API response:", response);
        return Array.isArray(response?.data) ? response.data : [];
      },
    }),

    // GET ALL AUDIT LOGS
    getAuditLogs: builder.query<unknown, GetAuditLogsParams | void>({
      query: (params) => {
        if (!params) {
          return "/audit-logs";
        }

        const cleanedParams = Object.fromEntries(
          Object.entries(params).filter(([, value]) =>
            value !== undefined && value !== null,
          ),
        );

        return {
          url: "/audit-logs",
          params: cleanedParams,
        };
      },
      transformResponse: (response: unknown) => {
        console.log("Audit logs API response:", response);
        return response;
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useLoginMutation,
  useGetTransactionsQuery,
  useGetAuditLogsQuery,
} = adminApi;
