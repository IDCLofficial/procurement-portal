'use client';

import { useState, useCallback, useMemo } from 'react';
import { AlertTriangle, FileText } from 'lucide-react';
import { useAppSelector } from '@/app/admin/redux/hooks';
import {
  useGetAdminNotificationsQuery,
  useMarkAdminNotificationAsReadByIdMutation,
} from '@/app/admin/redux/services/adminApi';
import type { Notification } from '../_constants';

export type NotificationTabKey = 'all' | 'unread' | 'read';

export interface DashboardState {
  notifications: Notification[];
  activeTab: NotificationTabKey;
  searchTerm: string;
}

export interface DashboardStats {
  totalCount: number;
  unreadCount: number;
  criticalCount: number;
  highPriorityCount: number;
}

export interface DashboardHandlers {
  handleMarkRead: (id: string) => void;
  handleDelete: (id: string) => void;
  handleTabChange: (tab: NotificationTabKey) => void;
  handleSearchChange: (term: string) => void;
  handlePageChange: (page: number) => void;
}

export interface UseDashboardReturn {
  user: { id: string; name: string; email: string; role: string } | null;
  isAuthenticated: boolean;
  isFetching: boolean;
  notifications: Notification[];
  filteredNotifications: Notification[];
  activeTab: NotificationTabKey;
  searchTerm: string;
  stats: DashboardStats;
  handlers: DashboardHandlers;
  tabs: { key: NotificationTabKey; label: string; count: number }[];
  page: number;
  limit: number;
  totalNotifications: number;
}

export function useDashboard(): UseDashboardReturn {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const [hiddenNotificationIds, setHiddenNotificationIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<NotificationTabKey>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data: apiNotifications, isFetching } = useGetAdminNotificationsQuery({ page, limit });
  const [markAdminNotificationAsReadById] = useMarkAdminNotificationAsReadByIdMutation();

  const notifications = useMemo<Notification[]>(() => {
    if (!apiNotifications?.notifications) return [];

    return apiNotifications.notifications
      .map((n) => {
        const created = new Date(n.createdAt);
        const dateStr = Number.isNaN(created.getTime())
          ? n.createdAt
          : created.toLocaleDateString();

        const priority = n.priority?.toLowerCase() || 'high';
        const isCritical = priority === 'critical';
        const id = n._id;

        if (hiddenNotificationIds.includes(id)) {
          return null;
        }

        const isUnread = !readNotificationIds.includes(id);

        return {
          id,
          title: n.title,
          description: n.message,
          date: dateStr,
          priorityLabel: isCritical ? 'Critical Priority' : 'High Priority',
          priorityLevel: isCritical ? 'critical' : 'high',
          tone: isCritical ? 'critical' : 'warning',
          tag: 'SYSTEM',
          applicationRef: 'SYSTEM',
          isUnread,
          icon: isCritical ? AlertTriangle : FileText,
          actionLabel: 'View Details',
        } as Notification;
      })
      .filter((notification): notification is Notification => notification !== null);
  }, [apiNotifications, readNotificationIds, hiddenNotificationIds]);

  // Calculate stats
  const stats = useMemo<DashboardStats>(() => {
    const totalCountFromApi = apiNotifications?.totalNotifications;
    const unreadCountFromApi = apiNotifications?.totalUnreadNotifications;
    const criticalCountFromApi = apiNotifications?.totalCriticalNotifications;
    const highPriorityCountFromApi = apiNotifications?.totalHighPriorityNotifications;

    const totalCount = typeof totalCountFromApi === 'number' ? totalCountFromApi : notifications.length;
    const unreadCount =
      typeof unreadCountFromApi === 'number'
        ? unreadCountFromApi
        : notifications.filter((n) => n.isUnread).length;
    const criticalCount =
      typeof criticalCountFromApi === 'number'
        ? criticalCountFromApi
        : notifications.filter((n) => n.priorityLevel === 'critical').length;
    const highPriorityCount =
      typeof highPriorityCountFromApi === 'number'
        ? highPriorityCountFromApi
        : notifications.filter((n) => n.priorityLevel === 'high').length;

    return { totalCount, unreadCount, criticalCount, highPriorityCount };
  }, [apiNotifications, notifications]);

  // Filter notifications based on tab and search
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((notification) => {
        if (activeTab === 'unread') return notification.isUnread;
        if (activeTab === 'read') return !notification.isUnread;
        return true;
      })
      .filter((notification) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return (
          notification.title.toLowerCase().includes(term) ||
          notification.description.toLowerCase().includes(term) ||
          notification.applicationRef.toLowerCase().includes(term)
        );
      });
  }, [notifications, activeTab, searchTerm]);

  // Handlers
  const handleMarkRead = useCallback(
    (id: string) => {
      // Optimistic update: mark as read locally first
      setReadNotificationIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

      // Persist change on the server
      markAdminNotificationAsReadById(id)
        .unwrap()
        .catch((error) => {
          // Roll back on failure
          setReadNotificationIds((prev) => prev.filter((existingId) => existingId !== id));

          console.error('Failed to mark admin notification as read', error);
        });
    },
    [markAdminNotificationAsReadById]
  );

  const handleDelete = useCallback((id: string) => {
    setHiddenNotificationIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const handleTabChange = useCallback((tab: NotificationTabKey) => {
    setActiveTab(tab);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1); // Reset to first page when searching
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Tab configuration
  const tabs = useMemo(
    () => [
      { key: 'all' as const, label: 'All', count: stats.totalCount },
      { key: 'unread' as const, label: 'Unread', count: stats.unreadCount },
      { key: 'read' as const, label: 'Read', count: stats.totalCount - stats.unreadCount },
    ],
    [stats.totalCount, stats.unreadCount]
  );

  return {
    user,
    isAuthenticated,
    notifications,
    filteredNotifications,
    activeTab,
    searchTerm,
    stats,
    isFetching,
    handlers: {
      handleMarkRead,
      handleDelete,
      handleTabChange,
      handleSearchChange,
      handlePageChange,
    },
    tabs,
    page,
    limit,
    totalNotifications: apiNotifications?.totalNotifications || 0,
  };
}
