// 'use client';

// import { useState, useCallback, useMemo } from 'react';
// import { AlertTriangle, FileText } from 'lucide-react';
// import { useAppSelector } from '@/app/admin/redux/hooks';
// import { useGetDeskOfficerNotificationsQuery,  useGetRegistrarNotificationsQuery, } from '@/app/admin/redux/services/adminApi';
// import type { Notification } from '../../systemadmin/_constants';

// export type NotificationTabKey = 'all' | 'unread' | 'read';

// export interface DeskOfficerStats {
//   totalCount: number;
//   unreadCount: number;
//   criticalCount: number;
//   highPriorityCount: number;
// }

// export interface DeskOfficerHandlers {
//   handleMarkRead: (id: string) => void;
//   handleDelete: (id: string) => void;
//   handleTabChange: (tab: NotificationTabKey) => void;
//   handleSearchChange: (term: string) => void;
// }

// export interface UseDeskOfficerDashboardReturn {
//   user: { id: string; name: string; email: string; role: string } | null;
//   isAuthenticated: boolean;
//   isFetching: boolean;
//   notifications: Notification[];
//   filteredNotifications: Notification[];
//   activeTab: NotificationTabKey;
//   searchTerm: string;
//   stats: DeskOfficerStats;
//   handlers: DeskOfficerHandlers;
//   tabs: { key: NotificationTabKey; label: string; count: number }[];
// }

// export function useDeskOfficerDashboard(): UseDeskOfficerDashboardReturn {
//   const { user, isAuthenticated } = useAppSelector((state) => state.auth);

//   const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
//   const [hiddenNotificationIds, setHiddenNotificationIds] = useState<string[]>([]);
//   const [activeTab, setActiveTab] = useState<NotificationTabKey>('all');
//   const [searchTerm, setSearchTerm] = useState('');

//   // const { data: apiNotifications, isFetching } = useGetDeskOfficerNotificationsQuery({ page: 1, limit: 10 },  {
//   //   refetchOnMountOrArgChange: true,
//   // });

//   const isRegistrar = user?.role === 'Registrar';

// const {
//   data: deskOfficerData,
//   isFetching: isDeskOfficerFetching,
// } = useGetDeskOfficerNotificationsQuery(
//   { page: 1, limit: 10 },
//   {
//     skip: !user || isRegistrar,
//     refetchOnMountOrArgChange: true,
//   }
// );

// const {
//   data: registrarData,
//   isFetching: isRegistrarFetching,
// } =  useGetRegistrarNotificationsQuery(
//   { page: 1, limit: 10 },
//   {
//     skip: !user || !isRegistrar,
//     refetchOnMountOrArgChange: true,
//   }
// );
// const apiNotifications = isRegistrar ? registrarData : deskOfficerData;
// const isFetching = isRegistrar ? isRegistrarFetching : isDeskOfficerFetching;


//   const notifications = useMemo<Notification[]>(() => {
//     if (!apiNotifications?.notifications) return [];

//     return apiNotifications.notifications
//       .map((n) => {
//         const created = new Date(n.createdAt);
//         const dateStr = Number.isNaN(created.getTime())
//           ? n.createdAt
//           : created.toLocaleDateString();

//         const priority = n.priority?.toLowerCase() || 'high';
//         const isCritical = priority === 'critical';
//         const id = n._id;

//         if (hiddenNotificationIds.includes(id)) {
//           return null;
//         }

//         const isUnread = !readNotificationIds.includes(id);

//         return {
//           id,
//           title: n.title,
//           description: n.message,
//           date: dateStr,
//           priorityLabel: isCritical ? 'Critical Priority' : 'High Priority',
//           priorityLevel: isCritical ? 'critical' : 'high',
//           tone: isCritical ? 'critical' : 'warning',
//           tag: 'DESK_OFFICER',
//           applicationRef: 'SYSTEM',
//           isUnread,
//           icon: isCritical ? AlertTriangle : FileText,
//           actionLabel: 'View Details',
//         } as Notification;
//       })
//       .filter((notification): notification is Notification => notification !== null);
//   }, [apiNotifications, readNotificationIds, hiddenNotificationIds]);

