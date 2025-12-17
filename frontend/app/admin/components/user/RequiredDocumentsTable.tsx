'use client';

import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useCreateDocumentPresetsMutation, useDeleteDocumentPresetMutation, useUpdateDocumentPresetMutation } from '@/app/admin/redux/services/settingsApi';
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
import type { DocumentConfigItem as DocumentConfig } from '@/app/admin/systemadmin/_constants';

interface RequiredDocumentsTableProps {
  documents: DocumentConfig[];
  onChange?: (documents: DocumentConfig[]) => void;
  onAddDocument?: () => void;
  onEditDocument?: (id: string) => void;
  onDeleteDocument?: (id: string) => void;
}

export function RequiredDocumentsTable({
  documents,
  onChange,
  onAddDocument,
  onEditDocument,
  onDeleteDocument,
}: RequiredDocumentsTableProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    documentName: '',
    isRequired: 'true', // 'true' | 'false' as strings for select
    hasExpiry: 'yes',   // backend enum values: 'yes' | 'no'
    renewalFrequency: 'annual', // 'annual' | 'n/a'
  });

  const [createPreset, { isLoading }] = useCreateDocumentPresetsMutation();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormValues, setEditFormValues] = useState({
    id: '',
    documentName: '',
    isRequired: 'true',
    hasExpiry: 'yes',
    renewalFrequency: 'annual',
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentIdToDelete, setDocumentIdToDelete] = useState<string | null>(null);
  const [documentNameToDelete, setDocumentNameToDelete] = useState('');

  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [resultDialogTitle, setResultDialogTitle] = useState('');
  const [resultDialogDescription, setResultDialogDescription] = useState('');
  const [resultDialogVariant, setResultDialogVariant] = useState<'default' | 'destructive'>('default');

  const [updatePreset, { isLoading: isUpdatingPreset }] = useUpdateDocumentPresetMutation();
  const [deletePreset, { isLoading: isDeletingPreset }] = useDeleteDocumentPresetMutation();

  const updateDocuments = (next: DocumentConfig[]) => {
    if (onChange) onChange(next);
  };

  const handleAddRow = () => {
    setFormValues({
      documentName: '',
      isRequired: 'true',
      hasExpiry: 'yes',
      renewalFrequency: 'annual',
    });
    setIsAddOpen(true);
    if (onAddDocument) onAddDocument();
  };

  const handleEditRow = (doc: DocumentConfig) => {
    setEditFormValues({
      id: doc.id,
      documentName: doc.name,
      isRequired: doc.required === 'Required' ? 'true' : 'false',
      hasExpiry: doc.hasExpiry.toLowerCase() === 'yes' ? 'yes' : 'no',
      renewalFrequency: doc.renewalFrequency,
    });
    setIsEditOpen(true);
    if (onEditDocument) {
      onEditDocument(doc.id);
    }
  };

  const handleDeleteRow = (id: string, name: string) => {
    setDocumentIdToDelete(id);
    setDocumentNameToDelete(name);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRow = async () => {
    if (!documentIdToDelete) return;

    try {
      await deletePreset(documentIdToDelete).unwrap();

      const next = documents.filter((doc) => doc.id !== documentIdToDelete);
      updateDocuments(next);
      if (onDeleteDocument) onDeleteDocument(documentIdToDelete);

      setResultDialogTitle('Document deleted');
      setResultDialogDescription('This document has been deleted successfully.');
      setResultDialogVariant('default');
      setResultDialogOpen(true);
    } catch (error) {
       
      console.error('Failed to delete document preset', error);
      let message = 'Failed to delete document.';

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
      setDocumentIdToDelete(null);
      setDocumentNameToDelete('');
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="flex items-start justify-between px-6 pt-6 pb-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Required Documents Checklist</h2>
          <p className="mt-1 text-xs text-[#A0AEC0]">
            Manage mandatory and optional documents
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddRow}
          className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Document
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full divide-y divide-gray-100 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Document Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Required</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Has Expiry Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Renewal Frequency</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-700">
                    <span className="text-xs text-gray-700">
                      {doc.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    <span className="text-xs font-medium text-gray-700">
                      {doc.required}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    <span className="text-xs text-gray-700">
                      {doc.hasExpiry}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-700">
                    <span className="text-xs text-gray-700">
                      {doc.renewalFrequency.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEditRow(doc)}
                        className="p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        aria-label="Edit document"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(doc.id, doc.name)}
                        className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50"
                        aria-label="Delete document"
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

      <Dialog
        open={isAddOpen}
        onOpenChange={(open) => {
          if (!open) setIsAddOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Document Preset</DialogTitle>
            <DialogDescription>
              Configure a new document that vendors must provide.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Document Name
              </label>
              <input
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="e.g. NSITF Certificate"
                value={formValues.documentName}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, documentName: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Required
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                  value={formValues.isRequired}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, isRequired: e.target.value }))
                  }
                >
                  <option value="true">Required</option>
                  <option value="false">Optional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Has Expiry Date
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                  value={formValues.hasExpiry}
                  onChange={(e) =>
                    setFormValues((prev) => ({ ...prev, hasExpiry: e.target.value }))
                  }
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Renewal Frequency
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                value={formValues.renewalFrequency}
                onChange={(e) =>
                  setFormValues((prev) => ({
                    ...prev,
                    renewalFrequency: e.target.value,
                  }))
                }
              >
                <option value="annual">Annual</option>
                <option value="n/a">None</option>
              </select>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading || !formValues.documentName.trim()}
              onClick={async () => {
                const trimmedName = formValues.documentName.trim();
                if (!trimmedName) return;
                try {
                  const created = await createPreset({
                    documentName: trimmedName,
                    isRequired: formValues.isRequired === 'true',
                    hasExpiry: formValues.hasExpiry,
                    renewalFrequency: formValues.renewalFrequency,
                  }).unwrap();

                  if (onChange) {
                    onChange([
                      ...documents,
                      {
                        id: created._id,
                        name: created.documentName,
                        required: created.isRequired ? 'Required' : 'Optional',
                        hasExpiry: created.hasExpiry.toLowerCase() === 'yes' ? 'Yes' : 'No',
                        renewalFrequency: created.renewalFrequency,
                      } as DocumentConfig,
                    ]);
                  }
                  setIsAddOpen(false);
                } catch (error) {
                   
                  console.error('Failed to create document preset', error);
                }
              }}
            >
              {isLoading ? 'Saving...' : 'Save Preset'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          if (!open && !isUpdatingPreset) {
            setIsEditOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Document Preset</DialogTitle>
            <DialogDescription>
              Update this document&apos;s configuration.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Document Name
              </label>
              <input
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="e.g. NSITF Certificate"
                value={editFormValues.documentName}
                onChange={(e) =>
                  setEditFormValues((prev) => ({ ...prev, documentName: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Required
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                  value={editFormValues.isRequired}
                  onChange={(e) =>
                    setEditFormValues((prev) => ({ ...prev, isRequired: e.target.value }))
                  }
                >
                  <option value="true">Required</option>
                  <option value="false">Optional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Has Expiry Date
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                  value={editFormValues.hasExpiry}
                  onChange={(e) =>
                    setEditFormValues((prev) => ({ ...prev, hasExpiry: e.target.value }))
                  }
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Renewal Frequency
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
                value={editFormValues.renewalFrequency}
                onChange={(e) =>
                  setEditFormValues((prev) => ({
                    ...prev,
                    renewalFrequency: e.target.value,
                  }))
                }
              >
                <option value="annual">Annual</option>
                <option value="n/a">None</option>
              </select>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              disabled={isUpdatingPreset}
            >
              Cancel
            </Button>
            <Button
              disabled={isUpdatingPreset || !editFormValues.documentName.trim()}
              onClick={async () => {
                const trimmedName = editFormValues.documentName.trim();
                if (!trimmedName || !editFormValues.id) return;

                try {
                  const updated = await updatePreset({
                    id: editFormValues.id,
                    data: {
                      documentName: trimmedName,
                      isRequired: editFormValues.isRequired === 'true',
                      hasExpiry: editFormValues.hasExpiry,
                      renewalFrequency: editFormValues.renewalFrequency,
                    },
                  }).unwrap();

                  const next: DocumentConfig[] = documents.map((doc) =>
                    doc.id === updated._id
                      ? {
                          id: updated._id,
                          name: updated.documentName,
                          required: updated.isRequired ? 'Required' : 'Optional',
                          hasExpiry: updated.hasExpiry.toLowerCase() === 'yes' ? 'Yes' : 'No',
                          renewalFrequency: updated.renewalFrequency,
                        }
                      : doc,
                  );
                  updateDocuments(next);

                  setResultDialogTitle('Document updated');
                  setResultDialogDescription('Document has been updated successfully.');
                  setResultDialogVariant('default');
                  setResultDialogOpen(true);
                  setIsEditOpen(false);
                } catch (error) {
                  let message = 'Failed to update document.';

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
              }}
            >
              {isUpdatingPreset ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          if (isDeletingPreset) return;
          setDeleteDialogOpen(false);
          setDocumentIdToDelete(null);
          setDocumentNameToDelete('');
        }}
        onConfirm={confirmDeleteRow}
        title="Delete document"
        description={
          documentNameToDelete
            ? `Do you want to delete "${documentNameToDelete}"? This is final.`
            : 'Do you want to delete this document? This is final.'
        }
        confirmText="Yes, delete"
        cancelText="Cancel"
        variant="destructive"
        loading={isDeletingPreset}
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
