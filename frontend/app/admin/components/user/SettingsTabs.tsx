'use client';

import { useState } from 'react';
import { Save, DollarSign, Clock, Tags, FileText, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SettingsTabId = 'fees' | 'sla' | 'categories' | 'documents';

interface SettingsTabsProps {
  activeTab?: SettingsTabId;
  onTabChange?: (tab: SettingsTabId) => void;
  onSave?: () => void;
}

interface SettingsTabConfig {
  id: SettingsTabId;
  label: string;
  icon: LucideIcon;
}

const TABS: SettingsTabConfig[] = [
  { id: 'fees', label: 'Fee Tables', icon: DollarSign },
  { id: 'sla', label: 'SLA Timers', icon: Clock },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'documents', label: 'Documents', icon: FileText },
];

export function SettingsTabs({ activeTab, onTabChange, onSave }: SettingsTabsProps) {
  const [internalTab, setInternalTab] = useState<SettingsTabId>('fees');
  const currentTab = activeTab ?? internalTab;

  const handleTabClick = (id: SettingsTabId) => {
    if (!activeTab) {
      setInternalTab(id);
    }

    if (onTabChange) {
      onTabChange(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#A0AEC0]">
          Configure system fees, SLA timers, and requirements
        </p>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex items-center px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-sm font-medium text-white shadow-sm"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="inline-flex items-center rounded-full bg-white border border-gray-200 shadow-sm p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === currentTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-900 text-white shadow'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              <Icon className="h-4 w-4 mr-2" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
