'use client';

import { useState } from 'react';
import {
  useCreateCategoryMutation,
  useCreateGradeMutation,
  useDeleteCategoryMutation,
  useEditCategoryMutation,
  useEditGradeMutation,
  useDeleteGradeMutation,
  useGetCategoriesQuery,
} from '@/app/admin/redux/services/settingsApi';
import { ConfirmationDialog } from '@/app/admin/components/general/confirmation-dialog';
import { CategoriesConfigurationSkeleton } from './CategoriesConfigurationSkeleton';
import { AddSectorDialog } from './AddSectorDialog';
import { GradeDialog } from './GradeDialog';
import { ContractorGradesSection } from './ContractorGradesSection';
import { ContractorSectorsSection } from './ContractorSectorsSection';
import type { SectorConfig, GradeConfig } from '../_types/settings-ui';

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
  const [deleteGrade, { isLoading: isDeletingGrade }] = useDeleteGradeMutation();

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
    category: '',
    renewalFee: '',
  });

  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [resultDialogTitle, setResultDialogTitle] = useState('');
  const [resultDialogDescription, setResultDialogDescription] = useState('');
  const [resultDialogVariant, setResultDialogVariant] = useState<'default' | 'destructive'>('default');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectorIdToDelete, setSectorIdToDelete] = useState<string | null>(null);

  const [deleteGradeDialogOpen, setDeleteGradeDialogOpen] = useState(false);
  const [gradeIdToDelete, setGradeIdToDelete] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [sectorToEdit, setSectorToEdit] = useState<SectorConfig | null>(null);

  const isSavingGrade = isCreatingGrade || isEditingGrade;
  const isCategoriesPending = isCategoriesLoading || isCategoriesFetching;

  const updateSectors = (next: SectorConfig[]) => {
    if (onChangeSectors) onChangeSectors(next);
  };

  const requestDeleteGrade = (id: string) => {
    setGradeIdToDelete(id);
    setDeleteGradeDialogOpen(true);
  };

  const handleDeleteGrade = async () => {
    if (!gradeIdToDelete) return;

    const id = gradeIdToDelete;

    try {
      await deleteGrade(id).unwrap();

      setResultDialogTitle('Grade deleted');
      setResultDialogDescription('Grade has been deleted successfully.');
      setResultDialogVariant('default');
      setResultDialogOpen(true);
    } catch (error) {
      console.error('Failed to delete grade:', error);
      let message = 'Failed to delete grade.';

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
      setGradeIdToDelete(null);
      setDeleteGradeDialogOpen(false);
    }
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
      code: grade.grade,
      registrationCost: grade.registrationCost.toString(),
      financialCapacity: grade.financialCapacity.toString(),
      category: grade.category ?? '',
      renewalFee: grade.renewalFee.toString(),
    });
    setIsGradeDialogOpen(true);
  };

  const handleCloseGradeDialog = () => {
    setIsGradeDialogOpen(false);
    setEditingGrade(null);
    setGradeForm({ code: '', registrationCost: '', financialCapacity: '', category: '', renewalFee: '' });
  };

  const handleSubmitGrade = async () => {
    if (!gradeForm.code.trim() || !gradeForm.category.trim()) return;

    const registrationCost = Number(
      gradeForm.registrationCost.toString().replace(/,/g, ''),
    );
    const financialCapacity = gradeForm.financialCapacity.toString().replace(/,/g, '');
    const renewalFee = Number(
      gradeForm.renewalFee.toString().replace(/,/g, ''),
    );

    if (Number.isNaN(registrationCost) || Number.isNaN(renewalFee)) {
      setResultDialogTitle('Invalid values');
      setResultDialogDescription('Registration cost and renewal fee must be valid numbers.');
      setResultDialogVariant('destructive');
      setResultDialogOpen(true);
      return;
    }

    try {
      const payload = {
        category: gradeForm.category,
        grade: gradeForm.code.toUpperCase(),
        registrationCost,
        financialCapacity,
        renewalFee,
      };

      const response = editingGrade
        ? await editGrade({ id: editingGrade._id, data: payload }).unwrap()
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
    field: keyof Omit<GradeConfig, '_id'>,
    value: string,
  ) => {
    const next = grades.map((grade) =>
      grade._id === id ? { ...grade, [field]: value } : grade,
    );
    updateGrades(next);
  };

  const handleAddGrade = () => {
    setEditingGrade(null);
    setGradeForm({ code: '', registrationCost: '', financialCapacity: '', category: '', renewalFee: '' });
    setIsGradeDialogOpen(true);
  };

  if (isCategoriesPending) {
    return <CategoriesConfigurationSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Contractor Categories (Sectors) */}
      <ContractorSectorsSection
        sectors={sectors}
        onAddSector={handleOpenDialog}
        onSectorChange={handleSectorChange}
        onEditSector={requestEditSector}
        onDeleteSector={requestDeleteSector}
      />

      {/* Contractor Grades */}
      <ContractorGradesSection
        grades={grades}
        onAddGrade={handleAddGrade}
        onGradeChange={handleGradeChange}
        onEditGradeClick={handleOpenGradeDialog}
        onDeleteGradeClick={(grade) => requestDeleteGrade(grade._id)}
      />

      {/* Add Sector Dialog */}
      <AddSectorDialog
        isOpen={isDialogOpen}
        newSector={newSector}
        onNewSectorChange={(field, value) =>
          setNewSector((prev) => ({ ...prev, [field]: value }))
        }
        onClose={handleCloseDialog}
        onCreate={handleCreateSector}
        isCreating={isCreating}
      />

      {/* Add / Edit Grade Dialog */}
      <GradeDialog
        isOpen={isGradeDialogOpen}
        onClose={handleCloseGradeDialog}
        gradeForm={gradeForm}
        onChange={(field, value) =>
          setGradeForm((prev) => ({ ...prev, [field]: value }))
        }
        onSubmit={handleSubmitGrade}
        isSaving={isSavingGrade}
        categories={categoriesData?.categories ?? []}
        title={editingGrade ? 'Edit Grade' : 'Add Grade'}
      />
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
        isOpen={deleteGradeDialogOpen}
        onClose={() => {
          if (isDeletingGrade) return;
          setDeleteGradeDialogOpen(false);
          setGradeIdToDelete(null);
        }}
        onConfirm={handleDeleteGrade}
        title="Delete grade"
        description="Are you sure you want to delete this grade?"
        confirmText="Yes, delete"
        cancelText="Cancel"
        variant="destructive"
        loading={isDeletingGrade}
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
