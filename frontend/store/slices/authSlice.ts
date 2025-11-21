import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { vendorApi } from '../api/vendor.api';
import { RootState } from '../store';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
}

const initialState: AuthState = {
  token: null,
  isLoading: false,
  isAuthenticated: false,
  isLoggingOut: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
    login: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.isLoggingOut = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLoggingOut: (state, action: PayloadAction<boolean>) => {
      state.isLoggingOut = action.payload;
    },
    refresh: (state) => {
      // Perhaps set loading for refresh
      state.isLoading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(vendorApi.endpoints.loginVendor.matchFulfilled, (state, action) => {
        console.log(action.payload)
        if ('data' in action.payload && action.payload.data) {
          state.token = action.payload.data.token;
          state.isAuthenticated = true;
          state.isLoading = false;
        }
      })
      .addMatcher(vendorApi.endpoints.getProfile.matchFulfilled, (state) => {
        state.isLoading = false;
      })
      .addMatcher(vendorApi.endpoints.loginVendor.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(vendorApi.endpoints.loginVendor.matchRejected, (state) => {
        state.isLoading = false;
      })
      .addMatcher(vendorApi.endpoints.getProfile.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(vendorApi.endpoints.getProfile.matchRejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearToken, login, logout, setLoading, setLoggingOut, refresh } = authSlice.actions;

// Selectors
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthIsLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthIsLoggingOut = (state: RootState) => state.auth.isLoggingOut;

export default authSlice.reducer;
