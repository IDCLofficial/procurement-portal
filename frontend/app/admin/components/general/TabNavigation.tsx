import { useState } from 'react';
import { TabNavigationProps } from '@/app/admin/types';

export function TabNavigation({ tabs, onTabChange }: TabNavigationProps) {
  const [selectedTab, setSelectedTab] = useState(
    tabs.find(tab => tab.current)?.name || tabs[0]?.name || ''
  );

  const handleTabClick = (tabName: string) => {
    setSelectedTab(tabName);
    onTabChange?.(tabName);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-flex items-center space-x-1 rounded-full bg-gray-100 px-2 py-1 w-full">
        {tabs.map((tab) => {
          const isSelected = selectedTab === tab.name;
          const label =
            typeof tab.count === 'number'
              ? `${tab.name} (${tab.count})`
              : tab.name;

          return (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab.name)}
              className={`whitespace-nowrap rounded-full px-4 py-2 w-full text-xs sm:text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-white text-[#0A0A0A] shadow-sm'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
