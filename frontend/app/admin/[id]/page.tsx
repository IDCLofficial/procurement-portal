'use client';

import { withProtectedRoute } from '@/app/admin/lib/protectedRoute';
import { useDeskOfficerDashboard } from './_hooks';
import {
  WelcomeSection,
  NotificationList,
  LoadingSpinner,
} from '@/app/admin/_shared';

function DeskOfficerDashboard() {
  const { 
    user, 
    isAuthenticated, 
    filteredNotifications,
    stats,
    tabs,
    activeTab,
    searchTerm,
    handlers,
  } = useDeskOfficerDashboard();

  if (!isAuthenticated) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <WelcomeSection userName={user?.name} />

      <NotificationList
        notifications={filteredNotifications}
        stats={stats}
        tabs={tabs}
        activeTab={activeTab}
        searchTerm={searchTerm}
        onTabChange={handlers.handleTabChange}
        onSearchChange={handlers.handleSearchChange}
        onMarkRead={handlers.handleMarkRead}
        onDelete={handlers.handleDelete}
      />
    </main>
  );
}

export default withProtectedRoute(DeskOfficerDashboard);
