'use client';

import { Calendar, Edit, Trash2, Plus } from 'lucide-react';

export interface FeeConfig {
  id: string;
  sector: string;
  grade: string;
  fee: number;
  effectiveDate: string;
}

interface FeeConfigurationTableProps {
  fees: FeeConfig[];
  onAddFee?: () => void;
  onEditFee?: (id: string) => void;
  onDeleteFee?: (id: string) => void;
  onChange?: (fees: FeeConfig[]) => void;
}

export function FeeConfigurationTable({ fees, onAddFee, onEditFee, onDeleteFee, onChange }: FeeConfigurationTableProps) {
  const updateFees = (nextFees: FeeConfig[]) => {
    if (onChange) {
      onChange(nextFees);
    }
  };

  const handleFieldChange = (
    id: string,
    field: keyof Omit<FeeConfig, 'id'>,
    value: string,
  ) => {
    const nextFees = fees.map((fee) =>
      fee.id === id
        ? {
            ...fee,
            [field]: field === 'fee' ? Number(value || 0) : value,
          }
        : fee,
    );

    updateFees(nextFees);

    if (onEditFee) {
      onEditFee(id);
    }
  };

  const handleAddRow = () => {
    const newFee: FeeConfig = {
      id: `tmp-${Date.now()}`,
      sector: '',
      grade: '',
      fee: 0,
      effectiveDate: '',
    };

    const nextFees = [...fees, newFee];
    updateFees(nextFees);

    if (onAddFee) {
      onAddFee();
    }
  };

  const handleDeleteRow = (id: string) => {
    const nextFees = fees.filter((fee) => fee.id !== id);
    updateFees(nextFees);

    if (onDeleteFee) {
      onDeleteFee(id);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="flex items-start justify-between px-6 pt-6 pb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Registration Fee Configuration</h2>
          <p className="mt-1 text-xs text-[#A0AEC0]">
            Set fees for each sector and grade combination
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddRow}
          className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Fee
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full divide-y divide-gray-100 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Sector</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Grade</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Fee (₦)</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Effective Date</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {fees.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700 text-[11px] uppercase tracking-wide">
                    <input
                      value={fee.sector}
                      onChange={(e) => handleFieldChange(fee.id, 'sector', e.target.value)}
                      className="w-full bg-transparent text-[11px] uppercase tracking-wide text-gray-700 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700 text-xs">
                    <input
                      value={fee.grade}
                      onChange={(e) => handleFieldChange(fee.id, 'grade', e.target.value)}
                      className="w-full bg-transparent text-xs text-gray-700 focus:outline-none"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                      <input
                        type="number"
                        value={Number.isNaN(fee.fee) ? '' : fee.fee}
                        onChange={(e) => handleFieldChange(fee.id, 'fee', e.target.value)}
                        className="w-20 bg-transparent border-0 focus:outline-none text-xs text-gray-800"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700 bg-white">
                      <input
                        type="text"
                        value={fee.effectiveDate}
                        onChange={(e) => handleFieldChange(fee.id, 'effectiveDate', e.target.value)}
                        className="mr-2 bg-transparent border-0 focus:outline-none text-xs text-gray-700"
                      />
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={onEditFee ? () => onEditFee(fee.id) : undefined}
                        className="p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        aria-label="Edit fee"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(fee.id)}
                        className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50"
                        aria-label="Delete fee"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
