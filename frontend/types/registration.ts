export enum DocumentStatus {
    IDLE = 'idle',
    UPLOADING = 'uploading',
    SUCCESS = 'success',
    ERROR = 'error',
}
export interface DocumentRequirement {
    id: string;
    name: string;
    required: boolean;
    validFor?: string;
    hasValidityPeriod: boolean;
    uploaded: boolean;
    file?: File;
    validFrom?: string;
    validTo?: string;
    status: DocumentStatus;
    error?: string;
    fileUrl?: string;
    previewUrl?: string;
    fileName?: string;
    fileSize?: string;
    fileType?: string;
    uploadedDate?: string;
    changed?: boolean;
}