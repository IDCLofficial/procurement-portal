'use client';

import { useState, useCallback, useMemo } from 'react';
import { INITIAL_NOTIFICATIONS, type Notification } from '../constants';

export type NotificationTabKey = 'all' | 'unread' | 'read';

export interface NotificationStats {
  totalCount: number;
  unreadCount: number;
  criticalCount: number;
  highPriorityCount: number;
}

export interface NotificationHandlers {
  handleMarkRead: (id: string) => void;
  handleDelete: (id: string) => void;
  handleTabChange: (tab: NotificationTabKey) => void;
  handleSearchChange: (term: string) => void;
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  filteredNotifications: Notification[];
  activeTab: NotificationTabKey;
  searchTerm: string;
  stats: NotificationStats;
  handlers: NotificationHandlers;
  tabs: { key: NotificationTabKey; label: string; count: number }[];
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<NotificationTabKey>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate stats
  const stats = useMemo<NotificationStats>(() => {
    const totalCount = notifications.length;
    const unreadCount = notifications.filter((n) => n.isUnread).length;
    const criticalCount = notifications.filter((n) => n.priorityLevel === 'critical').length;
    const highPriorityCount = notifications.filter((n) => n.priorityLevel === 'high').length;

    return { totalCount, unreadCount, criticalCount, highPriorityCount };
  }, [notifications]);

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
  const handleMarkRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isUnread: false } : notification
      )
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const handleTabChange = useCallback((tab: NotificationTabKey) => {
    setActiveTab(tab);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
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
    notifications,
    filteredNotifications,
    activeTab,
    searchTerm,
    stats,
    handlers: {
      handleMarkRead,
      handleDelete,
      handleTabChange,
      handleSearchChange,
    },
    tabs,
  };
}
