'use client';

import { X } from 'lucide-react';
import type { Category } from '@/app/admin/types/setting';

export interface GradeFormState {
  code: string;
  registrationCost: string;
  financialCapacity: string;
  category: string;
renewalFee: string;
}

interface GradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  gradeForm: GradeFormState;
  onChange: (field: keyof GradeFormState, value: string) => void;
  onSubmit: () => void;
  isSaving: boolean;
  categories: Category[];
  title: string;
}

export function GradeDialog({
  isOpen,
  onClose,
  gradeForm,
  onChange,
  onSubmit,
  isSaving,
  categories,
  title,
}: GradeDialogProps) {
  if (!isOpen) return null;

  const isSubmitDisabled =
    isSaving ||
    !gradeForm.code?.trim() ||
    !gradeForm.category?.trim() ||
    !gradeForm.registrationCost?.trim() ||
    !gradeForm.financialCapacity?.trim() ||
    !gradeForm.renewalFee?.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
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
            <label htmlFor="grade-code" className="block text-sm font-medium text-gray-700 mb-1">
              Grade Code
            </label>
            <input
              id="grade-code"
              type="text"
              value={gradeForm.code}
              onChange={(e) =>
                onChange('code', e.target.value)
              }
              placeholder="e.g., A, B, C"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="grade-category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="grade-category"
              value={gradeForm.category}
              onChange={(e) =>
                onChange('category', e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.sector}>
                  {category.sector.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="grade-registration"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Registration Cost (₦)
            </label>
            <input
              id="grade-registration"
              type="number"
              min="0"
              value={gradeForm.registrationCost}
              onChange={(e) =>
                onChange('registrationCost', e.target.value)
              }
              placeholder="e.g., 100000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="grade-renewal-fee"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Renewal Fee (₦)
            </label>
            <input
              id="grade-renewal-fee"
              type="number"
              min="0"
              value={gradeForm.renewalFee}
              onChange={(e) =>
                onChange('renewalFee', e.target.value)
              }
              placeholder="e.g., 50000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="grade-capacity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Financial Capacity (₦)
            </label>
            <input
              id="grade-capacity"
              type="text"
              value={gradeForm.financialCapacity}
              onChange={(e) =>
                onChange('financialCapacity', e.target.value)
              }
              placeholder="e.g., 50000000"
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
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Grade'}
          </button>
        </div>
      </div>
    </div>
  );
}
