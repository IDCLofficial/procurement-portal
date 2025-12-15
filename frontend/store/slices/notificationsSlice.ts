import { createSlice } from "@reduxjs/toolkit";
import { NotificationResponse } from "../api/types";
import { vendorApi } from "../api/vendor.api";
import { RootState } from "../store";

interface NotificstionSlice {
    data: NotificationResponse | null,
    isLoading: boolean,
    error: string | null
}

const initialNotificationState: NotificstionSlice = {
    data: null,
    isLoading: false,
    error: null
}

const notificationSlice = createSlice({
    name: "notification-slice",
    initialState: initialNotificationState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addMatcher(vendorApi.endpoints.getMyNotifications.matchPending, (state) => {
                state.isLoading = true;
            })
            .addMatcher(vendorApi.endpoints.getMyNotifications.matchFulfilled, (state, action) => {
                state.data = action.payload;
                state.isLoading = false;
            })
            .addMatcher(vendorApi.endpoints.getMyNotifications.matchRejected, (state) => {
                state.isLoading = false;
                state.error = "Failed to load notifications";
            })
            .addMatcher(vendorApi.endpoints.markNotificationAsRead.matchPending, (state) => {
                state.isLoading = true;
            })
            .addMatcher(vendorApi.endpoints.markNotificationAsRead.matchFulfilled, (state) => {
                state.isLoading = false;
            })
            .addMatcher(vendorApi.endpoints.markNotificationAsRead.matchRejected, (state) => {
                state.isLoading = false;
            })
    }
})

export const selectNotificationData = (state: RootState) => state.notification.data;
export const selectNotificationError = (state: RootState) => state.notification.error;
export const selectNotificationLoading = (state: RootState) => state.notification.isLoading;

export default notificationSlice.reducer;