//   // Calculate stats
//   const stats = useMemo<DeskOfficerStats>(() => {
//     const totalCountFromApi = apiNotifications?.totalNotifications;
//     const unreadCountFromApi = apiNotifications?.totalUnreadNotifications;
//     const criticalCountFromApi = apiNotifications?.totalCriticalNotifications;
//     const highPriorityCountFromApi = apiNotifications?.totalHighPriorityNotifications;

//     const totalCount = typeof totalCountFromApi === 'number' ? totalCountFromApi : notifications.length;
//     const unreadCount =
//       typeof unreadCountFromApi === 'number'
//         ? unreadCountFromApi
//         : notifications.filter((n) => n.isUnread).length;
//     const criticalCount =
//       typeof criticalCountFromApi === 'number'
//         ? criticalCountFromApi
//         : notifications.filter((n) => n.priorityLevel === 'critical').length;
//     const highPriorityCount =
//       typeof highPriorityCountFromApi === 'number'
//         ? highPriorityCountFromApi
//         : notifications.filter((n) => n.priorityLevel === 'high').length;

//     return { totalCount, unreadCount, criticalCount, highPriorityCount };
//   }, [apiNotifications, notifications]);

//   // Filter notifications based on tab and search
//   const filteredNotifications = useMemo(() => {
//     return notifications
//       .filter((notification) => {
//         if (activeTab === 'unread') return notification.isUnread;
//         if (activeTab === 'read') return !notification.isUnread;
//         return true;
//       })
//       .filter((notification) => {
//         if (!searchTerm.trim()) return true;
//         const term = searchTerm.toLowerCase();
//         return (
//           notification.title.toLowerCase().includes(term) ||
//           notification.description.toLowerCase().includes(term) ||
//           notification.applicationRef.toLowerCase().includes(term)
//         );
//       });
//   }, [notifications, activeTab, searchTerm]);

//   // Handlers
//   const handleMarkRead = useCallback((id: string) => {
//     setReadNotificationIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
//   }, []);

//   const handleDelete = useCallback((id: string) => {
//     setHiddenNotificationIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
//   }, []);

//   const handleTabChange = useCallback((tab: NotificationTabKey) => {
//     setActiveTab(tab);
//   }, []);

//   const handleSearchChange = useCallback((term: string) => {
//     setSearchTerm(term);
//   }, []);

//   // Tab configuration
//   const tabs = useMemo(
//     () => [
//       { key: 'all' as const, label: 'All', count: stats.totalCount },
//       { key: 'unread' as const, label: 'Unread', count: stats.unreadCount },
//       { key: 'read' as const, label: 'Read', count: stats.totalCount - stats.unreadCount },
//     ],
//     [stats.totalCount, stats.unreadCount]
//   );

//   return {
//     user,
//     isAuthenticated,
//     isFetching,
//     notifications,
//     filteredNotifications,
//     activeTab,
//     searchTerm,
//     stats,
//     handlers: {
//       handleMarkRead,
//       handleDelete,
//       handleTabChange,
//       handleSearchChange,
//     },
//     tabs,
//   };
// }


'use client';

import { useState, useCallback, useMemo } from 'react';
import { AlertTriangle, FileText } from 'lucide-react';

import { useAppSelector } from '@/app/admin/redux/hooks';
import {
  useGetDeskOfficerNotificationsQuery,
   useGetRegistrarNotificationsQuery,
} from '@/app/admin/redux/services/adminApi';

import type { Notification } from '../../systemadmin/_constants';


export type NotificationTabKey = 'all' | 'unread' | 'read';

export interface DeskOfficerStats {
  totalCount: number;                   
  unreadCount: number;
  criticalCount: number;
  highPriorityCount: number;
}

