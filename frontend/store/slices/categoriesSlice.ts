import { createSlice } from '@reduxjs/toolkit';
import { CategoriesResponse } from '../api/types.d';
import { helperApi } from '../api/helper.api';
import { RootState } from '../store';

interface CategoriesState {
  data: CategoriesResponse | null;
  isLoading: boolean;
}

const initialState: CategoriesState = {
  data: null,
  isLoading: false,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(helperApi.endpoints.getCategories.matchFulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addMatcher(helperApi.endpoints.getCategories.matchPending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(helperApi.endpoints.getCategories.matchRejected, (state) => {
        state.isLoading = false;
      });
  },
});

// Selectors
export const selectCategoriesData = (state: RootState) => state.categories.data;
export const selectCategoriesLoading = (state: RootState) => state.categories.isLoading;
export default categoriesSlice.reducer;
