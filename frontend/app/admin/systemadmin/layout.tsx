'use client';

import { usePathname } from 'next/navigation';
import { TopBar } from '../components/general/TopBar';
import { Sidebar } from './_components/Sidebar';
import { TITLE_MAP } from './_constants';
import { useGetApplicationsQuery } from '../redux/services/appApi';

interface SystemAdminLayoutProps {
  children: React.ReactNode;
}

export default function SystemAdminLayout({ children }: SystemAdminLayoutProps) {
  const pathname = usePathname();
  const title = TITLE_MAP[pathname] || 'Admin Portal';

  // Uses cached data if already fetched elsewhere, no duplicate request
  const { applicationCount } = useGetApplicationsQuery({}, {
    selectFromResult: ({ data }) => ({
      applicationCount: data?.total ?? 0,
    }),
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:shrink-0">
        <Sidebar applicationCount={applicationCount} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <TopBar
          title={title}
          userInitials="SA"
          onNotificationClick={() => {}}
          onUserMenuClick={() => {}}
        />

        {/* Page content */}
        {children}
      </div>
    </div>
  );
}
