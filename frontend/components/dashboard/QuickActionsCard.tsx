'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { FaFileAlt, FaEdit, FaCreditCard, FaBell, FaCheckCircle } from 'react-icons/fa';

interface QuickAction {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    url?: string;
    onClick?: () => void;
}

interface QuickActionsCardProps {
    actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
    {
        icon: FaCheckCircle,
        label: 'Registration Status',
        url: "/dashboard/registration-status"
    },
    {
        icon: FaFileAlt,
        label: 'Manage Documents',
        url: "/dashboard/manage-documents"
    },
    {
        icon: FaEdit,
        label: 'Edit Company Profile',
        url: "/dashboard/profile"
    },
    {
        icon: FaCreditCard,
        label: 'Payment History',
    },
    {
        icon: FaBell,
        label: 'Notifications',
    },
];

export default function QuickActionsCard({ actions = defaultActions }: QuickActionsCardProps) {
    return (
        <Card className="shadow-sm">
            <CardContent className="">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                    {actions.map((action, index) => {
                        const Icon = action.icon;
                        if (action.url) {
                            return (
                                <Link
                                    key={index}
                                    href={action.url}
                                    className="w-full cursor-pointer border flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all text-left group duration-300 active:scale-95"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                        <Icon className="text-gray-700 text-base" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">{action.label}</span>
                                </Link>
                            );
                        }
                        return (
                            <button
                                key={index}
                                onClick={action.onClick}
                                className="w-full cursor-pointer border flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all text-left group duration-300 active:scale-95"
                            >
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                    <Icon className="text-gray-700 text-base" />
                                </div>
                                <span className="text-sm font-medium text-gray-900">{action.label}</span>
                            </button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
