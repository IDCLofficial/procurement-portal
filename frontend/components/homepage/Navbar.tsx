'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { name: 'HOME', href: '/' },
        { name: 'ABOUT', href: '/about' },
        { name: 'E-PORTAL', href: '/e-procurement' },
    ];

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center space-x-3">
                        <Image 
                            src="/images/ministry-logo.png" 
                            alt="BPPPI Logo" 
                            width={50} 
                            height={50}
                            className="object-contain"
                        />
                        <div className="hidden md:block">
                            <h1 className="text-sm font-bold text-gray-900 leading-tight">
                                Bureau of Public Procurement
                            </h1>
                            <p className="text-xs text-gray-600">& Price Intelligence - Imo State</p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-sm font-semibold transition-colors duration-200 relative group ${
                                        isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'
                                    }`}
                                >
                                    {link.name}
                                    <span className={`absolute bottom-0 left-0 h-0.5 bg-green-600 transition-all duration-200 group-hover:w-full`}>
                                    </span>
                                </Link>
                            );
                        })}
                        <Link
                            href="/vendor-login"
                            className="px-6 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors duration-200"
                        >
                            Vendor Login
                        </Link>
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-700 hover:text-green-600 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-4 pt-2 pb-4 space-y-3">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-3 py-2 text-base font-semibold rounded-md transition-colors duration-200 ${
                                        isActive ? 'text-green-600 bg-green-50' : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                        <Link
                            href="/vendor-login"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-2 text-center bg-green-600 text-white text-base font-semibold rounded-md hover:bg-green-700 transition-colors duration-200"
                        >
                            Vendor Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
