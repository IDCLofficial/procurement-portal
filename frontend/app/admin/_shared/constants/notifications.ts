import type { ComponentType, SVGProps } from 'react';
import { FileText, Clock, AlertTriangle } from 'lucide-react';

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationTone = 'info' | 'warning' | 'critical';
export type NotificationPriority = 'high' | 'critical';

export interface Notification {
  applicationId?: string;
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

// ============================================================================
// Default Notifications (Mock Data)
// ============================================================================

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    applicationId: '67',
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

];
