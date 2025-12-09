'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import {
  useCreateCategoryMutation,
  useCreateGradeMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
  useEditGradeMutation,
  useGetCategoriesQuery,
} from '@/app/admin/redux/services/settingsApi';
import { ConfirmationDialog } from '@/app/admin/components/general/confirmation-dialog';

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
  const [editGrade, { isLoading: isEditingGrade }] = useEditGradeMutation();
  const [deleteCategory, { isLoading: isDeletingCategory }] = useDeleteCategoryMutation();
  const [editCategory, { isLoading: isEditingCategory }] = useEditCategoryMutation();

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isFetching: isCategoriesFetching,
  } = useGetCategoriesQuery();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSector, setNewSector] = useState({ sector: '', description: '' });

  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeConfig | null>(null);
  const [gradeForm, setGradeForm] = useState({
    code: '',
    registrationCost: '',
    financialCapacity: '',
  });

  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [resultDialogTitle, setResultDialogTitle] = useState('');
  const [resultDialogDescription, setResultDialogDescription] = useState('');
  const [resultDialogVariant, setResultDialogVariant] = useState<'default' | 'destructive'>('default');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectorIdToDelete, setSectorIdToDelete] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [sectorToEdit, setSectorToEdit] = useState<SectorConfig | null>(null);

  const isSavingGrade = isCreatingGrade || isEditingGrade;
  const isCategoriesPending = isCategoriesLoading || isCategoriesFetching;

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
 
  const requestDeleteSector = (id: string) => {
    setSectorIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSector = async () => {
    if (!sectorIdToDelete) return;

    const id = sectorIdToDelete;
    const next = sectors.filter((sector) => sector.id !== id);
    updateSectors(next);

    try {
      await deleteCategory(id).unwrap();

      setResultDialogTitle('Sector deleted');
      setResultDialogDescription('Sector has been deleted successfully.');
      setResultDialogVariant('default');
      setResultDialogOpen(true);
    } catch (error) {
      console.error('Failed to delete category:', error);
      let message = 'Failed to delete sector.';

      const apiError = error as { data?: { message?: string }; error?: string };
      if (apiError?.data?.message && typeof apiError.data.message === 'string') {
        message = apiError.data.message;
      } else if (apiError?.error && typeof apiError.error === 'string') {
        message = apiError.error;
      }

      setResultDialogTitle('Error');
      setResultDialogDescription(message);
      setResultDialogVariant('destructive');
      setResultDialogOpen(true);
    } finally {
      setSectorIdToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const requestEditSector = (sector: SectorConfig) => {
    setSectorToEdit(sector);
    setEditDialogOpen(true);
  };

  const handleEditSector = async () => {
    if (!sectorToEdit) return;

    const currentCategory = categoriesData?.categories?.find((c) => c._id === sectorToEdit.id);
    const currentDescription = currentCategory?.description ?? '';

    const currentSector = sectors.find((s) => s.id === sectorToEdit.id) ?? sectorToEdit;
    const trimmed = currentSector.sector.trim();
    if (!trimmed) {
      setResultDialogTitle('Invalid value');
      setResultDialogDescription('Sector name cannot be empty.');
      setResultDialogVariant('destructive');
      setResultDialogOpen(true);
      return;
    }

    const updatedSectors = sectors.map((s) =>
      s.id === sectorToEdit.id ? { ...s, sector: trimmed.toUpperCase() } : s,
    );
    updateSectors(updatedSectors);

    try {
      const response = await editCategory({
        id: sectorToEdit.id,
        data: {
          sector: trimmed.toLowerCase(),
          description: currentDescription,
        },
      }).unwrap();

      setResultDialogTitle('Sector updated');
      setResultDialogDescription(
        `Sector ${response.sector.toUpperCase()} updated successfully.`,
      );
      setResultDialogVariant('default');
      setResultDialogOpen(true);
    } catch (error) {
      console.error('Failed to edit category:', error);
      let message = 'Failed to update sector.';

      const apiError = error as { data?: { message?: string }; error?: string };
      if (apiError?.data?.message && typeof apiError.data.message === 'string') {
        message = apiError.data.message;
      } else if (apiError?.error && typeof apiError.error === 'string') {
        message = apiError.error;
      }

      setResultDialogTitle('Error');
      setResultDialogDescription(message);
      setResultDialogVariant('destructive');
      setResultDialogOpen(true);
    } finally {
      setEditDialogOpen(false);
      setSectorToEdit(null);
    }
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
      setResultDialogTitle('Invalid values');
      setResultDialogDescription('Registration cost and financial capacity must be valid numbers.');
      setResultDialogVariant('destructive');
      setResultDialogOpen(true);
      return;
    }

    try {
      const payload = {
        grade: gradeForm.code.toUpperCase(),
        registrationCost,
        financialCapacity,
      };

      const response = editingGrade
        ? await editGrade({ id: editingGrade.id, data: payload }).unwrap()
        : await createGrade(payload).unwrap();

      handleCloseGradeDialog();

      setResultDialogTitle(editingGrade ? 'Grade updated' : 'Grade created');
      setResultDialogDescription(
        `Grade ${response.grade} ${editingGrade ? 'updated' : 'created'} successfully.`,
      );
      setResultDialogVariant('default');
      setResultDialogOpen(true);
    } catch (error) {
      console.error('Failed to save grade:', error);
      let message = editingGrade ? 'Failed to update grade.' : 'Failed to create grade.';

      const apiError = error as { data?: { message?: string }; error?: string };
      if (apiError?.data?.message && typeof apiError.data.message === 'string') {
        message = apiError.data.message;
      } else if (apiError?.error && typeof apiError.error === 'string') {
        message = apiError.error;
      }

      setResultDialogTitle('Error');
      setResultDialogDescription(message);
      setResultDialogVariant('destructive');
      setResultDialogOpen(true);
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
    setEditingGrade(null);
    setGradeForm({ code: '', registrationCost: '', financialCapacity: '' });
    setIsGradeDialogOpen(true);
  };

  if (isCategoriesPending) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 pt-6 pb-6 animate-pulse">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-2">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-64 bg-gray-100 rounded" />
            </div>
            <div className="h-8 w-24 bg-gray-200 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((key) => (
              <div
                key={key}
                className="flex items-start justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
              >
                <div className="flex-1 space-y-3">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-3 w-32 bg-gray-100 rounded" />
                </div>
                <div className="flex items-start space-x-2 ml-3">
                  <div className="h-6 w-6 bg-gray-200 rounded-full" />
                  <div className="h-6 w-6 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 pt-6 pb-6 animate-pulse">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2">
              <div className="h-4 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-64 bg-gray-100 rounded" />
            </div>
            <div className="h-8 w-24 bg-gray-200 rounded-full" />
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <div className="min-w-full divide-y divide-gray-100 text-xs">
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex items-center justify-between px-4 py-3">
                  <div className="flex-1 flex space-x-4">
                    <div className="h-3 w-12 bg-gray-200 rounded" />
                    <div className="h-3 w-40 bg-gray-100 rounded" />
                    <div className="h-3 w-32 bg-gray-100 rounded" />
                  </div>
                  <div className="h-6 w-6 bg-gray-200 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                  onClick={() => requestEditSector(sector)}
                  className="p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  aria-label="Edit sector"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => requestDeleteSector(sector.id)}
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
                  isSavingGrade ||
                  !gradeForm.code.trim() ||
                  !gradeForm.registrationCost.trim() ||
                  !gradeForm.financialCapacity.trim()
                }
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingGrade ? 'Saving...' : 'Save Grade'}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmationDialog
        isOpen={editDialogOpen}
        onClose={() => {
          if (isEditingCategory) return;
          setEditDialogOpen(false);
          setSectorToEdit(null);
        }}
        onConfirm={handleEditSector}
        title="Update sector"
        description="Do you want to save changes to this sector?"
        confirmText="Yes, save"
        cancelText="Cancel"
        loading={isEditingCategory}
      />
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          if (isDeletingCategory) return;
          setDeleteDialogOpen(false);
          setSectorIdToDelete(null);
        }}
        onConfirm={handleDeleteSector}
        title="Delete sector"
        description="Are you sure you want to delete this sector?"
        confirmText="Yes, delete"
        cancelText="Cancel"
        variant="destructive"
        loading={isDeletingCategory}
      />
      <ConfirmationDialog
        isOpen={resultDialogOpen}
        onClose={() => setResultDialogOpen(false)}
        onConfirm={() => setResultDialogOpen(false)}
        title={resultDialogTitle}
        description={resultDialogDescription}
        confirmText="OK"
        cancelText="Close"
        variant={resultDialogVariant}
      />
    </div>
  );
}
