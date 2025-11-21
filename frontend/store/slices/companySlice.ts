import { createSlice } from '@reduxjs/toolkit';
import { CompanyDetailsResponse } from '../api/types';
import { vendorApi } from '../api/vendor.api';
import { RootState } from '../store';

interface CompanyState {
  data: CompanyDetailsResponse | null;
}

const initialState: CompanyState = {
  data: null,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(vendorApi.endpoints.getCompanyDetails.matchFulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addMatcher(vendorApi.endpoints.completeVendorRegistration.matchFulfilled, (state, action) => {
        const result = action.payload.result;
        if (result) {
          state.data = {
            userId: result.userId,
            companyName: result.companyName,
            cacNumber: result.cacNumber,
            tin: result.tin,
            address: result.address,
            lga: result.lga,
            grade: result.grade,
            website: result.website,
            _id: result._id,
            categories: result.categories,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            __v: result.__v,
          };
        }
      });
  },
});

// Selectors
export const selectCompanyData = (state: RootState) => state.company.data;

export default companySlice.reducer;
