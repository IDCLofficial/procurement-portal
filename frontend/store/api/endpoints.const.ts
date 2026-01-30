export default {
    // Auth Endpoints
    forgotPassword: "/vendors/forgot-password",
    resetPassword: "/vendors/reset-password",
    changePassword: "/vendors/change-password",
    createVendor: "/vendors",
    verifyVendor: "/vendors/verify-email",
    resendVerificationCode: "/vendors/resend-verification-otp",
    loginVendor: "/vendors/login",
    logoutVendor: "/vendors/logout",

    // Vendor Endpoints
    getProfile: "/vendors/profile",
    getCompanyDetails: "/companies/my-company",
    complete_vendor_registration: "/vendors/register-company",
    initPayment: "/vendor-payments/initialize",
    verifyPayment: (reference: string) => `/vendor-payments/verify/${reference}`,
    getApplication: "/vendors/applications/my-company",
    vendorApplicationTimeline: "vendors/my-application-timeline",
    myPaymentsHistory: "/vendors/my-payment-history",
    myActivityLogs: "/vendors/activity-logs",
    myNotifications: "/notifications/vendor-notification",
    deactivateVendor: "/vendors/deactivate-my-account",
    markNotificationAsRead: "/notifications/mark-all-vendor-as-read",
    markNotificationAsReadById: (id: string) => `/notifications/mark-as-read/${id}`,
    deleteNotificationById: (id: string) => `/notifications/vendor-notification/${id}`,
    vendorSettings: "/vendors/settings",
    getVendorSettings: "/vendors/settings",
    loginHistory: "/vendors/login-history",
    restartApplicationRegistration: "/vendors/restart-registration",
    
    // Helper Endpoints
    getCategories: "/categories",
    getMDA: "/mda",
    getDocumentsPresets: "/documents/presets",

    // Public Endpoints
    getAllContractor: "/certificates",
    getContractorById: (id: string) => `/certificates/${id}`,

} as const