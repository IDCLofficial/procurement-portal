'use client';

import { motion } from 'framer-motion';

interface NotificationTabsProps {
    activeTab: string;
    onTabChange: (value: string) => void;
    counts: {
        all: number;
        unread: number;
        team: number;
    };
}

export default function NotificationTabs({ activeTab, onTabChange, counts }: NotificationTabsProps) {
    const tabs = [
        { value: 'all', label: `All (${counts.all})` },
        { value: 'unread', label: `Unread (${counts.unread})` },
        { value: 'team', label: `Team (${counts.team})` },
    ];

    return (
        <div className="bg-white rounded-3xl border border-gray-200 p-1">
            <div className="flex gap-1 relative">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.value;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => onTabChange(tab.value)}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all active:scale-95 cursor-pointer relative z-10 rounded-2xl ${
                                isActive
                                    ? 'text-gray-900'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeNotificationTab"
                                    className="absolute inset-0 bg-gray-100 rounded-3xl"
                                    initial={false}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
