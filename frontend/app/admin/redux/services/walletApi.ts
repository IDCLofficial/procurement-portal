import { baseApi } from "./baseApi";
import type { WalletSummary, RecentTransactionsResponse, MdaTransactionsResponse, IirsTransactionsResponse, CreateCashoutRequest } from "@/app/admin/types/wallet";

export const walletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWalletSummary: builder.query<WalletSummary, string>({
      query: (userId) => `/wallet/summary?userId=${userId}`,
      providesTags: ["Wallet"],
    }),
    getRecentTransactions: builder.query<RecentTransactionsResponse, string>({
      query: (userId) => `/wallet/recent-transactions?userId=${userId}`,
      providesTags: ["Wallet"],
    }),
    getMdaTransactions: builder.query<MdaTransactionsResponse, string>({
      query: (userId) => `/wallet/my-mda-transactions?userId=${userId}`,
      providesTags: ["Wallet"],
    }),
    getIirsTransactions: builder.query<IirsTransactionsResponse, string>({
      query: (userId) => `/wallet/iirs-transactions?userId=${userId}`,
      providesTags: ["Wallet"],
    }),
    completeCashout: builder.mutation<any, CreateCashoutRequest>({
      query: (body) => ({
        url: `/wallet/cashout/complete`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Wallet"],
    }),
  }),
});

export const {
  useGetWalletSummaryQuery,
  useGetRecentTransactionsQuery,
  useGetMdaTransactionsQuery,
  useGetIirsTransactionsQuery,
  useCompleteCashoutMutation,
} = walletApi;