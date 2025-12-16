'use client';

import { withProtectedRoute } from '@/app/admin/lib/protectedRoute';
import { useDeskOfficerDashboard } from './_hooks';
import {
  WelcomeSection,
  NotificationList,
  LoadingSpinner,
} from '@/app/admin/_shared';

function DeskOfficerDashboard() {
  const { user, isAuthenticated, notifications } = useDeskOfficerDashboard();

  if (!isAuthenticated) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <WelcomeSection userName={user?.name} />

      <NotificationList
        notifications={notifications.filteredNotifications}
        stats={notifications.stats}
        tabs={notifications.tabs}
        activeTab={notifications.activeTab}
        searchTerm={notifications.searchTerm}
        onTabChange={notifications.handlers.handleTabChange}
        onSearchChange={notifications.handlers.handleSearchChange}
        onMarkRead={notifications.handlers.handleMarkRead}
        onDelete={notifications.handlers.handleDelete}
      />
    </main>
  );
}

export default withProtectedRoute(DeskOfficerDashboard);
