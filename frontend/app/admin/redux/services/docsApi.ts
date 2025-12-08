import { baseApi } from "./baseApi";
import type {
    ChangeDocumentStatusRequest,
    ChangeDocumentStatusResponse,
} from "@/app/admin/types/api";

export const docsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // CHANGE DOCUMENT STATUS
        changeDocumentStatus: builder.mutation<
            ChangeDocumentStatusResponse,
            ChangeDocumentStatusRequest
        >({
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