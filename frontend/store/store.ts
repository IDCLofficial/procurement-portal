import { combineReducers, configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import companyReducer from './slices/companySlice';
import documentsReducer from './slices/documentsSlice';
import categoriesReducer from './slices/categoriesSlice';
import applicationReducer from './slices/applicationSlice';
import publicReducer from './slices/publicSlice';
import { apiSlice } from './api';

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  app: appReducer,
  auth: authReducer,
  user: userReducer,
  company: companyReducer,
  documents: documentsReducer,
  categories: categoriesReducer,
  application: applicationReducer,
  public: publicReducer,
  // Add more slices here as needed
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [apiSlice.util.resetApiState.type],
      },
    }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
