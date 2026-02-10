'use client';

import { Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function OfficeHours() {
    const [officeStatus, setOfficeStatus] = useState<{ isOpen: boolean; message: string }>({
        isOpen: false,
        message: 'Checking...'
    });

    useEffect(() => {
        const checkOfficeStatus = () => {
            const now = new Date();
            const day = now.getDay();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const currentTime = hours + minutes / 60;

            const isWeekday = day >= 1 && day <= 5;
            const openTime = 8;
            const closeTime = 16;
            const isWithinHours = currentTime >= openTime && currentTime < closeTime;

            if (isWeekday && isWithinHours) {
                setOfficeStatus({
                    isOpen: true,
                    message: '🟢 OFFICE OPEN NOW'
                });
            } else if (isWeekday && currentTime < openTime) {
                setOfficeStatus({
                    isOpen: false,
                    message: '🔴 OFFICE CLOSED - Opens at 8:00 AM'
                });
            } else if (isWeekday && currentTime >= closeTime) {
                setOfficeStatus({
                    isOpen: false,
                    message: '🔴 OFFICE CLOSED - Opens Tomorrow at 8:00 AM'
                });
            } else {
                setOfficeStatus({
                    isOpen: false,
                    message: '🔴 OFFICE CLOSED - Opens Monday at 8:00 AM'
                });
            }
        };

        checkOfficeStatus();
        const interval = setInterval(checkOfficeStatus, 60000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-green-600 text-white py-3 overflow-hidden sticky top-20 z-40">
            <div className="relative flex">
                <div className="animate-scroll flex items-center whitespace-nowrap">
                    <div className="flex items-center space-x-2 mx-8 bg-white/20 px-4 py-1 rounded-full">
                        <span className="font-bold text-sm">{officeStatus.message}</span>
                    </div>
                    <span className="mx-8">|</span>
                    <div className="flex items-center space-x-2 mx-8">
                        <Clock className="h-4 w-4" />
                        <span className="font-semibold">Office Hours:</span>
                        <span>Monday - Friday: 8:00 AM - 4:00 PM</span>
                    </div>
                    <span className="mx-8">|</span>
                    <div className="flex items-center space-x-2 mx-8">
                        <span className="font-semibold">Contact:</span>
                        <span>bpppiimostatedueprocess@gmail.com</span>
                    </div>
                    <span className="mx-8">|</span>
                    <div className="flex items-center space-x-2 mx-8">
                        <span className="font-semibold">Phone:</span>
                        <span>+234 (0) 803 XXX XXXX</span>
                    </div>
                    <span className="mx-8">|</span>
                    <div className="flex items-center space-x-2 mx-8">
                        <Clock className="h-4 w-4" />
                        <span className="font-semibold">Office Hours:</span>
                        <span>Monday - Friday: 8:00 AM - 4:00 PM</span>
                    </div>
                    <span className="mx-8">|</span>
                    <div className="flex items-center space-x-2 mx-8">
                        <span className="font-semibold">Contact:</span>
                        <span>bpppiimostatedueprocess@gmail.com</span>
                    </div>
                    <span className="mx-8">|</span>
                    <div className="flex items-center space-x-2 mx-8">
                        <span className="font-semibold">Phone:</span>
                        <span>+234 (0) 803 XXX XXXX</span>
                    </div>
                     <span className="mx-8">|</span>
                     <div className="flex items-center space-x-2 mx-8 bg-white/20 px-4 py-1 rounded-full">
                        <span className="font-bold text-sm">{officeStatus.message}</span>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
            `}</style>
        </div>
    );
}
