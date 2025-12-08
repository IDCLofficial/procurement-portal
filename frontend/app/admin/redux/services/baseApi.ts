import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a base query with auth header injection
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const state = getState() as any;
        const token = state.auth?.user?.token;

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }

        return headers;
    },
});

// Create a single API instance that all services will inject into
export const baseApi = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: [
        "Users",
        "Applications",
        "Certificates",
        "Documents",
        "Settings",
        "Categories",
    ],
    endpoints: () => ({}),
});
