import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WalletState {
  selectedPeriod: 'today' | 'week' | 'month' | 'year';
  filters: {
    transactionType?: string;
    status?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

const initialState: WalletState = {
  selectedPeriod: 'month',
  filters: {},
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setSelectedPeriod: (state, action: PayloadAction<'today' | 'week' | 'month' | 'year'>) => {
      state.selectedPeriod = action.payload;
    },
    setFilters: (state, action: PayloadAction<WalletState['filters']>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
});

export const { setSelectedPeriod, setFilters, clearFilters } = walletSlice.actions;
export default walletSlice.reducer;
