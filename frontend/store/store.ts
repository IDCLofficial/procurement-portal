import { combineReducers, configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import companyReducer from './slices/companySlice';
import { vendorApi } from './api/vendor.api';

const rootReducer = combineReducers({
  [vendorApi.reducerPath]: vendorApi.reducer,
  app: appReducer,
  auth: authReducer,
  user: userReducer,
  company: companyReducer,
  // Add more slices here as needed
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [vendorApi.util.resetApiState.type],
      },
    }).concat(vendorApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
