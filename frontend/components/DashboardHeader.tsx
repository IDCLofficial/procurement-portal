'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Bell, Settings, LogOut, Loader2 } from 'lucide-react';
import { FaAngleLeft } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useAuth } from './providers/public-service/AuthProvider';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';

export default function DashboardHeader({
    companyName = 'ABC Construction Ltd',
    subtitle = 'Vendor Portal',
    hasBackButton = false,
    rightButton,
    justLogout = false,
}: {
    companyName?: string;
    subtitle?: string;
    hasBackButton?: boolean;
    rightButton?: React.ReactNode;
    justLogout?: boolean;
}) {
    const { logout, logoutLoading } = useAuth();
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
                            className="h-9 w-9 text-gray-600 hover:text-gray-900 cursor-pointer"
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
                            <Link href="/dashboard/notifications" className='cursor-pointer'>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-gray-600 hover:text-gray-900 cursor-pointer"
                                    aria-label="Notifications"
                                >
                                    <Bell className="h-5 w-5" />
                                </Button>
                            </Link>

                            <Link href="/dashboard/settings" className='cursor-pointer'>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-gray-600 hover:text-gray-900 cursor-pointer"
                                    aria-label="Settings"
                                >
                                    <Settings className="h-5 w-5" />
                                </Button>
                            </Link>

                            <div className="h-6 w-px bg-gray-300 mx-1" />
                        </React.Fragment>}

                        <Dialog>
                            <DialogTrigger
                                className="h-9 px-3 font-medium cursor-pointer flex items-center border border-red-300 rounded-md text-red-600 hover:bg-red-600 hover:text-white text-sm"
                                disabled={logoutLoading}
                            >
                                {logoutLoading ? (
                                    <Loader2 className="sm:h-4 sm:w-4 h-3 w-3 mr-2 animate-spin" />
                                ) : (
                                    <LogOut className="sm:h-4 sm:w-4 h-3 w-3 mr-2" />
                                )}
                                Logout
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="rounded-full bg-red-100 p-3 border border-red-300">
                                            <LogOut className="h-6 w-6 text-red-600" />
                                        </div>
                                        <DialogTitle className='sr-only'>Logout Confirmation</DialogTitle>
                                        <div>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Are you sure you want to sign out of your account?
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row-reverse sm:justify-center sm:space-x-2 sm:space-x-reverse space-y-2 sm:space-y-0">
                                        <Button
                                            variant="destructive"
                                            className="w-full sm:w-auto flex-1 cursor-pointer"
                                            onClick={logout}
                                            disabled={logoutLoading}
                                        >
                                            {logoutLoading ? (
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : null}
                                            Yes, Logout
                                        </Button>
                                        {!logoutLoading && <DialogTrigger asChild className='flex-1 cursor-pointer'>
                                            <Button variant="outline" className="w-full sm:w-auto">
                                                Cancel
                                            </Button>
                                        </DialogTrigger>}
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
        </header>
    );
}
