'use client';

import { useState, useMemo } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Application } from '@/app/admin/types';
import { InfoCards } from '@/app/admin/components/general/InfoCards';
import { StatItem } from '@/app/admin/types';
import { SearchBar } from '@/app/admin/components/general/SearchBar';
import { TabNavigation } from '@/app/admin/components/general/TabNavigation';
import { ApplicationsTable } from '@/app/admin/components/general/ApplicationsTable';
import { useGetApplicationsQuery } from '@/app/admin/redux/services/appApi';

export default function SystemAdminApplications() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  // Determine status/type filter based on active tab
  const { statusFilter, typeFilter } = useMemo(() => {
    switch (activeTab.toLowerCase()) {
      case 'new':
        return { statusFilter: undefined, typeFilter: 'New' };
      case 'renewals':
        return { statusFilter: undefined, typeFilter: 'renewal' };
      case 'desk':
        return { statusFilter: 'Pending Desk Review', typeFilter: undefined };
      case 'clarifications':
        return { statusFilter: 'Clarification Requested', typeFilter: undefined };
      case 'registrar':
        return { statusFilter: 'Forwarded to Registrar', typeFilter: undefined };
      case 'completed':
        return { statusFilter: 'Approved', typeFilter: undefined };
      case 'sla':
        return { statusFilter: 'sla_breach', typeFilter: undefined };
      default:
        return { statusFilter: undefined, typeFilter: undefined };
    }
  }, [activeTab]);

  // Fetch applications with query parameters
  const { 
    data: applicationsResponse, 
    error, 
    isLoading, 
    isFetching,
    refetch 
  } = useGetApplicationsQuery({
    status: statusFilter,
    type: typeFilter,
    page: currentPage,
    limit: limit
  });

  const applications = applicationsResponse?.applications || [];
  const totalApplications = applicationsResponse?.total || 0;
  const currentPageFromApi = applicationsResponse?.page || currentPage;
  const limitFromApi = applicationsResponse?.limit || limit;
  console.log(applications);

  // Calculate stats from the applications data
  const stats: StatItem[] = useMemo(() => {
    const totalCount = totalApplications;
    const pendingCount = applications.filter((app: Application) => 
      ['Pending Desk Review', 'Pending Review', 'Under Review'].includes(app.currentStatus)
    ).length;
    const completedCount = applications.filter((app: Application) => 
      app.currentStatus === 'Approved'
    ).length;
    const slaBreachCount = applications.filter((app: Application) => 
      app.currentStatus === 'SLA Breach'
    ).length;

    return [
      { id: 1, name: 'Total Applications', value: totalCount.toString(), icon: FileText, change: '+12%', changeType: 'increase' as const },
      { id: 2, name: 'Pending Review', value: pendingCount.toString(), icon: Clock, change: '+2%', changeType: 'increase' as const },
      { id: 3, name: 'Completed', value: completedCount.toString(), icon: CheckCircle, change: '+5%', changeType: 'increase' as const },
      { id: 4, name: 'SLA Breaches', value: slaBreachCount.toString(), icon: AlertCircle, change: '-1%', changeType: 'decrease' as const },
    ];
  }, [applications, totalApplications]);

  // Handle tab change
  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
    setCurrentPage(1); // Reset to first page when changing tab
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <main className="flex-1 overflow-y-auto focus:outline-none">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <h2 className="text-sm font-medium text-[#718096]">Manage contractor applications across all stages</h2>
          </div>

          {/* Info cards */}
          <InfoCards stats={stats} />

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="w-full sm:max-w-md">
              <SearchBar onSearch={handleSearch} />
            </div>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                Error loading applications. <button onClick={() => refetch()} className="underline">Retry</button>
              </div>
            )}
          </div>

          {/* Tab navigation */}
          <div className="mt-6">
            <TabNavigation 
              tabs={[
                { name: 'All',           count: !isLoading && !isFetching && activeTab === 'All'           ? totalApplications : undefined, current: activeTab === 'All' },
                { name: 'New',           count: !isLoading && !isFetching && activeTab === 'New'           ? totalApplications : undefined, current: activeTab === 'New' },
                { name: 'Renewals',      count: !isLoading && !isFetching && activeTab === 'Renewals'      ? totalApplications : undefined, current: activeTab === 'Renewals' },
                { name: 'Desk',          count: !isLoading && !isFetching && activeTab === 'Desk'          ? totalApplications : undefined, current: activeTab === 'Desk' },
                { name: 'Clarifications',count: !isLoading && !isFetching && activeTab === 'Clarifications'? totalApplications : undefined, current: activeTab === 'Clarifications' },
                { name: 'Registrar',     count: !isLoading && !isFetching && activeTab === 'Registrar'     ? totalApplications : undefined, current: activeTab === 'Registrar' },
                { name: 'Completed',     count: !isLoading && !isFetching && activeTab === 'Completed'     ? totalApplications : undefined, current: activeTab === 'Completed' },
                { name: 'SLA',           count: !isLoading && !isFetching && activeTab === 'SLA'           ? totalApplications : undefined, current: activeTab === 'SLA' },
              ]}
              onTabChange={handleTabChange}
            />
          </div>

          {/* Application list */}
          <div className="mt-6">
            {isLoading || isFetching ? (
              <div className="flex justify-center items-center py-12">

                <span className='loader'></span>
              </div>
            ) : (
              <ApplicationsTable 
                applications={applications} 
                isLoading={isFetching}
                total={totalApplications}
                page={currentPageFromApi}
                limit={limitFromApi}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}