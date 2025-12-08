'use client';

import NotificationSummaryRow from '@/app/admin/components/id/notification-summary-row';
import NotificationToolbar from '@/app/admin/components/id/notification-toolbar';
import NotificationTabs from '@/app/admin/components/id/notification-tabs';
import NotificationCard from '@/app/admin/components/id/notification-card';
import type { Notification } from '../constants';
import type { NotificationTabKey } from '../hooks';

interface NotificationListProps {
  notifications: Notification[];
  stats: {
    totalCount: number;
    unreadCount: number;
    criticalCount: number;
    highPriorityCount: number;
  };
  tabs: { key: NotificationTabKey; label: string; count: number }[];
  activeTab: NotificationTabKey;
  searchTerm: string;
  onTabChange: (tab: NotificationTabKey) => void;
  onSearchChange: (term: string) => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onPrimaryAction?: (id: string) => void;
}

export function NotificationList({
  notifications,
  stats,
  tabs,
  activeTab,
  searchTerm,
  onTabChange,
  onSearchChange,
  onMarkRead,
  onDelete,
  onPrimaryAction,
}: NotificationListProps) {
  return (
    <div className="space-y-6">
      <NotificationSummaryRow
        total={stats.totalCount}
        unread={stats.unreadCount}
        critical={stats.criticalCount}
        highPriority={stats.highPriorityCount}
      />

      <div className="space-y-3 pt-6">
        <NotificationToolbar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onFilterClick={() => {}}
        />
        <NotificationTabs
          tabs={tabs}
          activeKey={activeTab}
          onTabChange={(key) => onTabChange(key as NotificationTabKey)}
        />
      </div>

      <div className="space-y-4 pt-4">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            icon={notification.icon}
            tone={notification.tone}
            title={notification.title}
            description={notification.description}
            date={notification.date}
            priorityLabel={notification.priorityLabel}
            priorityLevel={notification.priorityLevel}
            tag={notification.tag}
            applicationRef={notification.applicationRef}
            isUnread={notification.isUnread}
            actionLabel={notification.actionLabel}
            onPrimaryAction={() => onPrimaryAction?.(notification.id)}
            onMarkRead={() => onMarkRead(notification.id)}
            onDelete={() => onDelete(notification.id)}
          />
        ))}
      </div>
    </div>
  );
}
