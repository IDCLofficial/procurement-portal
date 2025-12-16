import { baseApi } from "./baseApi";
import type { CategoriesResponse, Grade, SlaConfig } from "../../types/setting";
import type {
  CreateCategoryRequest,
  CreateCategoryResponse,
  CreateGradeRequest,
  CreateGradeResponse,
  DocumentsResponse,
  CreateDocumentPresetRequest,
  CreateDocumentPresetResponse,
  UpdateDocumentPresetRequest,
  UpdateDocumentPresetResponse,
  DeleteDocumentPresetResponse,
  MdasResponse,
  MdasQueryParams,
  CreateMdaRequest,
  CreateMdaResponse,
  UpdateMdaRequest,
  UpdateMdaResponse,
  DeleteMdaResponse,
} from "@/app/admin/types/api";

export const settingsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // GET ALL CATEGORIES
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => "/categories",
      providesTags: ["Categories", "Grades"],
    }),

    // GET ALL SLA CONFIGURATION
    getSlaConfig: builder.query<SlaConfig, void>({
      query: () => "/sla",
      transformResponse: (response: SlaConfig) => {
        console.log("SLA config API response:", response);
        return response;
      },
      providesTags: ["Settings"],
    }),

    // UPDATE SLA CONFIGURATION
    updateSlaConfig: builder.mutation<SlaConfig, Partial<SlaConfig>>({
      query: (body) => ({
        url: "/sla",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),

    // GET ALL GRADES
    getGrades: builder.query<Grade[], void>({
      query: () => "/categories/grades",
      transformResponse: (response: Grade[]) => {
        console.log("Grades API response:", response);
        return response;
      },
      providesTags: ["Grades"],
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
    editCategory: builder.mutation<CreateCategoryResponse, { id: string; data: CreateCategoryRequest }>({
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
    // EDIT GRADE
    editGrade: builder.mutation<CreateGradeResponse, { id: string; data: CreateGradeRequest }>({
      query: ({ id, data }) => ({
        url: `/categories/grades/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Categories", "Grades"],
    }),
    // DELETE GRADE
    deleteGrade: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/grades/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories", "Grades"],
    }),
    // GET DOCUMENT PRESETS
    getDocumentPresets: builder.query<DocumentsResponse, void>({
      query: () => "/documents/presets",
      providesTags: ["Documents"],
    }),
    // CREATE DOCUMENT PRESET
    createDocumentPresets: builder.mutation<
      CreateDocumentPresetResponse,
      CreateDocumentPresetRequest
    >({
      query: (body) => ({
        url: "/documents/set-preset",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Documents"],
    }),
    // UPDATE DOCUMENT PRESET
    updateDocumentPreset: builder.mutation<
      UpdateDocumentPresetResponse,
      { id: string; data: UpdateDocumentPresetRequest }
    >({
      query: ({ id, data }) => ({
        url: `/documents/presets/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Documents"],
    }),
    // DELETE DOCUMENT PRESET
    deleteDocumentPreset: builder.mutation<
      DeleteDocumentPresetResponse,
      string
    >({
      query: (id) => ({
        url: `/documents/presets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Documents"],
    }),
    // GET MDAS
    getMdas: builder.query<MdasResponse, MdasQueryParams>({
      query: ({ page, limit }) => ({
        url: "/mda",
        params: { page, limit },
      }),
      transformResponse: (response: MdasResponse) => {
        console.log("MDAs API response:", response);
        return response;
      },
      providesTags: ["Settings"],
    }),
    createMda: builder.mutation<CreateMdaResponse, CreateMdaRequest>({
      query: (body) => ({
        url: "/mda",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    updateMda: builder.mutation<UpdateMdaResponse, { id: string; data: UpdateMdaRequest }>({
      query: ({ id, data }) => ({
        url: `/mda/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    deleteMda: builder.mutation<DeleteMdaResponse, string>({
      query: (id) => ({
        url: `/mda/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetSlaConfigQuery,
  useGetGradesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
  useCreateGradeMutation,
  useEditGradeMutation,
  useDeleteGradeMutation,
  useGetDocumentPresetsQuery,
  useCreateDocumentPresetsMutation,
  useUpdateDocumentPresetMutation,
  useDeleteDocumentPresetMutation,
  useGetMdasQuery,
  useCreateMdaMutation,
  useUpdateMdaMutation,
  useDeleteMdaMutation,
  useUpdateSlaConfigMutation,
} = settingsApi;
