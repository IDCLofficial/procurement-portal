'use client';

export interface CertificateTab {
  id: string;
  label: string;
}

interface CertificateTabsProps {
  tabs: CertificateTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export function CertificateTabs({ tabs, activeTab, onTabChange }: CertificateTabsProps) {
  return (
    <div className="px-6 border-t border-gray-100">
      <div className="flex flex-wrap gap-2 py-3 text-xs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                isActive
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-transparent text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
