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
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useLoginMutation,
} = adminApi;
