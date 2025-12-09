'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { useCreateCategoryMutation, useCreateGradeMutation } from '@/app/admin/redux/services/settingsApi';

export interface SectorConfig {
  id: string;
  sector: string;
  grade: string;
  fee: string;
  effectiveDate: string;
}

export interface GradeConfig {
  id: string;
  code: string;
  description: string;
  threshold: string;
}

interface CategoriesConfigurationProps {
  sectors: SectorConfig[];
  grades: GradeConfig[];
  onChangeSectors?: (sectors: SectorConfig[]) => void;
  onChangeGrades?: (grades: GradeConfig[]) => void;
}

export function CategoriesConfiguration({
  sectors,
  grades,
  onChangeSectors,
  onChangeGrades,
}: CategoriesConfigurationProps) {
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [createGrade, { isLoading: isCreatingGrade }] = useCreateGradeMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSector, setNewSector] = useState({ sector: '', description: '' });

  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeConfig | null>(null);
  const [gradeForm, setGradeForm] = useState({
    code: '',
    registrationCost: '',
    financialCapacity: '',
  });

  const updateSectors = (next: SectorConfig[]) => {
    if (onChangeSectors) onChangeSectors(next);
  };

  const updateGrades = (next: GradeConfig[]) => {
    if (onChangeGrades) onChangeGrades(next);
  };

  const handleSectorChange = (id: string, sectorName: string) => {
    const next = sectors.map((sector) =>
      sector.id === id ? { ...sector, sector: sectorName } : sector,
    );
    updateSectors(next);
  };

  const handleOpenDialog = () => {
    setNewSector({ sector: '', description: '' });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNewSector({ sector: '', description: '' });
  };

  const handleCreateSector = async () => {
    if (!newSector.sector.trim()) return;
    try {
      await createCategory({
  ...newSector,
  sector: newSector.sector.toLowerCase(),
}).unwrap();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleDeleteSector = (id: string) => {
    const next = sectors.filter((sector) => sector.id !== id);
    updateSectors(next);
  };

  const handleOpenGradeDialog = (grade: GradeConfig) => {
    setEditingGrade(grade);
    setGradeForm({
      code: grade.code,
      registrationCost: '',
      financialCapacity: '',
    });
    setIsGradeDialogOpen(true);
  };

  const handleCloseGradeDialog = () => {
    setIsGradeDialogOpen(false);
    setEditingGrade(null);
    setGradeForm({ code: '', registrationCost: '', financialCapacity: '' });
  };

  const handleSubmitGrade = async () => {
    if (!gradeForm.code.trim()) return;

    const registrationCost = Number(
      gradeForm.registrationCost.toString().replace(/,/g, ''),
    );
    const financialCapacity = Number(
      gradeForm.financialCapacity.toString().replace(/,/g, ''),
    );

    if (Number.isNaN(registrationCost) || Number.isNaN(financialCapacity)) {
      console.error('registrationCost and financialCapacity must be numbers');
      return;
    }

    try {
      await createGrade({
        grade: gradeForm.code.toUpperCase(),
        registrationCost,
        financialCapacity,
      }).unwrap();
      handleCloseGradeDialog();
    } catch (error) {
      console.error('Failed to create grade:', error);
    }
  };

  const handleGradeChange = (
    id: string,
    field: keyof Omit<GradeConfig, 'id'>,
    value: string,
  ) => {
    const next = grades.map((grade) =>
      grade.id === id ? { ...grade, [field]: value } : grade,
    );
    updateGrades(next);
  };

  const handleAddGrade = () => {
    const next: GradeConfig[] = [
      ...grades,
      { id: `grade-${Date.now()}`, code: '', description: '', threshold: '' },
    ];
    updateGrades(next);
  };

  return (
    <div className="space-y-6">
      {/* Contractor Categories (Sectors) */}
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
            onClick={handleOpenDialog}
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
                  onChange={(e) => handleSectorChange(sector.id, e.target.value)}
                  className="w-full bg-transparent border-0 focus:outline-none text-xs font-medium tracking-wide uppercase text-gray-800"
                  placeholder="Enter sector"
                />
              </div>
              <div className="flex items-start space-x-2 ml-3">
                <button
                  type="button"
                  className="p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  aria-label="Edit sector"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSector(sector.id)}
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

      {/* Contractor Grades */}
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
            onClick={handleAddGrade}
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
                <th className="px-4 py-3 text-left font-medium text-gray-500">Description</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Project Value Threshold</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {grades.map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-gray-900">
                    <input
                      value={grade.code}
                      onChange={(e) => handleGradeChange(grade.id, 'code', e.target.value)}
                      className="w-12 bg-transparent border-0 focus:outline-none text-xs font-semibold text-gray-900 uppercase"
                      placeholder="A"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-700">
                    <input
                      value={grade.description}
                      onChange={(e) => handleGradeChange(grade.id, 'description', e.target.value)}
                      className="w-full bg-transparent border-0 focus:outline-none text-xs text-gray-700"
                      placeholder="Large Projects"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-700">
                    <input
                      value={grade.threshold}
                      onChange={(e) => handleGradeChange(grade.id, 'threshold', e.target.value)}
                      className="w-full bg-transparent border-0 focus:outline-none text-xs text-gray-700"
                      placeholder="Above ₦50M"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => handleOpenGradeDialog(grade)}
                        className="p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        aria-label="Edit grade"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Sector Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={handleCloseDialog} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Sector</h3>
              <button
                type="button"
                onClick={handleCloseDialog}
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
                  onChange={(e) => setNewSector((prev) => ({ ...prev, sector: e.target.value }))}
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
                  onChange={(e) => setNewSector((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Construction & Engineering"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCloseDialog}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateSector}
                disabled={isCreating || !newSector.sector.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Sector'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Grade Dialog */}
      {isGradeDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={handleCloseGradeDialog} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingGrade ? 'Edit Grade' : 'Add Grade'}
              </h3>
              <button
                type="button"
                onClick={handleCloseGradeDialog}
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
                    setGradeForm((prev) => ({ ...prev, code: e.target.value }))
                  }
                  placeholder="e.g., A, B, C"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                    setGradeForm((prev) => ({
                      ...prev,
                      registrationCost: e.target.value,
                    }))
                  }
                  placeholder="e.g., 100000"
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
                  type="number"
                  min="0"
                  value={gradeForm.financialCapacity}
                  onChange={(e) =>
                    setGradeForm((prev) => ({
                      ...prev,
                      financialCapacity: e.target.value,
                    }))
                  }
                  placeholder="e.g., 50000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCloseGradeDialog}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitGrade}
                disabled={
                  isCreatingGrade ||
                  !gradeForm.code.trim() ||
                  !gradeForm.registrationCost.trim() ||
                  !gradeForm.financialCapacity.trim()
                }
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingGrade ? 'Saving...' : 'Save Grade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
