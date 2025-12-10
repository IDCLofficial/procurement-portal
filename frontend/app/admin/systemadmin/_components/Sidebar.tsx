'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Home, FileText, Users, Settings, LogOut } from 'lucide-react';
import { useLogout } from '@/app/admin/hooks/useLogout';
import { ConfirmationDialog } from '@/app/admin/components/general/confirmation-dialog';

export function Sidebar() {
    const pathname = usePathname();
    const handleLogout = useLogout();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const NavList = [
        {
            href: "/admin/systemadmin",
            icon: Home,
            label: "Dashboard",
        },
        {
            href: "/admin/systemadmin/applications",
            icon: FileText,
            label: "Applications",
        },
        {
            href: "/admin/systemadmin/users",
            icon: Users,
            label: "User Management",
        },
         {
            href: "/admin/systemadmin/certificates",
            icon: Users,
            label: "Certificates",
        },
        {
            href: "/admin/systemadmin/settings",
            icon: Settings,
            label: "Settings",
        },
        // {
        //     href: "/admin/systemadmin/audit-logs",
        //     icon: FileSearch,
        //     label: "Audit Logs",
        // },
        // {
        //     href: "/admin/systemadmin/reports",
        //     icon: BarChart2,
        //     label: "Reports",
        // },
    ];

    return (
        <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
            <div className='flex px-4 py-6 gap-2'>
                <div>
                    <Image 
                        src="/images/ministry-logo.png" 
                        alt="Logo" 
                        width={50} 
                        height={50} 
                    />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-[#0A0A0A]">BPPPI</h1>
                    <h1 className="text-sm font-bold text-[#717182]">Admin Portal</h1>
                </div>
            </div>

            <nav className="flex-1 px-4 py-2">
                <ul className="space-y-2">
                    {NavList.map(({ href, icon: Icon, label }) => {
                        const isActive = pathname === href || 
                                      (href !== '/' && pathname.endsWith(href));
                        
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={`flex items-center p-2 ${
                                        isActive 
                                            ? 'custom-green text-white font-medium' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                    } rounded-lg transition-colors`}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    <span className="flex-1">{label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <div className="mb-4">
                    <div className="flex justify-between text-sm font-medium mb-1">
                        <span>SLA Compliance</span>
                        <span>94.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: '94.2%' }} 
                        />
                    </div>
                </div>
                <button 
                    className="w-full flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => {
                        setLogoutDialogOpen(true);
                    }}
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                </button>
                <ConfirmationDialog
                    isOpen={logoutDialogOpen}
                    onClose={() => setLogoutDialogOpen(false)}
                    onConfirm={() => {
                        setLogoutDialogOpen(false);
                        handleLogout();
                    }}
                    title="Are you sure you want to quit?"
                    description="You will be logged out of the admin portal."
                    confirmText="Logout"
                    cancelText="Cancel"
                    variant="destructive"
                />
            </div>
        </div>
    );
}