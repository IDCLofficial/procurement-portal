import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import { adminApi } from './services/adminApi';
import { appApi } from './services/appApi';
import { certificateApi } from './services/certificateApi';
import { docsApi } from './services/docsApi';
import { SettingsApi } from './services/settingsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [appApi.reducerPath]: appApi.reducer,
    [certificateApi.reducerPath]: certificateApi.reducer,
    [docsApi.reducerPath]: docsApi.reducer,
    [SettingsApi.reducerPath]: SettingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      adminApi.middleware,
      appApi.middleware,
      certificateApi.middleware,
      docsApi.middleware,
      SettingsApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
