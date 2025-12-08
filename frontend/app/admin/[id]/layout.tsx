'use client';

import { Header, SidebarUser } from '../components/id';
import { useAppSelector } from '../redux/hooks';

interface AdminUserLayoutProps {
  children: React.ReactNode;
}

export default function AdminUserLayout({ children }: AdminUserLayoutProps) {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarUser />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <Header
          title="Dashboard"
          user={{
            name: user?.name || 'Desk Officer',
            role: user?.role || 'Staff',
          }}
          onNotificationClick={() => {}}
          onUserMenuClick={() => {}}
        />

        {/* Page content */}
        {children}
      </div>
    </div>
  );
}
