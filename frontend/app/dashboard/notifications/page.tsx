'use client';

import { useState } from 'react';
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
    FileText,
    Calendar,
    DollarSign,
    CheckCircle,
    XCircle,
    RefreshCw,
    Search,
    Filter,
    Check
} from 'lucide-react';
import SubHeader from '@/components/SubHeader';

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const notifications = [
        {
            id: '1',
            icon: <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-yellow-600" /></div>,
            title: 'Document Expiring Soon',
            message: 'Your Tax Clearance Certificate (TCC) will expire on 31 December 2024. Please submit a renewed certificate to avoid suspension.',
            timestamp: '2 hours ago',
            badge: { text: 'High Priority', variant: 'warning' as const },
            actionLabel: 'Update Document',
            borderColor: 'border-yellow-500',
            isRead: false,
            isPinned: false,
            category: 'unread',
        },
        {
            id: '2',
            icon: <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><XCircle className="w-5 h-5 text-red-600" /></div>,
            title: 'Document Expired',
            message: 'Your PENCOM Compliance Certificate expired on 15 December 2024. Re-submit within 30 days to maintain your registered status.',
            timestamp: '5 hours ago',
            badge: { text: 'Critical', variant: 'destructive' as const },
            actionLabel: 'Upload Certificate',
            borderColor: 'border-red-500',
            isRead: false,
            isPinned: true,
            category: 'unread',
        },
        {
            id: '3',
            icon: <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"><Calendar className="w-5 h-5 text-yellow-600" /></div>,
            title: 'Registration Renewal Due Soon',
            message: 'Your registration will expire on 31 December 2024. Start the renewal process now to ensure uninterrupted service.',
            timestamp: '1 day ago',
            badge: { text: 'High Priority', variant: 'warning' as const },
            actionLabel: 'Start Renewal',
            borderColor: 'border-yellow-500',
            isRead: false,
            isPinned: false,
            category: 'unread',
        },
        {
            id: '4',
            icon: <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-5 h-5 text-blue-600" /></div>,
            title: 'Application Under Review',
            message: 'Your renewal application (ID: REN-2024-001) is currently being reviewed by BPPPI staff. Expected completion: 3-5 business days.',
            timestamp: '2 days ago',
            badge: { text: 'In Progress', variant: 'default' as const },
            actionLabel: 'View Status',
            borderColor: 'border-blue-500',
            isRead: true,
            isPinned: false,
            category: 'all',
        },
        {
            id: '5',
            icon: <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-gray-600" /></div>,
            title: 'Payment Received',
            message: 'Payment of ₦180,000 for renewal (PAY-2024-001) has been received. Receipt is now available for download.',
            timestamp: '3 days ago',
            badge: { text: 'Confirmed', variant: 'success' as const },
            actionLabel: 'View Receipt',
            borderColor: 'border-gray-300',
            isRead: true,
            isPinned: false,
            category: 'all',
        },
        {
            id: '6',
            icon: <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"><DollarSign className="w-5 h-5 text-yellow-600" /></div>,
            title: 'PENCOM Compliance Required',
            message: 'Submit your PENCOM compliance certificate for verification. Failure to comply may result in suspension of your registration.',
            timestamp: '5 days ago',
            badge: { text: 'High Priority', variant: 'warning' as const },
            actionLabel: 'Request Now',
            borderColor: 'border-yellow-500',
            isRead: true,
            isPinned: false,
            category: 'all',
        },
        {
            id: '7',
            icon: <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><RefreshCw className="w-5 h-5 text-blue-600" /></div>,
            title: 'Profile Update Confirmed',
            message: 'Your company profile changes have been successfully updated and verified by our team.',
            timestamp: '1 week ago',
            badge: { text: 'Confirmed', variant: 'success' as const },
            borderColor: 'border-blue-500',
            isRead: true,
            isPinned: false,
            category: 'all',
        },
        {
            id: '8',
            icon: <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><FileText className="w-5 h-5 text-gray-600" /></div>,
            title: 'Document Verified',
            message: 'Your ITF Certificate has been verified. No further action required.',
            timestamp: '1 week ago',
            badge: { text: 'Verified', variant: 'success' as const },
            actionLabel: 'View Document',
            borderColor: 'border-gray-300',
            isRead: true,
            isPinned: false,
            category: 'all',
        },
        {
            id: '9',
            icon: <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-5 h-5 text-blue-600" /></div>,
            title: 'Profile Update Confirmed',
            message: 'Your company profile changes have been successfully updated and verified by our team.',
            timestamp: '2 weeks ago',
            badge: { text: 'Confirmed', variant: 'success' as const },
            borderColor: 'border-blue-500',
            isRead: true,
            isPinned: false,
            category: 'team',
        },
        {
            id: '10',
            icon: <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><Bell className="w-5 h-5 text-gray-600" /></div>,
            title: 'Notification Test',
            message: 'Contact our help center for assistance with your registration or renewal process.',
            timestamp: '3 weeks ago',
            badge: { text: 'Low Priority', variant: 'default' as const },
            borderColor: 'border-gray-300',
            isRead: true,
            isPinned: false,
            category: 'team',
        },
    ];

    const filteredNotifications = notifications.filter((notif) => {
        if (activeTab === 'unread') return !notif.isRead;
        if (activeTab === 'team') return notif.category === 'team';
        return true;
    });

    const handleMarkAsRead = (id: string) => {
        console.log('Mark as read:', id);
    };

    const handleDelete = (id: string) => {
        console.log('Delete notification:', id);
    };

    const handleAction = (id: string) => {
        console.log('Action clicked:', id);
    };

    const handleMarkAllAsRead = () => {
        console.log('Mark all as read');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <SubHeader
                title='Notifications'
                hasBackButton
                rightButton ={
                    <Button
                        variant="outline"
                        onClick={handleMarkAllAsRead}
                        className="bg-teal-600 hover:bg-teal-700 text-white hover:text-white"
                    >
                        <Check className="w-4 h-4 mr-2" />
                        <span>Mark All as Read</span>
                    </Button>
                }
            />

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <NotificationStatCard
                        label="Total"
                        count={10}
                        icon={Bell}
                        iconColor="text-blue-600"
                        iconBgColor="bg-blue-100"
                    />
                    <NotificationStatCard
                        label="Unread"
                        count={3}
                        icon={Clock}
                        iconColor="text-orange-600"
                        iconBgColor="bg-orange-100"
                    />
                    <NotificationStatCard
                        label="Critical"
                        count={1}
                        icon={AlertCircle}
                        iconColor="text-red-600"
                        iconBgColor="bg-red-100"
                    />
                    <NotificationStatCard
                        label="High Priority"
                        count={2}
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
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white border-gray-200"
                            />
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter className="w-4 h-4" />
                            Filter
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <NotificationTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        counts={{
                            all: 10,
                            unread: 3,
                            team: 2,
                        }}
                    />
                </div>

                {/* Notifications List */}
                <motion.div 
                    className="space-y-4 mb-6"
                    layout
                >
                    <AnimatePresence mode="popLayout">
                        {filteredNotifications.map((notification) => (
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
                                    onMarkAsRead={handleMarkAsRead}
                                    onDelete={handleDelete}
                                    onAction={handleAction}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

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
