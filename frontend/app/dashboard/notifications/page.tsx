'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NotificationStatCard from '@/components/notifications/NotificationStatCard';
import NotificationTabs from '@/components/notifications/NotificationTabs';
import NotificationCard from '@/components/notifications/NotificationCard';
import NotificationInfoBox from '@/components/notifications/NotificationInfoBox';
import {
    Bell,
    Clock,
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Search,
    Check,
    Loader2,
    Loader
} from 'lucide-react';
import SubHeader from '@/components/SubHeader';
import { useGetMyNotificationsQuery, useMarkNotificationAsReadMutation } from '@/store/api/vendor.api';
import { formatDistanceToNow } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { updateSearchParam } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import { useSelector } from 'react-redux';
import { selectNotificationData, selectNotificationError, selectNotificationLoading } from '@/store/slices/notificationsSlice';

// Helper function to get icon and styling based on priority
const getPriorityConfig = (priority: string) => {
    const priorityLower = priority.toLowerCase();
    
    if (priorityLower === 'critical' || priorityLower === 'high') {
        return {
            icon: <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><XCircle className="w-5 h-5 text-red-600" /></div>,
            badge: { text: 'Critical', variant: 'destructive' as const },
            borderColor: 'border-red-500',
        };
    } else if (priorityLower === 'medium' || priorityLower === 'warning') {
        return {
            icon: <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-yellow-600" /></div>,
            badge: { text: 'High Priority', variant: 'warning' as const },
            borderColor: 'border-yellow-500',
        };
    } else if (priorityLower === 'info' || priorityLower === 'in progress') {
        return {
            icon: <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-5 h-5 text-blue-600" /></div>,
            badge: { text: 'In Progress', variant: 'default' as const },
            borderColor: 'border-blue-500',
        };
    } else {
        return {
            icon: <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><Bell className="w-5 h-5 text-gray-600" /></div>,
            badge: { text: 'Low Priority', variant: 'default' as const },
            borderColor: 'border-gray-300',
        };
    }
};

export default function NotificationsPage() {
    const data = useSelector(selectNotificationData);
    const isLoading = useSelector(selectNotificationLoading);
    const error = useSelector(selectNotificationError);
    const searchQuery = useSearchParams().get('q') || '';
    const filter = useSearchParams().get('filter') || '';
    const [page, setPage] = useState(1);
    const notificationsRef = useRef<HTMLDivElement>(null);

    const [markNotificationAsRead, { isLoading: isMarkingNotificationAsRead }] = useMarkNotificationAsReadMutation();
    
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    
    // Fetch notifications from API
    const { refetch } = useGetMyNotificationsQuery({
        filter,
        limit: 10 * page,
        search: debouncedSearchQuery,
    });

    // Transform API data to match component format
    const notifications = useMemo(() => {
        if (!data?.notifications) return [];
        
        return data.notifications.map((notif) => {
            const priorityConfig = getPriorityConfig(notif.priority);
            const timestamp = formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true });
            
            return {
                id: notif._id,
                icon: priorityConfig.icon,
                title: notif.title,
                message: notif.message,
                timestamp,
                badge: priorityConfig.badge,
                actionLabel: notif.priority.toLowerCase() === 'critical' ? 'Take Action' : 'View Details',
                borderColor: priorityConfig.borderColor,
                isRead: notif.isRead,
                isPinned: notif.priority.toLowerCase() === 'critical', // Pin critical notifications
                category: notif.priority.toLowerCase() === 'critical' ? 'unread' : 'all',
            };
        });
    }, [data]);

    // Calculate stats
    const stats = useMemo(() => {
        const total = data?.total || 0;
        const unread = data?.totalRead || 0;
        const critical = data?.totalCritical || 0;
        const highPriority = data?.totalHigh || 0;
        const read = data?.totalUnread || 0;
        
        return { total, unread, critical, highPriority, read };
    }, [data]);

    const handleMarkAllAsRead = () => {
        if (isMarkingNotificationAsRead) return;
        markNotificationAsRead();
        refetch();
    };

    // Show loading state
    if (isLoading && !data) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading notifications...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600">Failed to load notifications</p>
                </div>
            </div>
        );
    }

    return (
        <div ref={notificationsRef} className="max-h-screen overflow-y-auto bg-gray-50">
            <SubHeader
                title='Notifications'
                hasBackButton
                rightButton ={
                    <Button
                        variant="outline"
                        onClick={handleMarkAllAsRead}
                        disabled={isMarkingNotificationAsRead}
                        className="bg-theme-green hover:bg-teal-700 text-white hover:text-white cursor-pointer"
                    >
                        {isMarkingNotificationAsRead ? <span>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                            Marking as Read...
                        </span> : <span><Check className="w-4 h-4 mr-2 inline" /> Mark All as Read</span>}
                    </Button>
                }
            />

            <div className="container mx-auto px-4 py-8 max-w-5xl h-fit">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <NotificationStatCard
                        label="Total"
                        count={stats.total}
                        icon={Bell}
                        iconColor="text-blue-600"
                        iconBgColor="bg-blue-100"
                    />
                    <NotificationStatCard
                        label="Unread"
                        count={stats.unread}
                        icon={Clock}
                        iconColor="text-orange-600"
                        iconBgColor="bg-orange-100"
                    />
                    <NotificationStatCard
                        label="Critical"
                        count={stats.critical}
                        icon={AlertCircle}
                        iconColor="text-red-600"
                        iconBgColor="bg-red-100"
                    />
                    <NotificationStatCard
                        label="High Priority"
                        count={stats.highPriority}
                        icon={AlertTriangle}
                        iconColor="text-yellow-600"
                        iconBgColor="bg-yellow-100"
                    />
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Search notifications..."
                                value={searchQuery}
                                onChange={(e) => updateSearchParam("q", e.target.value)}
                                className="pl-10 bg-white border-gray-200"
                            />
                            {searchQuery && isLoading && <Button
                                variant="ghost"
                                onClick={() => updateSearchParam("q", "")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                <Loader className="w-4 h-4 animate-spin inline" />
                            </Button>}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <NotificationTabs
                        activeTab={filter}
                        onTabChange={(filter) => updateSearchParam("filter", filter)}
                        counts={{
                            all: stats.total,
                            unread: stats.unread,
                            read: stats.read,
                        }}
                    />
                </div>

                {/* Notifications List */}
                <motion.div 
                    className="space-y-4 mb-6"
                    layout
                >
                    {notifications.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                            <p className="text-gray-600">You&apos;re all caught up! Check back later for updates.</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {notifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                >
                                    <NotificationCard
                                        {...notification}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </motion.div>

                <div className="flex justify-center">
                    {
                        isLoading ? (
                            <Button
                                variant="ghost"
                                disabled
                                className="my-6 cursor-pointer"
                            >
                                <Loader className="w-4 h-4 animate-spin inline" />
                            </Button>
                        ) : (
                            data?.pagination?.totalPages && data?.pagination?.totalPages > page ? <Button
                                variant="outline"
                                onClick={() => setPage(page + 1)}
                                className="my-6 cursor-pointer"
                            >
                                Load More
                            </Button> : <></>
                        )
                    }
                </div>

                {/* Info Box */}
                <NotificationInfoBox
                    title="Notification Tips:"
                    items={[
                        'Critical notifications require immediate attention.',
                        'You\'ll receive email notifications at each stage.',
                        'Mark notifications as read to keep your inbox organized.',
                        'Pin important notifications to keep them at the top.',
                        'Your notification settings can be customized in your profile.',
                    ]}
                />
            </div>
        </div>
    );
}
