'use client';

import { X } from 'lucide-react';

export interface NewSectorState {
  sector: string;
  description: string;
}

interface AddSectorDialogProps {
  isOpen: boolean;
  newSector: NewSectorState;
  onNewSectorChange: (field: keyof NewSectorState, value: string) => void;
  onClose: () => void;
  onCreate: () => void;
  isCreating: boolean;
}

export function AddSectorDialog({
  isOpen,
  newSector,
  onNewSectorChange,
  onClose,
  onCreate,
  isCreating,
}: AddSectorDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add New Sector</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="sector-name" className="block text-sm font-medium text-gray-700 mb-1">
              Sector Name
            </label>
            <input
              id="sector-name"
              type="text"
              value={newSector.sector}
              onChange={(e) => onNewSectorChange('sector', e.target.value)}
              placeholder="e.g., WORKS, SUPPLIES, ICT"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="sector-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              id="sector-description"
              type="text"
              value={newSector.description}
              onChange={(e) => onNewSectorChange('description', e.target.value)}
              placeholder="e.g., Construction & Engineering"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onCreate}
            disabled={isCreating || !newSector.sector.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : 'Create Sector'}
          </button>
        </div>
      </div>
    </div>
  );
}
