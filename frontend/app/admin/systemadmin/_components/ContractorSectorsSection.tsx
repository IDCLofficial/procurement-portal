'use client';

import { Edit, Trash2, Plus } from 'lucide-react';
import type { SectorConfig } from '../_types/settings-ui';

interface ContractorSectorsSectionProps {
  sectors: SectorConfig[];
  onAddSector: () => void;
  onSectorChange: (id: string, sectorName: string) => void;
  onEditSector: (sector: SectorConfig) => void;
  onDeleteSector: (id: string) => void;
}

export function ContractorSectorsSection({
  sectors,
  onAddSector,
  onSectorChange,
  onEditSector,
  onDeleteSector,
}: ContractorSectorsSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 pt-6 pb-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Contractor Categories (Sectors)</h2>
          <p className="mt-1 text-xs text-[#A0AEC0]">
            Manage available contractor sectors
          </p>
        </div>
        <button
          type="button"
          onClick={onAddSector}
          className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Sector
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sectors.map((sector) => (
          <div
            key={sector.id}
            className="flex items-start justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800"
          >
            <div className="flex-1 space-y-2">
              <input
                value={sector.sector}
                onChange={(e) => onSectorChange(sector.id, e.target.value)}
                className="w-full bg-transparent border-0 focus:outline-none text-xs font-medium tracking-wide uppercase text-gray-800"
                placeholder="Enter sector"
              />
            </div>
            <div className="flex items-start space-x-2 ml-3">
              <button
                type="button"
                onClick={() => onEditSector(sector)}
                className="p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                aria-label="Edit sector"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteSector(sector.id)}
                className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50"
                aria-label="Delete sector"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
