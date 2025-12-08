'use client';

import { Bell } from 'lucide-react';
import { TopBarProps } from '@/app/admin/types';

export function TopBar({
  title,
  userInitials,
  onNotificationClick = () => {},
  onUserMenuClick = () => {},
}: TopBarProps) {
  return (
    <div className="relative z-10 shrink-0 flex h-16 bg-white border-b border-gray-200">
      <div className="flex-1 px-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <div className="ml-4 flex items-center md:ml-6">
          <button
            type="button"
            onClick={onNotificationClick}
            className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="ml-3 relative">
            <div>
              <button
                type="button"
                onClick={onUserMenuClick}
                className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">{userInitials}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
