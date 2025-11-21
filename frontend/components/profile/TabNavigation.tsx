'use client';

import { motion } from 'framer-motion';

interface Tab {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface TabNavigationProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
    return (
        <div className="bg-white rounded-3xl border border-gray-200 mb-6 p-1">
            <div className="flex gap-1 relative">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-all active:scale-95 cursor-pointer relative z-10 rounded-2xl ${
                                isActive
                                    ? 'text-gray-900'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-gray-100 rounded-3xl"
                                    initial={false}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 500,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <span className="relative z-10 text-base">{tab.icon}</span>
                            <span className="relative z-10 max-sm:hidden">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
