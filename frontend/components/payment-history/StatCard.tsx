'use client';

import { ReactNode } from 'react';

interface StatCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: ReactNode;
    iconColor: string;
}

export default function StatCard({ title, value, subtitle, icon, iconColor }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-gray-500">{title}</p>
                <div className={`w-8 h-8 rounded-lg ${iconColor} flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
    );
}
