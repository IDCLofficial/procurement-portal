import { apiSlice } from ".";
import endpoints from "./endpoints.const";
import { ContractorsResponse } from "./types";

export const publicApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllContractors: builder.query<ContractorsResponse, {
            page?: number;
            limit?: number;
            search?: string;
            sector?: string;
            grade?: string;
            lga?: string;
            status?: string;
        }>({
            query: (params) => ({
                url: endpoints.getAllContractor,
                method: 'GET',
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    search: params.search?.toLowerCase() || undefined,
                    sector: params.sector?.toLowerCase() || undefined,
                    grade: params.grade?.toLowerCase() || undefined,
                    lga: params.lga?.toLowerCase() || undefined,
                    status: params.status?.toLowerCase() || undefined,
                },
            }),
        }),
    }),
});

export const {
    useGetAllContractorsQuery
} = publicApi;