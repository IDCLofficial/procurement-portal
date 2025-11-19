import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// Base API slice
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { endpoint }) => {
            const token = localStorage.getItem('token');
            // Add ngrok header for external API calls
            const skipAuthEndpoints = ["createVendor", "verifyVendor", "loginVendor"]
            // headers.set('ngrok-skip-browser-warning', 'true')
            if (!skipAuthEndpoints.includes(endpoint)) {
                if (!token) {
                    throw new Error('No authentication token found')
                }
                headers.set('Authorization', `Bearer ${token}`)
            }
            console.log(headers)
            return headers
        },
    }),
    tagTypes: ['vendor'],
    endpoints: () => ({}),
});