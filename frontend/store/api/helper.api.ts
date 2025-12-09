import { apiSlice } from "./";
import endpoints from "./endpoints.const";
import { DocumentRequirement, CategoriesResponse } from "./types.d";

export const helperApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDocumentsPresets: builder.query<DocumentRequirement[], void>({
            query: () => ({
                url: endpoints.getDocumentsPresets,
                method: 'GET',
            }),
        }),
        getCategories: builder.query<CategoriesResponse, void>({
            query: () => ({
                url: endpoints.getCategories,
                method: 'GET',
            }),
        }),
    })
})

export const { 
    useGetDocumentsPresetsQuery,
    useGetCategoriesQuery 
} = helperApi;