export interface DeskOfficerHandlers {
  handleMarkRead: (id: string) => void;
  handleDelete: (id: string) => void;
  handleTabChange: (tab: NotificationTabKey) => void;
  handleSearchChange: (term: string) => void;
}

export interface UseDeskOfficerDashboardReturn {
  user: { id: string; name: string; email: string; role: string } | null;
  isAuthenticated: boolean;
  isFetching: boolean;
  notifications: Notification[];
  filteredNotifications: Notification[];
  activeTab: NotificationTabKey;
  searchTerm: string;
  stats: DeskOfficerStats;
  handlers: DeskOfficerHandlers;
  tabs: { key: NotificationTabKey; label: string; count: number }[];
}

export function useDeskOfficerDashboard(): UseDeskOfficerDashboardReturn {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
console.log(user?.role)
  const isRegistrar = user?.role === 'Registrar';

  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const [hiddenNotificationIds, setHiddenNotificationIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<NotificationTabKey>('all');
  const [searchTerm, setSearchTerm] = useState('');

  /* -----------------------------
     RTK QUERY (ROLE AWARE)
  ------------------------------ */

  const {
    data: deskOfficerData,
    isFetching: isDeskOfficerFetching,
  } = useGetDeskOfficerNotificationsQuery(
    { page: 1, limit: 10 },
    {
      skip: !user || isRegistrar,
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: registrarData,
    isFetching: isRegistrarFetching,
  } =  useGetRegistrarNotificationsQuery(
    { page: 1, limit: 10 },
    {
      skip: !user || !isRegistrar,
      refetchOnMountOrArgChange: true,
    }
  );

  const apiNotifications = isRegistrar ? registrarData : deskOfficerData;
  const isFetching = isRegistrar ? isRegistrarFetching : isDeskOfficerFetching;

  /* -----------------------------
     NORMALIZE NOTIFICATIONS
  ------------------------------ */

  const notifications = useMemo<Notification[]>(() => {
    if (!apiNotifications?.notifications) return [];

    return apiNotifications.notifications
      .map((n) => {
        if (hiddenNotificationIds.includes(n._id)) return null;

        const created = new Date(n.createdAt);
        const dateStr = Number.isNaN(created.getTime())
          ? n.createdAt
          : created.toLocaleDateString();

        const priority = n.priority?.toLowerCase() || 'high';
        const isCritical = priority === 'critical';
        const isUnread = !readNotificationIds.includes(n._id);

        return {
          id: n._id,
          title: n.title,
          description: n.message,
          date: dateStr,
          priorityLabel: isCritical ? 'Critical Priority' : 'High Priority',
          priorityLevel: isCritical ? 'critical' : 'high',
          tone: isCritical ? 'critical' : 'warning',
          tag: isRegistrar ? 'REGISTRAR' : 'DESK_OFFICER',
          applicationRef: 'SYSTEM',
          isUnread,
          icon: isCritical ? AlertTriangle : FileText,
          actionLabel: 'View Details',
        } as Notification;
      })
      .filter((n): n is Notification => n !== null);
  }, [apiNotifications, readNotificationIds, hiddenNotificationIds, isRegistrar]);

  /* -----------------------------
     STATS
  ------------------------------ */

  const stats = useMemo<DeskOfficerStats>(() => {
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
     FILTERING
  ------------------------------ */

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((n) => {
        if (activeTab === 'unread') return n.isUnread;
        if (activeTab === 'read') return !n.isUnread;
        return true;
      })
      .filter((n) => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        return (
          n.title.toLowerCase().includes(term) ||
          n.description.toLowerCase().includes(term) ||
          n.applicationRef.toLowerCase().includes(term)
        );
      });
  }, [notifications, activeTab, searchTerm]);

  /* -----------------------------
     HANDLERS
  ------------------------------ */

  const handleMarkRead = useCallback((id: string) => {
    setReadNotificationIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setHiddenNotificationIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const handleTabChange = useCallback((tab: NotificationTabKey) => {
    setActiveTab(tab);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
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
    },
    tabs,
  };
}
