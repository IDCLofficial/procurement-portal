import { combineReducers, configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';

const rootReducer = combineReducers({
  app: appReducer,
  // Add more slices here as needed
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
