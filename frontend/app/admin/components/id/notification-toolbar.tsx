"use client";

import { Search, Filter } from "lucide-react";

interface NotificationToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterClick?: () => void;
}

export default function NotificationToolbar({ searchTerm, onSearchChange, onFilterClick }: NotificationToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-white px-4 py-3 shadow-sm md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search notifications..."
          className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>
      <button
        type="button"
        onClick={onFilterClick}
        className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      >
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </button>
    </div>
  );
}
