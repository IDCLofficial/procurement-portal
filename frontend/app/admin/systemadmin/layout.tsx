'use client';

import { usePathname } from 'next/navigation';
import { TopBar } from '../components/general/TopBar';
import { Sidebar } from '../components/general/Sidebar';

export default function SystemAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const pathname = usePathname();

  // Map of paths to TopBar titles
  const titleMap: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/systemadmin': 'Applications',
    '/admin/systemadmin/users': 'User Management',
    '/admin/settings': 'Settings',
    '/admin/audit-logs': 'Audit Logs',
    '/admin/reports': 'Reports',
  };

  // Find title from map; fallback to a default
  const title = titleMap[pathname] || 'Admin Portal';
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <TopBar 
          title={title}
          userInitials="SA" 
          onNotificationClick={() => console.log('Notification clicked')}
          onUserMenuClick={() => console.log('User menu clicked')}
        />
        
        {/* Page content */}
        {children}
      </div>
    </div>
  );
}
