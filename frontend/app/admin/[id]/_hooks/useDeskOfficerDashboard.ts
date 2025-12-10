'use client';

import { useAppSelector } from '@/app/admin/redux/hooks';
import { useNotifications } from '@/app/admin/_shared/hooks';

export interface UseDeskOfficerDashboardReturn {
  user: { id: string; name: string; email: string; role: string } | null;
  isAuthenticated: boolean;
  notifications: ReturnType<typeof useNotifications>;
}

export function useDeskOfficerDashboard(): UseDeskOfficerDashboardReturn {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const notifications = useNotifications();

  return {
    user,
    isAuthenticated,
    notifications,
  };
}
