import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SlaConfig } from '@/app/admin/types/setting';

interface SlaConfigState {
  config: SlaConfig | null;
}

const initialState: SlaConfigState = {
  config: null,
};

const slaConfigSlice = createSlice({
  name: 'slaConfig',
  initialState,
  reducers: {
    setSlaConfig(state, action: PayloadAction<SlaConfig | null>) {
      state.config = action.payload;
    },
    clearSlaConfig(state) {
      state.config = null;
    },
  },
});

export const { setSlaConfig, clearSlaConfig } = slaConfigSlice.actions;
export default slaConfigSlice.reducer;
