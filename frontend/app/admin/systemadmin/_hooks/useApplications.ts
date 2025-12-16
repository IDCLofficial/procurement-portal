'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useGetApplicationsQuery } from '@/app/admin/redux/services/appApi';
import { useGetSlaConfigQuery } from '@/app/admin/redux/services/settingsApi';
import { computeApplicationSla } from '@/app/admin/utils/sla';
import { useAppDispatch } from '@/app/admin/redux/hooks';
import { setSlaConfig } from '@/app/admin/redux/slice/slaConfigSlice';
import { APPLICATION_TAB_FILTERS, type ApplicationTabId } from '../_constants';
import type { Application, StatItem } from '@/app/admin/types';

export interface UseApplicationsReturn {
  // State
  activeTab: string;
  searchQuery: string;
  currentPage: number;
  
  // Data
  applications: Application[];
  totalApplications: number;
  stats: StatItem[];
  
  // Loading states
  isLoading: boolean;
  isFetching: boolean;
  error: unknown;
  
  // Pagination
  page: number;
  limit: number;
  
  // Handlers
  handleTabChange: (tabName: string) => void;
  handleSearch: (query: string) => void;
  handlePageChange: (page: number) => void;
  refetch: () => void;
}

const DEFAULT_LIMIT = 20;

export function useApplications(): UseApplicationsReturn {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: slaConfig } = useGetSlaConfigQuery();

  useEffect(() => {
    if (slaConfig) {
      dispatch(setSlaConfig(slaConfig));
    }
  }, [slaConfig, dispatch]);

  // Determine status/type filter based on active tab
  const { statusFilter, typeFilter } = useMemo(() => {
    const tabKey = activeTab.toLowerCase() as Lowercase<ApplicationTabId>;
    return APPLICATION_TAB_FILTERS[tabKey] ?? { statusFilter: undefined, typeFilter: undefined };
  }, [activeTab]);

  // Fetch applications with query parameters
  const {
    data: applicationsResponse,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetApplicationsQuery({
    status: statusFilter,
    type: typeFilter,
    page: currentPage,
    limit: DEFAULT_LIMIT,
  });

  const applications = useMemo(
    () => {
      const base = applicationsResponse?.applications || [];
      if (!slaConfig) return base;

      return base.map((app) => {
        const metrics = computeApplicationSla(app, slaConfig);
        return {
          ...app,
          slaStatus: metrics.overdue ? 'Overdue' : 'On Track',
        };
      });
    },
    [applicationsResponse?.applications, slaConfig]
  );
  const totalApplications = applicationsResponse?.total || 0;
  const pageFromApi = applicationsResponse?.page || currentPage;
  const limitFromApi = applicationsResponse?.limit || DEFAULT_LIMIT;

  // Calculate stats from the applications data
  const stats = useMemo<StatItem[]>(() => {
    const pendingCount = applications.filter((app: Application) =>
      ['Pending Desk Review', 'Pending Review', 'Under Review'].includes(app.currentStatus || '')
    ).length;
    
    const completedCount = applications.filter(
      (app: Application) => app.currentStatus === 'Approved'
    ).length;
    
    const slaBreachCount = applications.filter(
      (app: Application) => app.currentStatus === 'SLA Breach'
    ).length;

    return [
      {
        id: 1,
        name: 'Total Applications',
        value: totalApplications.toString(),
        icon: FileText,
        change: '+12%',
        changeType: 'increase' as const,
      },
      {
        id: 2,
        name: 'Pending Review',
        value: pendingCount.toString(),
        icon: Clock,
        change: '+2%',
        changeType: 'increase' as const,
      },
      {
        id: 3,
        name: 'Completed',
        value: completedCount.toString(),
        icon: CheckCircle,
        change: '+5%',
        changeType: 'increase' as const,
      },
      {
        id: 4,
        name: 'SLA Breaches',
        value: slaBreachCount.toString(),
        icon: AlertCircle,
        change: '-1%',
        changeType: 'decrease' as const,
      },
    ];
  }, [applications, totalApplications]);

  // Handlers
  const handleTabChange = useCallback((tabName: string) => {
    setActiveTab(tabName);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    activeTab,
    searchQuery,
    currentPage,
    applications,
    totalApplications,
    stats,
    isLoading,
    isFetching,
    error,
    page: pageFromApi,
    limit: limitFromApi,
    handleTabChange,
    handleSearch,
    handlePageChange,
    refetch,
  };
}
