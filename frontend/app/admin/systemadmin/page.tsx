'use client';

import { withProtectedRoute } from '@/app/admin/lib/protectedRoute';
import { useDashboard } from './_hooks';
import { WelcomeSection, NotificationList, LoadingSpinner } from './_components';

function AdminDashboard() {
  const {
    user,
    isAuthenticated,
    filteredNotifications,
    activeTab,
    searchTerm,
    stats,
    handlers,
    tabs,
  } = useDashboard();

  if (!isAuthenticated) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="flex h-screen bg-gray-50 pb-20">
      <div className="flex flex-col flex-1 overflow-hidden">
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
      </div>
    </div>
  );
}

export default withProtectedRoute(AdminDashboard, { requiredRoles: ['Admin'] });
