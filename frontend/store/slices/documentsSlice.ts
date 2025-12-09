import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { DocumentRequirement } from '../api/types.d';
import { helperApi } from '../api/helper.api';

interface DocumentsState {
    presets: DocumentRequirement[] | null;
    isLoading: boolean;
}

const initialState: DocumentsState = {
    presets: null,
    isLoading: false,
};

const documentsSlice = createSlice({
    name: 'documents',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(helperApi.endpoints.getDocumentsPresets.matchFulfilled, (state, action) => {
                state.presets = action.payload;
                state.isLoading = false;
            })
            .addMatcher(helperApi.endpoints.getDocumentsPresets.matchPending, (state) => {
                state.isLoading = true;
            })
            .addMatcher(helperApi.endpoints.getDocumentsPresets.matchRejected, (state) => {
                state.isLoading = false;
            });
    },
});

export const selectDocumentsPresets = (state: RootState) => state.documents.presets;
export const selectDocumentsLoading = (state: RootState) => state.documents.isLoading;

export default documentsSlice.reducer;
