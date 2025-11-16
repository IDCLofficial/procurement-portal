export interface DocumentRequirement {
    id: string;
    name: string;
    required: boolean;
    validFor?: string;
    hasValidityPeriod: boolean;
    uploaded: boolean;
    fileName?: string;
    fileSize?: string;
    uploadedDate?: string;
    fileUrl?: string;
    fileType?: string;
    validFrom?: string;
    validTo?: string;
}
