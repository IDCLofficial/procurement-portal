'use client';

import { LucideIcon } from 'lucide-react';

interface NotificationStatCardProps {
    label: string;
    count: number;
    icon: LucideIcon;
    iconColor: string;
    iconBgColor: string;
}

export default function NotificationStatCard({ label, count, icon: Icon, iconColor, iconBgColor }: NotificationStatCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">{label}</span>
                <div className={`w-8 h-8 rounded-lg ${iconBgColor} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
    );
}
