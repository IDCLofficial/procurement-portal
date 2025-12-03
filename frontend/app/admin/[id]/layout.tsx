"use client";

import Header from "../components/id/header";
import SidebarUser from "../components/id/sidebar";
import { useAppSelector } from "../redux/hooks";

export default function AdminUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarUser />
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <Header
          title="Admin Dashboard"
          user={{
            name: user?.name || "desk officer",
            role: user?.role || "administrator",
          }}
          onNotificationClick={() => console.log("Notifications clicked")}
          onUserMenuClick={() => console.log("User menu clicked")}
        />

        {/* Page content */}
        {children}
      </div>
    </div>
  );
}
