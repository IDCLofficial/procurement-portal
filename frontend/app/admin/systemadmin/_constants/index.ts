import type { ComponentType, SVGProps } from 'react';
import {
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

// ============================================================================
// Dashboard Constants
// ============================================================================

export type NotificationTone = 'info' | 'warning' | 'critical';
export type NotificationPriority = 'high' | 'critical';

export interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  priorityLabel: string;
  priorityLevel: NotificationPriority;
  tone: NotificationTone;
  tag: string;
  applicationRef: string;
  isUnread: boolean;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  actionLabel: string;
}

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New Application Assigned',
    description:
      'New application from BuildTech Engineering (RC0998888) has been assigned to you for desk review. Sector: WORKS, Grade: C',
    date: '13 Nov 2024',
    priorityLabel: 'High Priority',
    priorityLevel: 'high',
    tone: 'info',
    tag: 'app-2024-010',
    applicationRef: 'app-2024-010',
    isUnread: true,
    icon: FileText,
    actionLabel: 'Review Application',
  },
  {
    id: '2',
    title: 'SLA Breach Alert',
    description:
      'Application app-2024-010 (BuildTech Engineering) has breached SLA deadline. Immediate action required.',
    date: '13 Nov 2024',
    priorityLabel: 'Critical Priority',
    priorityLevel: 'critical',
    tone: 'critical',
    tag: 'app-2024-010',
    applicationRef: 'app-2024-010',
    isUnread: true,
    icon: AlertTriangle,
    actionLabel: 'View Details',
  },
  {
    id: '3',
    title: 'SLA Deadline Approaching',
    description:
      'Application app-2024-009 (InfoTech Systems) is due for review in 6 hours. Please complete your review to avoid SLA breach.',
    date: '13 Nov 2024',
    priorityLabel: 'High Priority',
    priorityLevel: 'high',
    tone: 'warning',
    tag: 'app-2024-009',
    applicationRef: 'app-2024-009',
    isUnread: false,
    icon: Clock,
    actionLabel: 'Review Now',
  },
];

// ============================================================================
// Applications Constants
// ============================================================================

export const APPLICATION_TABS = [
  'All',
  'New',
  'Renewals',
  'Desk',
  'Clarifications',
  'Registrar',
  'Completed',
  'SLA',
] as const;

export type ApplicationTabId = (typeof APPLICATION_TABS)[number];

export const APPLICATION_TAB_FILTERS: Record<
  Lowercase<ApplicationTabId>,
  { statusFilter?: string; typeFilter?: string }
> = {
  all: { statusFilter: undefined, typeFilter: undefined },
  new: { statusFilter: undefined, typeFilter: 'New' },
  renewals: { statusFilter: undefined, typeFilter: 'renewal' },
  desk: { statusFilter: 'Pending Desk Review', typeFilter: undefined },
  clarifications: { statusFilter: 'Clarification Requested', typeFilter: undefined },
  registrar: { statusFilter: 'Forwarded to Registrar', typeFilter: undefined },
  completed: { statusFilter: 'Approved', typeFilter: undefined },
  sla: { statusFilter: 'sla_breach', typeFilter: undefined },
};

// ============================================================================
// Certificates Constants
// ============================================================================

export type CertificateTabId = 'all' | 'pending' | 'expiring' | 'revoked' | 'logs';

export const CERTIFICATE_TABS: { id: CertificateTabId; label: string }[] = [
  { id: 'all', label: 'All Certificates' },
  { id: 'expiring', label: 'Expired' },
  { id: 'revoked', label: 'Revoked/Suspended' },
  { id: 'logs', label: 'Verification Logs' },
];

// ============================================================================
// Settings Constants
// ============================================================================

export interface SlaStageConfig {
  id: string;
  label: string;
  description: string;
  value: number;
  fullWidth?: boolean;
}

export const DEFAULT_SLA_STAGES: SlaStageConfig[] = [
  {
    id: 'desk-officer-review',
    label: 'Desk Officer Review (Business Days)',
    description: 'Time allowed for initial document review',
    value: 5,
  },
  {
    id: 'registrar-review',
    label: 'Registrar Review (Business Days)',
    description: 'Time for final approval decision',
    value: 3,
  },
  {
    id: 'clarification-response',
    label: 'Clarification Response (Business Days)',
    description: 'Time for vendor to respond to clarifications',
    value: 7,
  },
  {
    id: 'payment-verification',
    label: 'Payment Verification (Business Days)',
    description: 'Time to verify payment status',
    value: 2,
  },
  {
    id: 'total-processing-target',
    label: 'Total Processing Target (Business Days)',
    description: 'Overall target for complete application processing',
    value: 10,
    fullWidth: true,
  },
];



export interface DocumentConfigItem {
  id: string;
  name: string;
  required: 'Required' | 'Optional';
  hasExpiry: 'Yes' | 'No';
  renewalFrequency: string;
}
// ============================================================================
// Users Constants
// ============================================================================

export const USER_STATS_CONFIG = {
  totalUsers: { id: 1, name: 'Total Users', icon: FileText },
  activeUsers: { id: 2, name: 'Active Users', icon: Clock },
  inactiveUsers: { id: 3, name: 'Inactive Users', icon: CheckCircle },
  deskOfficers: { id: 4, name: 'Desk Officers', icon: AlertCircle },
} as const;

// ============================================================================
// Layout Constants
// ============================================================================

export const TITLE_MAP: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/systemadmin': 'Applications',
  '/admin/systemadmin/applications': 'Applications',
  '/admin/systemadmin/certificates': 'Certificates',
  '/admin/systemadmin/users': 'User Management',
  '/admin/systemadmin/settings': 'Settings',
  '/admin/settings': 'Settings',
  '/admin/audit-logs': 'Audit Logs',
  '/admin/reports': 'Reports',
};
