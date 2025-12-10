"use client";

interface NotificationTab {
  key: string;
  label: string;
  count?: number;
}

interface NotificationTabsProps {
  tabs: NotificationTab[];
  activeKey: string;
  onTabChange: (key: string) => void;
}

export default function NotificationTabs({ tabs, activeKey, onTabChange }: NotificationTabsProps) {
  return (
    <div className="rounded-full bg-gray-100 p-1">
      <div className="flex text-sm font-medium text-gray-600">
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`flex-1 rounded-full px-4 py-2 transition-colors ${
                isActive
                  ? "bg-white text-gray-900 shadow-sm"
                  : "bg-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span className="ml-1 text-xs text-gray-500">({tab.count})</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
