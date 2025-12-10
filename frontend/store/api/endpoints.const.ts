export default {
    createVendor: "/vendors",
    verifyVendor: "/vendors/verify-email",
    resendVerificationCode: "/vendors/resend-verification-otp",
    loginVendor: "/vendors/login",
    getProfile: "/vendors/profile",
    getCompanyDetails: "/companies/my-company",
    complete_vendor_registration: "/vendors/register-company",
    getDocumentsPresets: "/documents/presets",
    getCategories: "/categories",
    initPayment: "/vendor-payments/initialize",
    verifyPayment: (reference: string) => `/vendor-payments/verify/${reference}`,
    getApplication: "/vendors/applications/my-company",
    vendorApplicationTimeline: "vendors/my-application-timeline",
    myPaymentsHistory: "/vendors/my-payment-history",
    myActivityLogs: "/vendors/activity-logs",
    myNotifications: "/notifications/vendor-notification",
    deactivateVendor: "/vendors/deactivate-my-account",
    markNotificationAsRead: "/notifications/mark-all-vendor-as-read",

    // Public Endpoints
    getAllContractor: "/certificates",
    getContractorById: (id: string) => `/certificates/${id}`,
} as const