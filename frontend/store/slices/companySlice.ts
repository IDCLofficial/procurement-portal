import { createSlice } from '@reduxjs/toolkit';
import { CompanyDetailsResponse } from '../api/types';
import { vendorApi } from '../api/vendor.api';
import { RootState } from '../store';

interface CompanyState {
  data: CompanyDetailsResponse | null;
  isLoading: boolean;
}

const initialState: CompanyState = {
  data: null,
  isLoading: false,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    clearCompany: (state) => {
      state.data = null;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(vendorApi.endpoints.getCompanyDetails.matchFulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addMatcher(vendorApi.endpoints.completeVendorRegistration.matchFulfilled, (state, action) => {
        const result = action.payload.result;
        if (result && typeof (result.directors) === "object") {
          state.data!.directors = result.directors;
        }
        if (result && typeof (result.categories) === "object") {
          state.data!.category = result.categories;
        }
        if (result && typeof (result.grade) === "string") {
          state.data!.grade = result.grade;
        }
        if (result && typeof (result.bankName) === "string") {
          state.data!.bankName = result.bankName;
        }
        if (result && typeof (result.accountNumber) === "number") {
          state.data!.accountNumber = result.accountNumber;
        }
        if (result && typeof (result.accountName) === "string") {
          state.data!.accountName = result.accountName;
        }
        if (result && typeof result.documents === "object") {
          state.data!.documents = result.documents.map(doc => ({
            _id: doc.id,
            vendor: '',
            fileUrl: doc.fileUrl,
            validFrom: doc.validFrom,
            validTo: doc.validTo,
            documentType: doc.documentType,
            uploadedDate: doc.uploadedDate,
            fileName: doc.fileName,
            fileSize: doc.fileSize,
            fileType: doc.fileType,
            validFor: doc.validFor,
            hasValidityPeriod: doc.hasValidityPeriod,
            status: {
              status: "pending" as const,
              message: undefined
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0
          }));
        }
        if (result && typeof (result.companyName) === "string") {
          state.data!.companyName = result.companyName;
        }
        if (result && typeof (result.cacNumber) === "string") {
          state.data!.cacNumber = result.cacNumber;
        }
        if (result && typeof (result.tin) === "string") {
          state.data!.tin = result.tin;
        }
        if (result && typeof (result.address) === "string") {
          state.data!.address = result.address;
        }
        if (result && typeof (result.lga) === "string") {
          state.data!.lga = result.lga;
        }
        if (result && typeof (result.website) === "string") {
          state.data!.website = result.website;
        }
      })
      .addMatcher(vendorApi.endpoints.getCompanyDetails.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(vendorApi.endpoints.getCompanyDetails.matchRejected, (state) => {
        state.isLoading = false;
      })
  },
});

// Selectors
export const selectCompanyData = (state: RootState) => state.company.data;
export const selectCompanyLoading = (state: RootState) => state.company.isLoading;

export const { clearCompany } = companySlice.actions;
export default companySlice.reducer;
