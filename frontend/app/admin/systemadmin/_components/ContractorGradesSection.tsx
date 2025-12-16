'use client';

import { Edit, Plus, Trash2 } from 'lucide-react';
import type { GradeConfig } from '../_types/settings-ui';

interface ContractorGradesSectionProps {
  grades: GradeConfig[];
  onAddGrade: () => void;
  onGradeChange: (id: string, field: keyof Omit<GradeConfig, '_id'>, value: string) => void;
  onEditGradeClick: (grade: GradeConfig) => void;
  onDeleteGradeClick: (grade: GradeConfig) => void;
}

export function ContractorGradesSection({
  grades,
  onAddGrade,
  onGradeChange,
  onEditGradeClick,
  onDeleteGradeClick,
}: ContractorGradesSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 pt-6 pb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Contractor Grades</h2>
          <p className="mt-1 text-xs text-[#A0AEC0]">
            Define grade levels with financial thresholds
          </p>
        </div>
        <button
          type="button"
          onClick={onAddGrade}
          className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Grade
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100 text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Grade</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Description</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Project Value Threshold</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {grades.map((grade) => ( console.log(grade),
              <tr key={grade._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-gray-900">
                  <span className="text-xs font-semibold text-gray-900 uppercase">
                    {grade.grade}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-gray-900">
                  <span className="text-xs font-semibold text-gray-900 uppercase">
                    {grade.category}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-700">
                  <span className="text-xs text-gray-700">
                    {`Registration: ₦${grade.registrationCost.toLocaleString()}`}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-700">
                  <span className="text-xs text-gray-700">
                    {`₦${grade.financialCapacity.toLocaleString()}`}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEditGradeClick(grade)}
                      className="p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                      aria-label="Edit grade"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteGradeClick(grade)}
                      className="p-1.5 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                      aria-label="Delete grade"
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
  );
}
