'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: LucideIcon;
    iconColor: string;
    iconBgColor: string;
}

export default function StatCard({ title, value, subtitle, icon: Icon, iconColor, iconBgColor }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-2">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
                    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                </div>
                <div className={`w-10 h-10 rounded-lg ${iconBgColor} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
            </div>
        </div>
    );
}
