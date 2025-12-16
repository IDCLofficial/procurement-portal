import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PublicState {
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  sectorFilter: string;
  gradeFilter: string;
  lgaFilter: string;
  statusFilter: string;
}

const initialState: PublicState = {
  currentPage: 1,
  itemsPerPage: 10,
  searchQuery: '',
  sectorFilter: '',
  gradeFilter: '',
  lgaFilter: '',
  statusFilter: '',
};

const publicSlice = createSlice({
  name: 'public',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page on search
    },
    setSectorFilter: (state, action: PayloadAction<string>) => {
      state.sectorFilter = action.payload;
      state.currentPage = 1; // Reset to first page on filter change
    },
    setGradeFilter: (state, action: PayloadAction<string>) => {
      state.gradeFilter = action.payload;
      state.currentPage = 1; // Reset to first page on filter change
    },
    setLgaFilter: (state, action: PayloadAction<string>) => {
      state.lgaFilter = action.payload;
      state.currentPage = 1; // Reset to first page on filter change
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1; // Reset to first page on filter change
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.sectorFilter = '';
      state.gradeFilter = '';
      state.lgaFilter = '';
      state.statusFilter = '';
      state.currentPage = 1;
    },
  },
});

export const {
  setCurrentPage,
  setItemsPerPage,
  setSearchQuery,
  setSectorFilter,
  setGradeFilter,
  setLgaFilter,
  setStatusFilter,
  resetFilters,
} = publicSlice.actions;

export default publicSlice.reducer;
