'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { FaAngleLeft } from 'react-icons/fa6';

export default function Header({
    title,
    description,
    hasBackButton = false,
    rightButton,
}: {
    title: string;
    description: string;
    hasBackButton?: boolean;
    rightButton?: React.ReactNode;
}) {
    return (
        <header className="sticky top-0 z-50 border-b bg-white shadow-lg shadow-black/5">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-5">
                <div className="flex items-center gap-3">
                    {hasBackButton && (
                        <Link href="/">
                            <Button variant="ghost" className="h-10 w-10 cursor-pointer active:scale-95 transition-transform duration-300 active:rotate-2">
                                <FaAngleLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10">
                            <Image
                                src="/images/ministry-logo.png"
                                alt="Ministry Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
                            <p className="text-xs text-gray-500">{description}</p>
                        </div>
                    </div>
                </div>

                {rightButton}
            </div>
        </header>
    );
}
