'use client';

import { Search, Download, Filter, ChevronDown } from 'lucide-react';

interface CertificateDirectoryToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  gradeFilter: string;
  onGradeFilterChange: (value: string) => void;
  gradeOptions: string[];
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onExport: () => void;
}

export function CertificateDirectoryToolbar({
  search,
  onSearchChange,
  gradeFilter,
  onGradeFilterChange,
  gradeOptions,
  statusFilter,
  onStatusFilterChange,
  onExport,
}: CertificateDirectoryToolbarProps) {
  return (
    <div className="px-6 pt-6 pb-4 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Certificate Directory</h2>
          <p className="mt-1 text-xs text-[#A0AEC0]">
            Search, filter and manage all certificates
          </p>
        </div>
        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 w-full md:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        <div className="flex-1">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
              placeholder="Search by name, certificate ID, or RCBN number..."
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select
              value={gradeFilter}
              onChange={(e) => onGradeFilterChange(e.target.value)}
              className="appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 pr-8 text-xs text-gray-700 focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option>All Grades</option>
              {gradeOptions.map((grade) => (
                <option key={grade}>{grade}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 pr-8 text-xs text-gray-700 focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Expiring Soon</option>
              <option>Revoked</option>
              <option>Expired</option>
              <option>Pending Issuance</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
          </div>

         
        </div>
      </div>
    </div>
  );
}
