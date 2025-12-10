'use client';

import { Button } from './ui/button';
import { FaAngleLeft } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SubHeader({
    title,
    hasBackButton = false,
    rightButton,
    subtitle,
}: {
    title: string;
    hasBackButton?: boolean;
    rightButton?: React.ReactNode;
    subtitle?: string;
}) {
    const router = useRouter();

    return (
        <header className="sticky top-0 z-50 border-b bg-white shadow-lg shadow-black/5">
            <div className="container mx-auto px-4 py-4">
                <div className={cn("grid grid-cols-2 items-center gap-4", {
                    "md:grid-cols-3": hasBackButton || rightButton,
                })}>
                    {/* Left Section - Back Button */}
                    <div className="flex items-center justify-start">
                        {hasBackButton && (
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 h-10 px-3 cursor-pointer hover:bg-gray-100 rounded-md active:scale-95 transition-all duration-200"
                                onClick={() => router.push("/dashboard")}
                            >
                                <FaAngleLeft className="h-4 w-4 shrink-0" />
                                <span className="hidden sm:inline text-sm font-medium">
                                    Back to Dashboard
                                </span>
                            </Button>
                        )}
                    </div>

                    {/* Center Section - Title */}
                    <div className={cn("flex justify-center items-center flex-col", {
                        "text-right": hasBackButton || rightButton,
                    })}>
                        <h1 className="text-base sm:text-lg font-semibold text-gray-900 text-center">
                            {title}
                        </h1>
                        <p className="md:text-sm text-xs text-gray-600">{subtitle}</p>
                    </div>

                    {/* Right Section - Optional Button */}
                    <div className="flex items-center justify-end">
                        {rightButton}
                    </div>
                </div>
            </div>
        </header>
    );
}