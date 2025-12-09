import { createSlice } from '@reduxjs/toolkit';
import { User } from '../api/types';
import { vendorApi } from '../api/vendor.api';
import { RootState } from '../store';

interface UserState {
  data: User | null;
}

const initialState: UserState = {
  data: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(vendorApi.endpoints.getProfile.matchFulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addMatcher(vendorApi.endpoints.loginVendor.matchFulfilled, (state, action) => {
        if ('data' in action.payload && action.payload.data) {
          state.data = action.payload.data.user;
        }
      });
  },
});

// Selectors
export const selectUserData = (state: RootState) => state.user.data;

export default userSlice.reducer;
