import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export const docsApi = createApi({
    reducerPath: "docsApi",
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

    tagTypes: ["Documents"],

   
    endpoints: (builder) => ({
    //   change document status
    changeDocumentStatus: builder.mutation<any, { documentId: string; documentStatus: string; message?: string }>({
        query: ({ documentId, documentStatus, message }) => {
            const body: { status: { status: string; message?: string } } = {
                status: { status: documentStatus },
            };

            if (message) {
                body.status.message = message;
            }

            return {
                url: `/documents/status/${documentId}`,
                method: "PATCH",
                body,
            };
        },
        invalidatesTags: ["Documents"],
    }),
    }),
});

export const { useChangeDocumentStatusMutation } = docsApi;