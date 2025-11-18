'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Bell, Settings, LogOut } from 'lucide-react';
import { FaAngleLeft } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function DashboardHeader({
    companyName = 'ABC Construction Ltd',
    subtitle = 'Vendor Portal',
    hasBackButton = false,
    rightButton,
    onLogout,
    justLogout = false,
}: {
    companyName?: string;
    subtitle?: string;
    hasBackButton?: boolean;
    rightButton?: React.ReactNode;
    onLogout?: () => void;
    justLogout?: boolean;
}) {
    const router = useRouter();
    return (
        <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Left side - Logo and Company Info */}
                <div className="flex items-center gap-3">
                    {hasBackButton && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-gray-600 hover:text-gray-900"
                            onClick={() => router.back()}
                            aria-label="Go back"
                        >
                            <FaAngleLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <div className="relative w-10 h-10">
                        <Link href="/dashboard">
                            <Image
                                src="/images/ministry-logo.png"
                                alt="Ministry Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </div>
                    <div>
                        <h1 className="text-base font-semibold text-gray-900">{companyName}</h1>
                        <p className="text-xs text-gray-500">{subtitle}</p>
                    </div>
                </div>

                {/* Right side - Custom content or default logout */}
                {rightButton || (
                    <div className="flex items-center gap-2">
                        {!justLogout && <React.Fragment>
                            <Link href="/dashboard/notifications">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-gray-600 hover:text-gray-900"
                                    aria-label="Notifications"
                                >
                                    <Bell className="h-5 w-5" />
                                </Button>
                            </Link>
                            
                            <Link href="/dashboard/settings">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-gray-600 hover:text-gray-900"
                                    aria-label="Settings"
                                >
                                    <Settings className="h-5 w-5" />
                                </Button>
                            </Link>
                        
                            <div className="h-6 w-px bg-gray-300 mx-1" />
                        </React.Fragment>}

                        <Button
                            variant="ghost"
                            className="h-9 px-3 text-gray-700 hover:text-gray-900 font-medium"
                            onClick={onLogout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
