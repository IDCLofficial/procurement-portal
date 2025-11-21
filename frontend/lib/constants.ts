// Contractor Status
export enum ContractorStatus {
    APPROVED = 'approved',
    PENDING = 'pending',
    SUSPENDED = 'suspended',
}

// Contractor Sectors
export enum ContractorSector {
    WORKS = 'WORKS',
    SUPPLIES = 'SUPPLIES',
    SERVICES = 'SERVICES',
}

// Contractor Grades
export enum ContractorGrade {
    A = 'A',
    B = 'B',
    C = 'C',
}

// Status Configuration
export const STATUS_CONFIG = {
    [ContractorStatus.APPROVED]: {
        label: 'Approved',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        iconColor: '#047857',
        badgeClass: 'bg-green-100 text-green-800 border-green-200',
        cardBg: 'bg-green-50',
        cardBorder: 'border-green-200',
        lightBg: 'bg-green-200/80',
    },
    [ContractorStatus.PENDING]: {
        label: 'Pending',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200',
        iconColor: '#ca8a04',
        badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        cardBg: 'bg-yellow-50',
        cardBorder: 'border-yellow-200',
        lightBg: 'bg-yellow-200/80',
    },
    [ContractorStatus.SUSPENDED]: {
        label: 'Suspended',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        iconColor: '#dc2626',
        badgeClass: 'bg-red-100 text-red-800 border-red-200',
        cardBg: 'bg-red-50',
        cardBorder: 'border-red-200',
        lightBg: 'bg-red-200/80',
    },
} as const;

// Sector Configuration
export const SECTOR_CONFIG = {
    [ContractorSector.WORKS]: {
        label: 'Works',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    [ContractorSector.SUPPLIES]: {
        label: 'Supplies',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800',
        borderColor: 'border-purple-200',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    [ContractorSector.SERVICES]: {
        label: 'Services',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        borderColor: 'border-orange-200',
        badgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
    },
} as const;

// Grade Configuration
export const GRADE_CONFIG = {
    [ContractorGrade.A]: {
        label: 'Grade A',
        bgColor: 'bg-emerald-500',
        textColor: 'text-white',
        borderColor: 'border-emerald-600',
        badgeClass: 'bg-emerald-500 text-white border-emerald-600',
    },
    [ContractorGrade.B]: {
        label: 'Grade B',
        bgColor: 'bg-blue-500',
        textColor: 'text-white',
        borderColor: 'border-blue-600',
        badgeClass: 'bg-blue-500 text-white border-blue-600',
    },
    [ContractorGrade.C]: {
        label: 'Grade C',
        bgColor: 'bg-gray-500',
        textColor: 'text-white',
        borderColor: 'border-gray-600',
        badgeClass: 'bg-gray-500 text-white border-gray-600',
    },
} as const;

// Helper Functions
export const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status as ContractorStatus] || STATUS_CONFIG[ContractorStatus.APPROVED];
};

export const getSectorConfig = (sector: string) => {
    return SECTOR_CONFIG[sector as ContractorSector] || SECTOR_CONFIG[ContractorSector.WORKS];
};

export const getGradeConfig = (grade: string) => {
    return GRADE_CONFIG[grade as ContractorGrade] || GRADE_CONFIG[ContractorGrade.C];
};

// Status Messages
export const STATUS_MESSAGES = {
    [ContractorStatus.APPROVED]: {
        title: 'Verified Contractor',
        description: 'This contractor is registered with the Imo State Bureau of Public Private Partnerships & Investments (BPPPI) and has met all compliance requirements. The information displayed is accurate as of the last verification date.',
        note: 'Always verify the registration status before engaging in any contract. For additional verification, scan the QR code on the contractor\'s certificate.',
    },
    [ContractorStatus.PENDING]: {
        title: 'Pending Verification',
        description: 'This contractor registration is currently pending approval by the Imo State Bureau of Public Private Partnerships & Investments (BPPPI). Please check back later for updated status.',
        note: 'Always verify the registration status before engaging in any contract. For additional verification, scan the QR code on the contractor\'s certificate.',
    },
    [ContractorStatus.SUSPENDED]: {
        title: 'Suspended Contractor',
        description: 'This contractor has been suspended by the Imo State Bureau of Public Private Partnerships & Investments (BPPPI). Please contact BPPPI for more information before engaging with this contractor.',
        note: 'Always verify the registration status before engaging in any contract. For additional verification, scan the QR code on the contractor\'s certificate.',
    },
} as const;

// Type exports for better TypeScript support
export type StatusType = keyof typeof STATUS_CONFIG;
export type SectorType = keyof typeof SECTOR_CONFIG;
export type GradeType = keyof typeof GRADE_CONFIG;
