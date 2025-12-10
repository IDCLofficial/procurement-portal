import { LogOut, Home, FileText, FileCheck, Users, Settings, ClipboardList, BarChart3 } from 'lucide-react';
import Image from 'next/image';
import { NavItem } from './NavItem';

export function Sidebar() {
  return (
    <div className="hidden md:flex md:shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <Image
            src="/images/ministry-logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
          <span className="ml-2 text-lg font-semibold">BPPPI Admin</span>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavItem icon={Home} text="Dashboard" href="/admin/dashboard" active />
          <NavItem icon={FileText} text="Applications" href="/admin/applications" />
          <NavItem icon={FileCheck} text="Certificates" href="/admin/certificates" />
          <NavItem icon={Users} text="Contractor Directory" href="/admin/contractors" />
          <NavItem icon={Users} text="User Management" href="/admin/users" />
          <NavItem icon={Settings} text="Settings" href="/admin/settings" />
          <NavItem icon={ClipboardList} text="Audit Logs" href="/admin/audit-logs" />
          <NavItem icon={BarChart3} text="Reports" href="/admin/reports" />
        </nav>

        <div className="p-4 mt-auto border-t border-gray-200">
          <div className="mb-2">
            <div className="flex justify-between text-sm font-medium text-gray-700">
              <span>SLA Compliance</span>
              <span>94.2%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '94.2%' }}></div>
            </div>
          </div>
          
          <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100">
            <LogOut className="w-5 h-5 mr-2 text-gray-500" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
