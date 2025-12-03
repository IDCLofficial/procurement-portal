import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export const adminApi = createApi({
  reducerPath: "adminApi",
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
  tagTypes: ["Users"],

  endpoints: (builder) => ({
    // GET ALL USERS
    getUsers: builder.query<any, void>({
      query: () => "/users/usersByName",
      providesTags: ["Users"],
    }),

    // CREATE USER
    createUser: builder.mutation<
      any,
      { fullName: string; email: string; password: string; role: string; phoneNo: string }
    >({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      onQueryStarted: async (arg, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          console.log(`User created successfully:`, data);
        } catch (error) {
          console.error('Error creating user:', error);
        }
      },
      invalidatesTags: ["Users"],
    }),

   
  
    // Login
    login: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
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

    // DELETE USER
   deleteUser: builder.mutation<{ success: boolean; id: string }, string>({
  query: (userId) => ({
    url: `/users/${userId}`,
    method: 'DELETE',
  }),
  async onQueryStarted(userId, { queryFulfilled }) {
    try {
      const { data } = await queryFulfilled;
      console.log(`User ${data.id} deleted successfully:`, data.success);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  },
  invalidatesTags: ['Users'],
}),
  }),
});


// Export hooks for components
export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useLoginMutation
} = adminApi;
