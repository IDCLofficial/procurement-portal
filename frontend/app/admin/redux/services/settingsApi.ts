import { baseApi } from "./baseApi";
import type { CategoriesResponse } from "../../types/setting";
import type { CreateCategoryRequest, CreateCategoryResponse } from "@/app/admin/types/api";

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET ALL CATEGORIES
        getCategories: builder.query<CategoriesResponse, void>({
            query: () => "/categories",
            providesTags: ["Categories"],
        }),

        // CREATE A NEW CATEGORY
        createCategory: builder.mutation<CreateCategoryResponse, CreateCategoryRequest>({
            query: (body) => ({
                url: "/categories",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Categories"],
        }),
        // DELETE CATEGORY
        deleteCategory: builder.mutation<void, string>({
            query: (id) => ({
                url: `/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Categories"],
        }),
    }),
});

export const { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } = settingsApi;
