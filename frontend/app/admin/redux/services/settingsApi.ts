import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import type { Category } from "../../types/setting";


export const SettingsApi = createApi({
    reducerPath: "settingsApi",
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

    tagTypes: ["Settings", "Categories"],

    endpoints: (builder) => ({
        // get all categories
        getCategories: builder.query<Category[], void>({
            query: () => "/categories",
            providesTags: ["Categories"],
        }),
        // add category
        addCategory: builder.mutation<Category, Category>({
            query: (body) => ({
                url: "/categories",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Categories"],
        }),
        
    }),
});

export const { useGetCategoriesQuery, useAddCategoryMutation } = SettingsApi;
