'use client';

import { useState, useCallback, useMemo } from 'react';
import { AlertTriangle, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/app/admin/redux/hooks';

import { useAppSelector } from '@/app/admin/redux/hooks';
import {
  useGetAdminNotificationsQuery,
  useMarkAdminNotificationAsReadByIdMutation,
  adminApi,
} from '@/app/admin/redux/services/adminApi';

import type { Notification } from '../_constants';

export type NotificationTabKey = 'all' | 'unread' | 'read';

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
  handlePrimaryAction: (id: string) => void;
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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [hiddenNotificationIds, setHiddenNotificationIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<NotificationTabKey>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  /* -----------------------------
     QUERY ARGS
  ------------------------------ */
  const queryArgs = useMemo(
    () => ({
      page,
      limit,
      isRead:
        activeTab === 'all'
          ? undefined
          : activeTab === 'read'
          ? true
          : activeTab === 'unread'
          ? false
          : undefined,
    }),
    [page, limit, activeTab]
  );

  /* -----------------------------
     RTK QUERY
  ------------------------------ */
  const { data: apiNotifications, isFetching } =
    useGetAdminNotificationsQuery(queryArgs, {
      skip: !user,
      refetchOnMountOrArgChange: true,
    });

  const [markAdminNotificationAsReadById] =
    useMarkAdminNotificationAsReadByIdMutation();

  /* -----------------------------
     MAP NOTIFICATIONS
  ------------------------------ */
  const notifications = useMemo<Notification[]>(() => {
    if (!apiNotifications?.notifications) return [];

    console.log('API Response for tab', activeTab, ':', apiNotifications.notifications);

    return apiNotifications.notifications
      .filter((n) => !hiddenNotificationIds.includes(n._id))
      .map((n) => {
        const created = new Date(n.createdAt);
        const dateStr = Number.isNaN(created.getTime())
          ? n.createdAt
          : created.toLocaleDateString();

        const priority = n.priority?.toLowerCase() || 'high';
        const isCritical = priority === 'critical';

        const isUnread = activeTab === 'unread';
        console.log(`Notification ${n._id}: activeTab=${activeTab}, isUnread=${isUnread}`);

        return {
          id: n._id,
          title: n.title,
          description: n.message,
          date: dateStr,
          priorityLabel: isCritical ? 'Critical Priority' : 'High Priority',
          priorityLevel: isCritical ? 'critical' : 'high',
          tone: isCritical ? 'critical' : 'warning',
          tag: 'SYSTEM',
          applicationRef: 'SYSTEM',
          isUnread: isUnread,
          icon: isCritical ? AlertTriangle : FileText,
          actionLabel: 'View Details',
        };
      });
  }, [apiNotifications, hiddenNotificationIds]);

  /* -----------------------------
     STATS
  ------------------------------ */
  const stats = useMemo<DashboardStats>(() => {
    return {
      totalCount: apiNotifications?.totalNotifications ?? notifications.length,
      unreadCount:
        apiNotifications?.totalUnreadNotifications ??
        notifications.filter((n) => n.isUnread).length,
      criticalCount:
        apiNotifications?.totalCriticalNotifications ??
        notifications.filter((n) => n.priorityLevel === 'critical').length,
      highPriorityCount:
        apiNotifications?.totalHighPriorityNotifications ??
        notifications.filter((n) => n.priorityLevel === 'high').length,
    };
  }, [apiNotifications, notifications]);

  /* -----------------------------
     FILTER BY SEARCH
  ------------------------------ */
  const filteredNotifications = useMemo(() => {
    if (!searchTerm.trim()) return notifications;

    const term = searchTerm.toLowerCase();
    return notifications.filter(
      (n) =>
        n.title.toLowerCase().includes(term) ||
        n.description.toLowerCase().includes(term) ||
        n.applicationRef.toLowerCase().includes(term)
    );
  }, [notifications, searchTerm]);

  /* -----------------------------
     HANDLERS
  ------------------------------ */

 const handleMarkRead = useCallback(
  async (id: string) => {
    /* 1️⃣ Remove from UNREAD cache immediately */
    const patchUnread = dispatch(
      adminApi.util.updateQueryData(
        'getAdminNotifications',
        { page, limit, isRead: false },
        (draft: any) => {
          draft.notifications = draft.notifications.filter(
            (n: any) => n._id !== id
          );
          draft.totalUnreadNotifications =
            Math.max(0, draft.totalUnreadNotifications - 1);
        }
      )
    );

    /* 2️⃣ Update ALL cache */
    const patchAll = dispatch(
      adminApi.util.updateQueryData(
        'getAdminNotifications',
        { page, limit, isRead: undefined },
        (draft: any) => {
          const notification = draft.notifications.find(
            (n: any) => n._id === id
          );
          if (notification) {
            notification.isRead = true;
            draft.totalUnreadNotifications =
              Math.max(0, draft.totalUnreadNotifications - 1);
          }
        }
      )
    );

    try {
      /* 3️⃣ Persist to backend */
      await markAdminNotificationAsReadById(id).unwrap();
    } catch (error) {
      /* 4️⃣ Rollback on failure */
      patchUnread.undo();
      patchAll.undo();
      console.error('Failed to mark notification as read', error);
    }
  },
  [dispatch, markAdminNotificationAsReadById, page, limit]
);


  const handleDelete = useCallback((id: string) => {
    setHiddenNotificationIds((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  }, []);

  const handlePrimaryAction = useCallback(async (id: string) => {
    try {
      // Navigate to application detail
      router.push(`/admin/systemadmin/applications/${id}`);
      
      // Wait a bit for the page to potentially load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if we're on a 404 page by looking for common 404 indicators
      const title = document.title;
      const hasNotFoundText = document.body.textContent?.includes('404') || 
                              document.body.textContent?.includes('Not Found') ||
                              document.body.textContent?.includes('Page not found');
      
      // If we detect a 404, navigate back to applications list
      if (hasNotFoundText || title.includes('404')) {
        console.error('Application not found, falling back to applications list');
        router.push('/admin/systemadmin/applications/');
      }
    } catch (error) {
      console.error('Navigation error, falling back to applications list');
      router.push('/admin/systemadmin/applications/');
    }
  }, [router]);

  const handleTabChange = useCallback((tab: NotificationTabKey) => {
    setActiveTab(tab);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /* -----------------------------
     TABS
  ------------------------------ */
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
    isFetching,
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
      handlePageChange,
      handlePrimaryAction,
    },
    tabs,
    page,
    limit,
    totalNotifications: apiNotifications?.totalNotifications ?? 0,
  };
}
