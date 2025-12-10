// Base API
export { baseApi } from './baseApi';

// Admin API
export {
    adminApi,
    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserRoleMutation,
    useDeleteUserMutation,
    useLoginMutation,
} from './adminApi';

// Application API
export {
    appApi,
    useGetApplicationsQuery,
    useGetApplicationByIdQuery,
    useAssignApplicationMutation,
    useGetApplicationsByUserQuery,
    useChangeApplicationStatusMutation,
} from './appApi';

// Certificate API
export {
    certificateApi,
    useGetCertificatesQuery,
    useGetCertificateByIdQuery,
} from './certificateApi';

// Documents API
export {
    docsApi,
    useChangeDocumentStatusMutation,
} from './docsApi';

// Settings API
export {
    settingsApi,
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
} from './settingsApi';
