'use client';

import { withProtectedRoute } from '@/app/admin/lib/protectedRoute';
import { useDashboard } from './_hooks';
import { WelcomeSection, NotificationList, LoadingSpinner } from './_components';
import { Pagination } from '../components/general/Pagination';

function AdminDashboard() {
  const {
    user,
    isAuthenticated,
    filteredNotifications,
    activeTab,
    searchTerm,
    page,
    limit,
    totalNotifications,
    stats,
    isFetching,
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
          <div className="space-y-4">
            {isFetching ? (
              <div className="flex justify-center items-center p-8">
                <div className="loader"></div>
              </div>
            ) : (
              <>
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
                {totalNotifications > 0 && (
                  <div className="mt-4">
                    <Pagination
                      total={totalNotifications}
                      page={page}
                      limit={limit}
                      onPageChange={handlers.handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default withProtectedRoute(AdminDashboard, { requiredRoles: ['Admin'] });
