'use client';

import { InfoCards } from '@/app/admin/components/general/InfoCards';
import { SearchBar } from '@/app/admin/components/general/SearchBar';
import { TabNavigation } from '@/app/admin/components/general/TabNavigation';
import { ApplicationsTable } from '@/app/admin/components/general/ApplicationsTable';
import { useApplications } from '../_hooks';
import { LoadingSpinner } from '../_components';
import { APPLICATION_TABS } from '../_constants';

export default function SystemAdminApplications() {
  const {
    activeTab,
    applications,
    totalApplications,
    stats,
    isLoading,
    isFetching,
    error,
    page,
    limit,
    handleTabChange,
    handleSearch,
    handlePageChange,
    refetch,
  } = useApplications();

  // Build tabs with counts
  const tabs = APPLICATION_TABS.map((tabName) => ({
    name: tabName,
    count: !isLoading && !isFetching && activeTab === tabName ? totalApplications : undefined,
    current: activeTab === tabName,
  }));

  return (
    <main className="flex-1 overflow-y-auto focus:outline-none">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <h2 className="text-sm font-medium text-[#718096]">
              Manage contractor applications across all stages
            </h2>
          </div>

          <InfoCards stats={stats} />

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="w-full sm:max-w-md">
              <SearchBar onSearch={handleSearch} />
            </div>
            {error ? (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                Error loading applications.{' '}
                <button onClick={() => refetch()} className="underline">
                  Retry
                </button>
              </div>
            ) : null}
          </div>

          <div className="mt-6">
            <TabNavigation tabs={tabs} onTabChange={handleTabChange} />
          </div>

          <div className="mt-6">
            {isLoading || isFetching ? (
              <LoadingSpinner />
            ) : (
              <ApplicationsTable
                applications={applications}
                isLoading={isFetching}
                total={totalApplications}
                page={page}
                limit={limit}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
