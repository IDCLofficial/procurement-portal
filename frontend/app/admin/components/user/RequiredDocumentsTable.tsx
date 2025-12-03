'use client';

import { Edit, Trash2, Plus } from 'lucide-react';

export interface DocumentConfig {
  id: string;
  name: string;
  required: 'Required' | 'Optional';
  hasExpiry: 'Yes' | 'No';
  renewalFrequency: string;
}

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
  const updateDocuments = (next: DocumentConfig[]) => {
    if (onChange) onChange(next);
  };

  const handleFieldChange = (
    id: string,
    field: keyof Omit<DocumentConfig, 'id'>,
    value: string,
  ) => {
    const next = documents.map((doc) =>
      doc.id === id
        ? { ...doc, [field]: field === 'required' || field === 'hasExpiry' ? (value as any) : value }
        : doc,
    );

    updateDocuments(next);
    if (onEditDocument) onEditDocument(id);
  };

  const handleAddRow = () => {
    const newDoc: DocumentConfig = {
      id: `doc-${Date.now()}`,
      name: '',
      required: 'Required',
      hasExpiry: 'No',
      renewalFrequency: 'N/A',
    };

    const next = [...documents, newDoc];
    updateDocuments(next);
    if (onAddDocument) onAddDocument();
  };

  const handleDeleteRow = (id: string) => {
    const next = documents.filter((doc) => doc.id !== id);
    updateDocuments(next);
    if (onDeleteDocument) onDeleteDocument(id);
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
                    <input
                      value={doc.name}
                      onChange={(e) => handleFieldChange(doc.id, 'name', e.target.value)}
                      className="w-full bg-transparent border-0 focus:outline-none text-xs text-gray-700"
                      placeholder="Document name"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    <select
                      value={doc.required}
                      onChange={(e) => handleFieldChange(doc.id, 'required', e.target.value)}
                      className="bg-transparent text-xs font-medium focus:outline-none"
                    >
                      <option value="Required">Required</option>
                      <option value="Optional">Optional</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    <select
                      value={doc.hasExpiry}
                      onChange={(e) => handleFieldChange(doc.id, 'hasExpiry', e.target.value)}
                      className="bg-transparent text-xs focus:outline-none"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-700">
                    <input
                      value={doc.renewalFrequency}
                      onChange={(e) => handleFieldChange(doc.id, 'renewalFrequency', e.target.value)}
                      className="w-full bg-transparent border-0 focus:outline-none text-xs text-gray-700"
                      placeholder="N/A"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={onEditDocument ? () => onEditDocument(doc.id) : undefined}
                        className="p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        aria-label="Edit document"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(doc.id)}
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
    </div>
  );
}
