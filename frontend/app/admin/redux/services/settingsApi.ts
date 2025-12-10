import { baseApi } from "./baseApi";
import type { CategoriesResponse } from "../../types/setting";
import type { CreateCategoryRequest, CreateCategoryResponse, CreateGradeRequest, CreateGradeResponse } from "@/app/admin/types/api";

export const settingsApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        // GET ALL CATEGORIES
        getCategories: builder.query<CategoriesResponse, void>({
            query: () => "/categories",
            providesTags: ["Categories", "Grades"],
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
        // EDIT CATEGORY
        editCategory: builder.mutation<CreateCategoryResponse, { id: string; data: CreateCategoryRequest}>({
            query: ({ id, data }) => ({
                url: `/categories/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Categories"],
        }),
        // CREATE A NEW GRADE
        createGrade: builder.mutation<CreateGradeResponse, CreateGradeRequest>({
            query: (body) => ({
                url: "/categories/grades",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Categories", "Grades"],
        }),
    //   EDIT GRADE
     editGrade: builder.mutation<CreateGradeResponse, { id: string; data: CreateGradeRequest}>({
            query: ({ id, data }) => ({
                url: `/categories/grades/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Categories", "Grades"],
        }),

    }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
  useCreateGradeMutation,
  useEditGradeMutation,
} = settingsApi;
