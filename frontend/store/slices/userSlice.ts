import { createSlice } from '@reduxjs/toolkit';
import { User } from '../api/types';
import { vendorApi } from '../api/vendor.api';
import { RootState } from '../store';
import { VendorSteps } from '../api/enum';

interface UserState {
  data: User | null;
}

const initialState: UserState = {
  data: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(vendorApi.endpoints.getProfile.matchFulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addMatcher(vendorApi.endpoints.loginVendor.matchFulfilled, (state, action) => {
        if ('data' in action.payload && action.payload.data) {
          state.data = action.payload.data.user;
        }
      })
      .addMatcher(vendorApi.endpoints.verifyPayment.matchFulfilled, (state) => {
        if (state.data) {
          state.data.companyForm = VendorSteps.COMPLETE;
        }
      })
      .addMatcher(vendorApi.endpoints.restartApplicationRegistration.matchFulfilled, (state) => {
        if (state.data) {
          state.data.companyForm = VendorSteps.COMPANY;
        }
      })
      .addMatcher(vendorApi.endpoints.updateVendorProfile.matchFulfilled, (state, action) => {
        if (state.data) {
          state.data = action.payload;
        }
      })
  },
});

// Selectors
export const selectUserData = (state: RootState) => state.user.data;

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
