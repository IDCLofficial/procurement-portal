import { apiSlice } from './';
import endpoints from './endpoints.const';
import { ActivityLogResponse, Application, ApplicationTimeline, CompanyDetailsResponse, CompleteVendorRegistrationRequest, CreateVendorRequest, InitPaymentRequest, InitPaymentResponse, LoginVendorRequest, LoginVendorResponse, PaymentHistoryResponse, RegisterCompanyResponse, ResendVerificationOtpRequest, User, VerifyVendorRequest, NotificationResponse, NotificationSettings, VendorSettingsResponse, LoginHistory } from './types';

export const vendorApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createVendor: builder.mutation<unknown, CreateVendorRequest>({
            query: (body) => ({
                url: endpoints.createVendor,
                method: 'POST',
                body,
            }),
        }),
        verifyVendor: builder.mutation<{ token: string }, VerifyVendorRequest>({
            query: (body) => ({
                url: endpoints.verifyVendor,
                method: 'POST',
                body,
            }),
        }),
        resendVerificationOtp: builder.mutation<unknown, ResendVerificationOtpRequest>({
            query: (body) => ({
                url: endpoints.resendVerificationCode,
                method: 'POST',
                body,
            }),
        }),
        changePassword: builder.mutation<unknown, { currentPassword: string, newPassword: string, confirmPassword: string }>({
            query: (body) => ({
                url: endpoints.changePassword,
                method: 'PATCH',
                body,
            }),
        }),
        loginVendor: builder.mutation<LoginVendorResponse, LoginVendorRequest>({
            query: (body) => ({
                url: endpoints.loginVendor,
                method: 'POST',
                body,
            }),
        }),
        logoutVendor: builder.mutation<void, void>({
            query: () => ({
                url: endpoints.logoutVendor,
                method: 'DELETE',
            }),
        }),
        forgotPassword: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({
                url: endpoints.forgotPassword,
                method: 'POST',
                body,
            }),
        }),
        resetPassword: builder.mutation<unknown, { newPassword: string, confirmPassword: string, token: string }>({
            query: (body) => ({
                url: `${endpoints.resetPassword}?token=${body.token}`,
                method: 'POST',
                body: {
                    newPassword: body.newPassword,
                    confirmPassword: body.confirmPassword,
                },
            }),
        }),
        getProfile: builder.query<User, void>({
            query: () => ({
                url: endpoints.getProfile,
                method: 'GET',
            }),
        }),
        updateVendorProfile: builder.mutation<User, {
            fullname?: string;
            phoneNo?: string;
        }>({
            query: (body) => ({
                url: endpoints.getProfile,
                method: 'PATCH',
                body,
            }),
        }),
        getCompanyDetails: builder.query<CompanyDetailsResponse, void>({
            query: () => ({
                url: endpoints.getCompanyDetails,
                method: 'GET',
            }),
        }),
        completeVendorRegistration: builder.mutation<RegisterCompanyResponse, CompleteVendorRegistrationRequest>({
            query: (body) => ({
                url: endpoints.complete_vendor_registration,
                method: 'PATCH',
                body,
            }),
        }),
        restartApplicationRegistration: builder.mutation<void, void>({
            query: () => ({
                url: endpoints.restartApplicationRegistration,
                method: 'PATCH',
            }),
        }),
        initPayment: builder.mutation<InitPaymentResponse, InitPaymentRequest>({
            query: (body) => ({
                url: endpoints.initPayment,
                method: 'POST',
                body,
            }),
        }),
        verifyPayment: builder.query<unknown, string>({
            query: (reference: string) => ({
                url: endpoints.verifyPayment(reference),
                method: 'GET',
            }),
        }),
        getApplication: builder.query<Application, void>({
            query: () => ({
                url: endpoints.getApplication,
                method: 'GET',
            }),
        }),
        getApplicationTimeline: builder.query<ApplicationTimeline, void>({
            query: () => ({
                url: endpoints.vendorApplicationTimeline,
                method: 'GET',
            }),
        }),
        getPaymentHistory: builder.query<PaymentHistoryResponse, { page?: number; limit?: number; search?: string, year?: string, type?: string } | void>({
            query: (params) => ({
                url: endpoints.myPaymentsHistory,
                method: 'GET',
                params: params ? { page: params.page || 1, limit: params.limit || 10, search: params.search || '', year: params.year || '', type: params.type || '' } : { page: 1, limit: 10 },
            }),
        }),
        getMyActivityLogs: builder.query<ActivityLogResponse[], void>({
            query: () => ({
                url: endpoints.myActivityLogs,
                method: 'GET',
            }),
        }),
        getMyNotifications: builder.query<NotificationResponse, { page?: number; limit?: number; search?: string; filter?: string } | void>({
            query: (params) => ({
                url: endpoints.myNotifications,
                method: 'GET',
                params: params ? { page: params.page || 1, limit: params.limit || 10, search: params.search || '', filter: params.filter || '' } : { page: 1, limit: 10 },
            }),
        }),
        markNotificationAsRead: builder.mutation<void, void>({
            query: () => ({
                url: endpoints.markNotificationAsRead,
                method: 'PATCH',
            }),
        }),
        markNotificationAsReadById: builder.mutation<void, string>({
            query: (id) => ({
                url: endpoints.markNotificationAsReadById(id),
                method: 'PATCH',
            }),
        }),
        deleteNotificationById: builder.mutation<void, string>({
            query: (id) => ({
                url: endpoints.deleteNotificationById(id),
                method: 'DELETE',
            }),
        }),
        deactivateVendor: builder.mutation<void, void>({
            query: () => ({
                url: endpoints.deactivateVendor,
                method: 'DELETE',
            }),
        }),
        updateNotificationSettings: builder.mutation<void, NotificationSettings>({
            query: (body) => ({
                url: endpoints.vendorSettings,
                method: 'PATCH',
                body,
            }),
        }),
        getVendorSettings: builder.query<VendorSettingsResponse, void>({
            query: () => ({
                url: endpoints.getVendorSettings,
                method: 'GET',
            }),
        }),
        getLoginHistory: builder.query<LoginHistory[], void>({
            query: () => ({
                url: endpoints.loginHistory,
                method: 'GET',
            }),
        }),
    })
})

export const { 
    // Auth Endpoints
    useCreateVendorMutation,
    useVerifyVendorMutation,
    useLoginVendorMutation,
    useLogoutVendorMutation,
    useResendVerificationOtpMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,

    // Vendor Endpoints
    useGetProfileQuery,
    useUpdateVendorProfileMutation,
    useGetCompanyDetailsQuery,
    useInitPaymentMutation,
    useVerifyPaymentQuery,
    useGetApplicationQuery,
    useGetApplicationTimelineQuery,
    useGetPaymentHistoryQuery,
    useGetMyActivityLogsQuery,
    useGetMyNotificationsQuery,
    useLazyGetMyNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useMarkNotificationAsReadByIdMutation,
    useDeleteNotificationByIdMutation,
    useDeactivateVendorMutation,
    useUpdateNotificationSettingsMutation,
    useGetVendorSettingsQuery,
    useGetLoginHistoryQuery,
    useCompleteVendorRegistrationMutation,
    useRestartApplicationRegistrationMutation,
} = vendorApi;