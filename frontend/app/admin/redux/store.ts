import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import { baseApi } from './services/baseApi';
// Import injected endpoints to ensure they are registered
import './services/adminApi';
import './services/appApi';
import './services/certificateApi';
import './services/docsApi';
import './services/settingsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
