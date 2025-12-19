import { LucideIcon } from 'lucide-react';

export interface StatItem {
  id: number;
  name: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: 'increase' | 'decrease';
}

export interface InfoCardsProps {
  stats: StatItem[];
}

export interface TabItem {
  name: string;
  count?: number;
  current: boolean;
}

export interface TabNavigationProps {
  tabs: TabItem[];
  onTabChange?: (tabName: string) => void;
}

export interface TopBarProps {
  title: string;
  userInitials: string;
  onNotificationClick?: () => void;
  onUserMenuClick?: () => void;
}

export interface CompanyCategory {
  sector: string;
  service: string;
}

export interface Company {
  _id?: string;
  userId?: string;
  companyName?: string;
  cacNumber?: string;
  tin?: string;
  address?: string;
  lga?: string;
  categories?: (string | CompanyCategory)[];
  grade?: string;
  documents?: CompanyDocument[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  website?: string;
  directors?: {
    directors?: Array<{
      name: string;
      position: string;
      address: string;
      nationality: string;
      identification: string;
      idType: string;
      expiryDate: string;
    }>;
  } | Array<{
    name: string;
    position: string;
    address: string;
    nationality: string;
    identification: string;
    idType: string;
    expiryDate: string;
  }>;
  accountName?: string;
  accountNumber?: number;
  bankName?: string;
}

export interface CompanyDocumentStatus {
  status?: string;
  _id?: string;
  message?: string;
}

export interface CompanyDocument {
  _id?: string;
  vendor?: string;
  fileUrl?: string;
  documentType?: string;
  uploadedDate?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  validFor?: string;
  hasValidityPeriod?: boolean;
  status?: CompanyDocumentStatus;
  validFrom?: string;
  validTo?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface ApplicationStatusEntry {
  notes?: string;
  status: string;
  timestamp?: string;
}

export interface Application {
  _id: string;
  id: string;
  name: string;
  rcNumber: string;
  sector: string;
  grade: string;
  type: string;
  submissionDate: string;
  slaStatus: 'Overdue' | 'On Track' | string;
  assignedTo: string;
  currentStatus?: string;
  applicationTimeline?: ApplicationStatusEntry[];
  companyId?: string | Company;
  assignedToId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export type CertificateStatus = 'approved' | 'expired' | 'revoked';

export interface Certificate {
  _id: string;
  certificateId: string;
  // Can be string ID or populated object
  contractorId: string | {
    _id: string;
    fullname: string;
    email: string;
    phoneNo: string;
    companyId: string;
    [key: string]: unknown;
  };
  // Can be string ID or populated object
  company: string | {
    _id: string;
    companyName: string;
    cacNumber: string;
    tin: string;
    address: string;
    lga: string;
    categories: Array<{
      sector: string;
      service: string;
    }>;
    grade: string;
    documents: string[];
    website?: string;
    accountName?: string;
    accountNumber?: number;
    bankName?: string;
    [key: string]: unknown;
  };
  contractorName: string;
  companyName?: string;
  rcBnNumber: string;
  tin?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  approvedSectors?: string[];
  categories?: Array<{
    sector: string;
    service: string;
  }>;
  grade: string;
  lga: string;
  status: CertificateStatus;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
  // Legacy properties for backward compatibility
  id?: string;
  rcbn?: string;
  sector?: string;
  issueDate?: string;
  expiryDate?: string;
}

// Add more interfaces here as your application grows
// Example:
// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
// }
