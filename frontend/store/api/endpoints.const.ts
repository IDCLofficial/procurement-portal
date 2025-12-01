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
    initPayment: "/split-payments/initialize",
    verifyPayment: (reference: string) => `/split-payments/verify/${reference}`,
} as const