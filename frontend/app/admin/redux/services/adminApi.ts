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

export type GetTransactionsParams = {
  page?: number;
  limit?: number;
  status?: string;
};

export interface AdminNotificationDto {
  _id: string;
  title: string;
  message: string;
  priority: string;
  createdAt: string;
  isRead: boolean;
}

export interface AdminNotificationsApiResponse {
  message: string;
  notifications: AdminNotificationDto[];
  totalNotifications: number;
  totalUnreadNotifications: number;
  totalCriticalNotifications: number;
  totalHighPriorityNotifications: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

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

    // GET USERS BASED ON MDA
    getUsersByMda: builder.query<User[], string | undefined>({
      query: (mda) => `/users/by-Mda?mda=${mda}`,
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
    getTransactions: builder.query<TransactionsApiResponse, GetTransactionsParams | void>({
      query: (params) => {
        if (!params) {
          return "/vendor-payments/all";
        }

        const cleanedParams = Object.fromEntries(
          Object.entries(params).filter(([, value]) =>
            value !== undefined && value !== null,
          ),
        );

        return {
          url: "/vendor-payments/all",
          params: cleanedParams,
        };
      },
      transformResponse: (response: TransactionsApiResponse) => {
        console.log("Transactions API response:", response);
        return response;
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

    // GET ADMIN NOTIFICATIONS
    getAdminNotifications: builder.query<AdminNotificationsApiResponse, { page?: number; limit?: number; isRead?: boolean }>({
      query: ({ page = 1, limit = 10, isRead } = {}) => ({
        url: "/notifications/admin-notification",
        params: { page, limit, ...(isRead !== undefined && { isRead }) }
      }),
      transformResponse: (response: AdminNotificationsApiResponse) => {
        console.log("Admin notifications API response:", response);
        return response;
      },
    }),

    // MARK ADMIN NOTIFICATION AS READ (BY ID)
    markAdminNotificationAsReadById: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: `/notifications/mark-one-admin-as-read/${notificationId}`,
        method: "PATCH",
        credentials: 'include',
      }),
    }),

    // MARK ALL ADMIN NOTIFICATION AS READ 
    markAllAdminNotificationAsRead: builder.mutation<void, string>({
      query: () => ({
        url: `/notifications/mark-all-admin-as-read`,
        method: "POST",
        credentials: 'include',
      }),
    }),
    // GET DESK OFFICER NOTIFICATIONS
    getDeskOfficerNotifications: builder.query<AdminNotificationsApiResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/notifications/desk-officer-notifications",
        params: { page, limit },
        credentials: 'include',
      }),
      transformResponse: (response: AdminNotificationsApiResponse) => {
        console.log("Desk officer notifications API response:", response);
        return response;
      },
    }),
    // GET REGISTRAR NOTIFICATIONS
      getRegistrarNotifications: builder.query<AdminNotificationsApiResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/notifications/registrar-notifications",
        params: { page, limit },
        credentials: 'include',
      }),
      transformResponse: (response: AdminNotificationsApiResponse) => {
        console.log(" getRegistrar notifications API response:", response);
        return response;
      },
    }),

  }),
});

export const {
  useGetUsersQuery,
  useGetUsersByMdaQuery,
  useCreateUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useLoginMutation,
  useGetAuditLogsQuery,
  useGetAdminNotificationsQuery,
  useGetTransactionsQuery,
  useMarkAdminNotificationAsReadByIdMutation,
  useMarkAllAdminNotificationAsReadMutation,
  useGetDeskOfficerNotificationsQuery,
  useGetRegistrarNotificationsQuery,
} = adminApi;
