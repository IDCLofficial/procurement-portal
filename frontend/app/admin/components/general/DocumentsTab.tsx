'use client';

import { useState } from 'react';
import { useAppSelector } from '@/app/admin/redux/hooks';
import type { RootState } from '@/app/admin/redux/store';
import type { CompanyDocument } from '@/app/admin/types';
import { useChangeDocumentStatusMutation } from '@/app/admin/redux/services/docsApi';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmationDialog } from './confirmation-dialog';
import Image from 'next/image';

interface DocumentsTabProps {
  documents?: CompanyDocument[];
  onDocumentsUpdated?: () => void;
}

export function DocumentsTab({ documents, onDocumentsUpdated }: DocumentsTabProps) {
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [selectedDocument, setSelectedDocument] = useState<CompanyDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [changeDocumentStatus] = useChangeDocumentStatusMutation();
  const [clarificationReason, setClarificationReason] = useState('');
  const [clarificationCustomMessage, setClarificationCustomMessage] = useState('');
  const [showClarificationForm, setShowClarificationForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<'approve' | 'clarify' | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [resultTitle, setResultTitle] = useState('');
  const [resultDescription, setResultDescription] = useState('');
  const [resultVariant, setResultVariant] = useState<'default' | 'destructive'>('default');

  const getStatusLabel = (doc: CompanyDocument | null) => {
    if (!doc) return 'Unknown';
    return typeof doc.status === 'string' ? doc.status : doc.status?.status ?? 'Unknown';
  };

  const isSelectedDocumentApproved =
    selectedDocument && getStatusLabel(selectedDocument).toLowerCase() === 'approved';

  if (!documents || documents.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Documents</h2>
        <p className="text-sm text-gray-600">No documents available for this company.</p>
      </div>
    );
  }

  const handleConfirmAction = async () => {
    if (!selectedDocument?._id || !pendingAction) {
      setConfirmOpen(false);
      setPendingAction(null);
      return;
    }

    setConfirmLoading(true);

    try {
      if (pendingAction === 'approve') {
        await changeDocumentStatus({
          documentId: selectedDocument._id,
          documentStatus: 'approved',
        }).unwrap();
      } else if (pendingAction === 'clarify') {
        const trimmedCustomMessage = clarificationCustomMessage.trim();
        const hasReason = !!clarificationReason;
        const hasCustom = !!trimmedCustomMessage;

        const finalMessage = hasReason && hasCustom
          ? `${clarificationReason} - ${trimmedCustomMessage}`
          : (clarificationReason || trimmedCustomMessage);

        await changeDocumentStatus({
          documentId: selectedDocument._id,
          documentStatus: 'needs review',
          message: finalMessage,
        }).unwrap();
      }

      if (onDocumentsUpdated) {
        onDocumentsUpdated();
      }

      setResultTitle('Success');
      setResultDescription('Document status updated successfully.');
      setResultVariant('default');
      setResultOpen(true);

      setIsPreviewOpen(false);
      setSelectedDocument(null);
      setClarificationReason('');
      setClarificationCustomMessage('');
      setShowClarificationForm(false);
    } catch (err: unknown) {
      let message = 'Failed to update document status.';

      const error = err as { data?: { message?: string }; error?: string };
      if (error?.data?.message && typeof error.data.message === 'string') {
        message = error.data.message;
      } else if (error?.error && typeof error.error === 'string') {
        message = error.error;
      }

      setResultTitle('Error');
      setResultDescription(message);
      setResultVariant('destructive');
      setResultOpen(true);
    } finally {
      setConfirmLoading(false);
      setConfirmOpen(false);
      setPendingAction(null);
    }
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-900">Documents</h2>
      <div className="mt-2 overflow-x-auto rounded-lg border border-gray-100 bg-gray-50">
        <table className="min-w-full divide-y divide-gray-100 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Document Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">File Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Type</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {documents.map((doc) => {
              const statusLabel = getStatusLabel(doc);
              return (
                <tr key={doc._id ?? doc.fileName} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-500">{doc.documentType ?? 'N/A'}</td>
                  <td className="px-4 py-2 text-gray-900">{doc.fileName ?? 'Unnamed document'}</td>

                  <td className="px-4 py-2 text-gray-500">{doc.fileType ?? doc.documentType ?? 'N/A'}</td>
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    {doc.fileUrl ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDocument(doc);
                          setIsPreviewOpen(true);
                        }}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800"
                      >
                        View
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">No file</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Dialog
        open={isPreviewOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsPreviewOpen(false);
            setSelectedDocument(null);
            setClarificationReason('');
            setClarificationCustomMessage('');
            setShowClarificationForm(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>
             
              {selectedDocument?.documentType ?? 'Document preview'}
            
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-muted-foreground text-sm">
                {selectedDocument && (
                  <div className="mt-2 space-y-1 text-xs text-gray-500">
                    <p>Name: {selectedDocument.fileName ?? 'N/A'}</p>
                    <p>Type: {selectedDocument.fileType ?? 'N/A'}</p>
                    <p>Status: {getStatusLabel(selectedDocument)}</p>
                    {selectedDocument.uploadedDate && <p>Uploaded: {selectedDocument.uploadedDate}</p>}
                    {selectedDocument.validFrom && selectedDocument.validTo && (
                      <p>
                        Valid: {selectedDocument.validFrom} - {selectedDocument.validTo}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              {selectedDocument?.fileUrl ? (
                <div className="flex justify-center w-full">
                  {selectedDocument.fileType?.toLowerCase().includes('pdf') ||
                  selectedDocument.fileUrl.toLowerCase().endsWith('.pdf') ? (
                    <iframe
                      src={selectedDocument.fileUrl}
                      title={selectedDocument.fileName ?? 'Document'}
                      className="w-full h-[400px] rounded-md border border-gray-200"
                    />
                  ) : (
                    <div className="relative h-[400px] w-full">
                      <Image
                        src={selectedDocument.fileUrl}
                        alt={selectedDocument.fileName ?? 'Document'}
                        fill
                        className="rounded-md border border-gray-200 object-contain"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No preview available for this document.</p>
              )}
            </div>
           {user?.role === "Desk officer" && <div className="flex w-full flex-col gap-4 md:w-80">
              <Button
                disabled={!!isSelectedDocumentApproved}
                onClick={async () => {
                  if (!selectedDocument?._id) {
                    setIsPreviewOpen(false);
                    setSelectedDocument(null);
                    return;
                  }
                  setPendingAction('approve');
                  setConfirmOpen(true);
                }}
              >
                Approve
              </Button>
              {showClarificationForm && (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-700">
                    Clarification reason
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={clarificationReason}
                    onChange={(e) => setClarificationReason(e.target.value)}
                  >
                    <option value="">Select a reason</option>
                    <option value="The document is expired">The document is expired</option>
                    <option value="The document does not match the document name">
                      The document does not match the document name
                    </option>
                    <option value="The document does not match the company name">
                      The document does not match the company name
                    </option>
                  </select>
                  <label className="mt-2 block text-xs font-medium text-gray-700">
                    Additional details
                  </label>
                  <textarea
                    className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={3}
                    value={clarificationCustomMessage}
                    onChange={(e) => setClarificationCustomMessage(e.target.value)}
                  />
                </div>
              )}
              <Button
                variant="outline"
                onClick={async () => {
                  if (!selectedDocument?._id) {
                    setIsPreviewOpen(false);
                    setSelectedDocument(null);
                    return;
                  }
                  if (!showClarificationForm) {
                    setShowClarificationForm(true);
                    return;
                  }
                  const trimmedCustomMessage = clarificationCustomMessage.trim();
                  const hasReason = !!clarificationReason;
                  const hasCustom = !!trimmedCustomMessage;

                  if (!hasReason && !hasCustom) {
                    setResultTitle('Missing information');
                    setResultDescription('Please select a reason or enter a custom message.');
                    setResultVariant('destructive');
                    setResultOpen(true);
                    return;
                  }
                  setPendingAction('clarify');
                  setConfirmOpen(true);
                }}
              >
                Request clarification
              </Button>
            </div>}
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsPreviewOpen(false);
                setSelectedDocument(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => {
          if (confirmLoading) return;
          setConfirmOpen(false);
          setPendingAction(null);
        }}
        onConfirm={handleConfirmAction}
        title={pendingAction === 'clarify' ? 'Request clarification' : 'Approve document'}
        description={
          pendingAction === 'clarify'
            ? 'Do you wish to request clarification for this document?'
            : 'Do you wish to approve this document?'
        }
        confirmText="Yes, continue"
        cancelText="No"
        variant={pendingAction === 'clarify' ? 'destructive' : 'default'}
        loading={confirmLoading}
      />

      <ConfirmationDialog
        isOpen={resultOpen}
        onClose={() => setResultOpen(false)}
        onConfirm={() => setResultOpen(false)}
        title={resultTitle}
        description={resultDescription}
        confirmText="OK"
        cancelText="Close"
        variant={resultVariant}
      />
    </div>
  );
}
