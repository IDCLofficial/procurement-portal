import { createSlice } from '@reduxjs/toolkit';
import { vendorApi } from '../api/vendor.api';
import { RootState } from '../store';
import { Application } from '../api/types';

interface ApplicationState {
  data: Application | null;
  isLoading: boolean;
}

const initialState: ApplicationState = {
  data: null,
  isLoading: false,
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(vendorApi.endpoints.getApplication.matchFulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addMatcher(vendorApi.endpoints.getApplication.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(vendorApi.endpoints.getApplication.matchRejected, (state) => {
        state.isLoading = false;
      });
  },
});

// Selectors
export const selectApplicationData = (state: RootState) => state.application.data;
export const selectApplicationLoading = (state: RootState) => state.application.isLoading;
export default applicationSlice.reducer;
