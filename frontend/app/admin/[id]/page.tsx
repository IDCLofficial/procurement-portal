"use client";

import { useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import Header from '../components/id/header';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Lucide Icons
import {
  Home,
  FileText,
  FileCheck,
  Users,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  XCircle,
  ArrowUpCircle,
  DollarSign,
  Bell,
  ChevronDown,
  UserCircle2,
  ArrowUpRight,
  RefreshCw,
  Search,
  FileSearch,
  ClipboardList,
  BarChart3,
  LogOut,
  FileArchive,
  AlertCircle,
  ArrowUp,
  ArrowDownRight,
  FileQuestion,
  FileClock,
  PlusCircle,
  Upload,
} from 'lucide-react';
import SidebarUser from '../components/id/sidebar';
import { useAppSelector } from '../redux/hooks';
import NotificationSummaryRow from '../components/id/notification-summary-row';
import NotificationToolbar from '../components/id/notification-toolbar';
import NotificationTabs from '../components/id/notification-tabs';
import NotificationCard from '../components/id/notification-card';


type NotificationTone = "info" | "warning" | "critical";
type NotificationPriority = "high" | "critical";

interface Notification {
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

const INITIAL_NOTIFICATIONS: Notification[] = [
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

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  console.log("user: ", user)
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [searchTerm, setSearchTerm] = useState("");

  if (!isAuthenticated) {
    // Optionally redirect to login
    return <div>Loading...</div>;
  }

  // Mock data - replace with actual data from your API
  const stats = [
    { name: 'Total Contractors', value: '1,234', icon: Users, change: '+12%', changeType: 'increase' },
    { name: 'In Progress', value: '47', subValue: '18 desk - 12 registrar', icon: Clock, change: '+5%', changeType: 'increase' },
    { name: 'SLA Compliance', value: '94.2%', icon: ArrowUpCircle, change: '+2.1%', changeType: 'increase' },
    { name: 'SLA Breaches', value: '1', description: 'Requires immediate attention', icon: AlertTriangle, change: '-1', changeType: 'decrease' },
  ];

  const metrics = [
    { name: 'Approved This Month', value: '34', icon: CheckCircle2, change: '+12%', changeType: 'increase' },
    { name: 'Rejected This Month', value: '2', icon: XCircle, change: '-1', changeType: 'decrease' },
    { name: 'Avg. Processing Time', value: '6.5 days', icon: Clock, change: '-0.5 days', changeType: 'increase' },
    { name: 'Revenue (MTD)', value: '₦45.7M', icon: DollarSign, change: '+8.2%', changeType: 'increase' },
  ];

  const quickActions = [
    { name: 'Review New Applications', count: 10, icon: FileSearch },
    { name: 'Clarifications', count: 1, icon: RefreshCw },
    { name: 'SLA Breaches', count: 1, icon: AlertCircle },
    { name: 'Audit Logs', icon: FileText },
  ];

  const totalCount = notifications.length;
  const unreadCount = notifications.filter((notification) => notification.isUnread).length;
  const criticalCount = notifications.filter(
    (notification) => notification.priorityLevel === 'critical'
  ).length;
  const highPriorityCount = notifications.filter(
    (notification) => notification.priorityLevel === 'high'
  ).length;

  const filteredNotifications = notifications
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

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, isUnread: false } : notification
      )
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  // ... rest of the component remains the same until the return statement

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
      {/* Welcome Section */}
      <div className="mb-8 bg-[#04785733] p-6 rounded-md">
        <h2 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.name || "Admin"}! 👋</h2>
        <p className="text-gray-600 mt-1">Here's what's happening with your dashboard today.</p>
      </div>

      {/* Stats Grid */}
      <div className="space-y-6">
        <NotificationSummaryRow
          total={totalCount}
          unread={unreadCount}
          critical={criticalCount}
          highPriority={highPriorityCount}
        />

        <div className="space-y-3 pt-6">
          <NotificationToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onFilterClick={() => console.log('Filter clicked')}
          />
          <NotificationTabs
            tabs={[
              { key: 'all', label: 'All', count: totalCount },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'read', label: 'Read', count: totalCount - unreadCount },
            ]}
            activeKey={activeTab}
            onTabChange={(key) => setActiveTab(key as 'all' | 'unread' | 'read')}
          />
        </div>

        <div className="space-y-4 pt-4">
          {filteredNotifications.map((notification) => (
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
              onPrimaryAction={() =>
                console.log('Primary action clicked for', notification.id)
              }
              onMarkRead={() => handleMarkRead(notification.id)}
              onDelete={() => handleDelete(notification.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
