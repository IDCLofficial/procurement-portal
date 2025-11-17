import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL, // your backend or mock API URL
    credentials: "include",
  }),
  tagTypes: ["Users", "Roles"],

  endpoints: (builder) => ({
    // GET ALL USERS
    getUsers: builder.query<any, void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    // CREATE USER
    createUser: builder.mutation<
      any,
      { name: string; email: string; password: string; role: string }
    >({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    // GET ALL ROLES
    getRoles: builder.query<any, void>({
      query: () => "/roles",
      providesTags: ["Roles"],
    }),

    // CREATE ROLE
    createRole: builder.mutation<any, { name: string }>({
      query: (body) => ({
        url: "/roles",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Roles"],
    }),

    // UPDATE USER ROLE
    updateUserRole: builder.mutation<
      any,
      { userId: string; role: string }
    >({
      query: ({ userId, role }) => ({
        url: `/users/${userId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

// Export hooks for components
export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateUserRoleMutation,
} = adminApi;
