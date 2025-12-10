import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contractor } from '../api/types';

interface VerificationState {
  registrationId: string;
  isVerifying: boolean;
  verificationResult: Contractor | null;
  error: string | null;
}

const initialState: VerificationState = {
  registrationId: '',
  isVerifying: false,
  verificationResult: null,
  error: null,
};

const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    setRegistrationId: (state, action: PayloadAction<string>) => {
      state.registrationId = action.payload;
      // Clear result when ID changes
      if (state.verificationResult) {
        state.verificationResult = null;
      }
      if (state.error) {
        state.error = null;
      }
    },
    setVerifying: (state, action: PayloadAction<boolean>) => {
      state.isVerifying = action.payload;
    },
    setVerificationResult: (state, action: PayloadAction<Contractor>) => {
      state.verificationResult = action.payload;
      state.error = null;
    },
    setVerificationError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.verificationResult = null;
    },
    clearVerification: (state) => {
      state.registrationId = '';
      state.verificationResult = null;
      state.error = null;
      state.isVerifying = false;
    },
  },
});

export const {
  setRegistrationId,
  setVerifying,
  setVerificationResult,
  setVerificationError,
  clearVerification,
} = verificationSlice.actions;

export default verificationSlice.reducer;
