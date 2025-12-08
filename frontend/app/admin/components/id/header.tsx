"use client";

import { Bell, ChevronDown, UserCircle2 } from "lucide-react";
import { ReactNode } from "react";

interface HeaderProps {
  /**
   * Title to display in the header
   */
  title: string;
  /**
   * User information to display in the header
   */
  user: {
    name: string;
    role?: string;
    avatar?: ReactNode;
  };
  /**
   * Callback when notification bell is clicked
   */
  onNotificationClick?: () => void;
  /**
   * Callback when user menu is clicked
   */
  onUserMenuClick?: () => void;
}

export default function Header({
  title = 'Dashboard',
  user = { name: 'System Admin' },
  onNotificationClick,
  onUserMenuClick,
}: HeaderProps) {
  const { name, role, avatar } = user;
  
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>

        <div className="flex items-center space-x-4">
          <button 
            onClick={onNotificationClick}
            className="p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
          </button>

          <div className="relative">
            <button 
              onClick={onUserMenuClick}
              className="flex items-center space-x-2"
              aria-label="User menu"
            >
              {avatar || <UserCircle2 className="w-8 h-8 text-gray-400" />}
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">{name}</p>
                {role && <p className="text-xs text-gray-500">{role}</p>}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
