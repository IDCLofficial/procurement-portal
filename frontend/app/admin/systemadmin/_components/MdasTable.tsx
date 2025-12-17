'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/app/admin/components/general/confirmation-dialog';
import { Pagination } from '@/app/admin/components/general/Pagination';
import {
  useCreateMdaMutation,
  useUpdateMdaMutation,
  useDeleteMdaMutation,
} from '@/app/admin/redux/services/settingsApi';

interface MdasTableProps {
  mdas: { id: string; name: string; code?: string }[];
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function MdasTable({ mdas, total, page, limit, onPageChange }: MdasTableProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [resultDialogTitle, setResultDialogTitle] = useState('');
  const [resultDialogDescription, setResultDialogDescription] = useState('');
  const [resultDialogVariant, setResultDialogVariant] = useState<'default' | 'destructive'>('default');

  const [createMda, { isLoading: isCreating }] = useCreateMdaMutation();
  const [updateMda, { isLoading: isUpdating }] = useUpdateMdaMutation();
  const [deleteMda, { isLoading: isDeleting }] = useDeleteMdaMutation();

  const isSubmitting = isCreating || isUpdating;

  const openCreateForm = () => {
    setMode('create');
    setCurrentId(null);
    setName('');
    setCode('');
    setIsFormOpen(true);
  };

  const openEditForm = (id: string) => {
    const existing = mdas.find((m) => m.id === id);
    setMode('edit');
    setCurrentId(id);
    setName(existing?.name ?? '');
    setCode(existing?.code ?? '');
    setIsFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!name.trim() || !code.trim()) return;

    try {
      if (mode === 'create') {
        await createMda({ name: name.trim(), code: code.trim() }).unwrap();
        setResultDialogTitle('MDA created');
        setResultDialogDescription('MDA has been created successfully.');
      } else if (mode === 'edit' && currentId) {
        await updateMda({ id: currentId, data: { name: name.trim(), code: code.trim() } }).unwrap();
        setResultDialogTitle('MDA updated');
        setResultDialogDescription('MDA has been updated successfully.');
      }

      setResultDialogVariant('default');
      setResultDialogOpen(true);
      setIsFormOpen(false);
    } catch (error) {
       
      console.error('Failed to save MDA', error);
      let message = 'Failed to save MDA.';

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

  const requestDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMda(deleteId).unwrap();

      setResultDialogTitle('MDA deleted');
      setResultDialogDescription('MDA has been deleted successfully.');
      setResultDialogVariant('default');
      setResultDialogOpen(true);

      setIsDeleteOpen(false);
      setDeleteId(null);
    } catch (error) {
       
      console.error('Failed to delete MDA', error);
      let message = 'Failed to delete MDA.';

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
  console.log(mdas)

  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="px-6 pt-6 pb-4 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">MDAs</h2>
          <p className="mt-1 text-xs text-[#A0AEC0]">
            List of MDAs integrated into the procurement system
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Create MDA
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full divide-y divide-gray-100 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">MDA Name</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {mdas.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-center text-xs text-gray-500">
                    No MDAs found.
                  </td>
                </tr>
              ) : (
                mdas.map((mda) => (
                  <tr key={mda.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-700">
                      {mda.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(mda.id)}
                          className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => requestDelete(mda.id)}
                          className="inline-flex items-center px-3 py-1.5 rounded-full border border-red-100 bg-white text-xs font-medium text-red-700 shadow-sm hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {typeof total === 'number' && typeof page === 'number' && typeof limit === 'number' && onPageChange && total > 0 && (
          <Pagination total={total} page={page} limit={limit} onPageChange={onPageChange} />
        )}
      </div>

      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) {
            setIsFormOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{mode === 'create' ? 'Create MDA' : 'Edit MDA'}</DialogTitle>
            <DialogDescription>
              {mode === 'create'
                ? 'Register a new MDA for use in the procurement system.'
                : 'Update the details of this MDA.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="e.g. Ministry of Works"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Code
              </label>
              <input
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="e.g. 1I4XX9"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => setIsFormOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !name.trim() || !code.trim()}
            >
              {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          if (isDeleting) return;
          setIsDeleteOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDelete}
        title="Delete MDA"
        description="Are you sure you want to delete this MDA? This action cannot be undone."
        confirmText="Yes, delete"
        cancelText="Cancel"
        variant="destructive"
        loading={isDeleting}
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
    </section>
  );
}
