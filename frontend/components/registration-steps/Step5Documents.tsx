'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FaUpload, FaEye, FaTrash, FaCheckCircle, FaFileAlt, FaFilePdf, FaFileImage } from 'react-icons/fa';
import type { DocumentRequirement } from '@/types/registration';
import { DocumentStatus } from '@/types/registration';
import sirvClient from '@/lib/sirv.class';

interface Step5DocumentsProps {
    documents: DocumentRequirement[];
    onDocumentsChange: (documents: DocumentRequirement[]) => void;
}

export default function Step5Documents({ documents, onDocumentsChange }: Step5DocumentsProps) {
    const [previewDoc, setPreviewDoc] = useState<DocumentRequirement | null>(null);
    const [zoom, setZoom] = useState(100);

    const handleFileUpload = async (docId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Please upload a PDF or image file (JPEG, PNG)');
                return;
            }

            // Validate file size (10MB limit)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                toast.error('File size must be less than 10MB');
                return;
            }

            const fileUrl = URL.createObjectURL(file);

            // Update documents state
            const updatedDocs = documents.map(doc => {
                if (doc.id === docId) {
                    return {
                        ...doc,
                        file,
                        uploaded: true,
                        fileName: file.name,
                        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                        uploadedDate: new Date().toLocaleDateString(),
                        fileType: file.type,
                        status: DocumentStatus.IDLE,
                        error: undefined,
                        fileUrl: '',
                        previewUrl: fileUrl,
                        changed: true,
                    };
                }
                return doc;
            });

            onDocumentsChange(updatedDocs);
        }
    };

    const handleRemoveFile = (docId: string) => {
        const updatedDocs = documents.map(doc => {
            if (doc.id === docId) {
                // Revoke the object URL to free up memory
                if (doc.previewUrl) {
                    URL.revokeObjectURL(doc.previewUrl);
                }
                return {
                    ...doc,
                    uploaded: false,
                    fileName: undefined,
                    fileSize: undefined,
                    uploadedDate: undefined,
                    fileUrl: undefined,
                    previewUrl: undefined,
                    fileType: undefined,
                    validFrom: undefined,
                    validTo: undefined,
                    status: DocumentStatus.IDLE,
                    error: undefined,
                    file: undefined,
                    changed: true,
                };
            }
            return doc;
        });
        onDocumentsChange(updatedDocs);
    };

    const handleRetryUpload = async (docId: string) => {
        const doc = documents.find(d => d.id === docId);
        if (!doc || !doc.file) return;

        // Set status to uploading
        const updatedDocs = documents.map(d => 
            d.id === docId ? { ...d, status: DocumentStatus.UPLOADING, error: undefined } : d
        );
        onDocumentsChange(updatedDocs);

        try {
            const fileSirvUrl = await sirvClient.uploadAttachment(doc.file);

            // Update to success
            const successDocs = documents.map(d => 
                d.id === docId ? { 
                    ...d, 
                    status: DocumentStatus.SUCCESS, 
                    fileUrl: fileSirvUrl,
                    error: undefined 
                } : d
            );
            onDocumentsChange(successDocs);
            toast.success(`${doc.name} uploaded successfully`);
        } catch (error) {
            console.error('Upload failed:', error);
            const errorDocs = documents.map(d => 
                d.id === docId ? { 
                    ...d, 
                    status: DocumentStatus.ERROR, 
                    error: 'Upload failed. Please try again.' 
                } : d
            );
            onDocumentsChange(errorDocs);
            toast.error(`Failed to upload ${doc.name}`);
        }
    };

    const handleValidityChange = (docId: string, field: 'validFrom' | 'validTo', value: string) => {
        const updatedDocs = documents.map(doc => {
            if (doc.id === docId) {
                return { ...doc, [field]: value, changed: true };
            }
            return doc;
        });
        onDocumentsChange(updatedDocs);
    };

    const handlePreview = (doc: DocumentRequirement) => {
        setPreviewDoc(doc);
    };

    const closePreview = () => {
        setPreviewDoc(null);
        setZoom(100);
    };

    return (
        <div className="space-y-6">
            {/* Documents List */}
            {documents.map((doc) => (
                <div key={doc.id} className="border rounded-lg p-5 space-y-4 bg-gray-50">
                    {/* Document Header */}
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                            {doc.required && (
                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                    Required
                                </span>
                            )}
                            {doc.validFor && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                                    Valid for {doc.validFor}
                                </span>
                            )}
                        </div>
                        {doc.uploaded && (
                            <div className="flex items-center gap-1 text-sm">
                                {doc.status === DocumentStatus.UPLOADING && (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                        <span className="text-blue-600">Uploading...</span>
                                    </>
                                )}
                                {doc.status === DocumentStatus.SUCCESS && (
                                    <>
                                        <FaCheckCircle className="text-green-600" />
                                        <span className="text-green-600">Uploaded</span>
                                    </>
                                )}
                                {doc.status === DocumentStatus.ERROR && (
                                    <>
                                        <span className="text-red-600">❌ Upload Failed</span>
                                    </>
                                )}
                                {doc.status === DocumentStatus.IDLE && (
                                    <>
                                        <span className="text-gray-600">Ready to Upload</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Validity Period (if applicable) */}
                    {doc.validFor && (
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor={`validFrom-${doc.id}`} className="text-xs">
                                    Valid From
                                </Label>
                                <Input
                                    id={`validFrom-${doc.id}`}
                                    type="date"
                                    value={doc.validFrom || ''}
                                    onChange={(e) => handleValidityChange(doc.id, 'validFrom', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`validTo-${doc.id}`} className="text-xs">
                                    Valid To
                                </Label>
                                <Input
                                    id={`validTo-${doc.id}`}
                                    type="date"
                                    value={doc.validTo || ''}
                                    onChange={(e) => handleValidityChange(doc.id, 'validTo', e.target.value)}
                                    min={doc.validFrom ? (() => {
                                        const date = new Date(doc.validFrom);
                                        date.setFullYear(date.getFullYear() + 1);
                                        return date.toISOString().split('T')[0];
                                    })() : undefined}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    )}

                    {/* Upload Section */}
                    {!doc.uploaded ? (
                        <div className="relative">
                            <input
                                type="file"
                                id={`file-${doc.id}`}
                                accept=".pdf,.png,.jpg,.jpeg"
                                onChange={(e) => handleFileUpload(doc.id, e)}
                                className="hidden"
                            />
                            <label
                                htmlFor={`file-${doc.id}`}
                                className="flex items-center justify-between w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-theme-green hover:bg-gray-100 transition-colors"
                            >
                                <span className="text-sm text-gray-600">Choose File (PDF, PNG, or JPEG)</span>
                                <FaUpload className="text-gray-400" />
                            </label>
                        </div>
                    ) : (
                        <div className="bg-linear-to-b  from-white to-green-100 border border-green-400 rounded-lg p-4 shadow-lg shadow-black/5">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1 max-w-[70%]">
                                    {(doc.fileType || doc.file?.type)?.includes('pdf') ? (
                                        <FaFilePdf className="text-red-600 mt-1 text-lg" />
                                    ) : (doc.fileType || doc.file?.type)?.startsWith('image/') ? (
                                        <FaFileImage className="text-blue-600 mt-1 text-lg" />
                                    ) : (
                                        <FaFileAlt className="text-green-600 mt-1" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate text-gray-900">
                                            {doc.fileName || doc.file?.name}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-xs text-gray-600">
                                                {doc.fileSize || doc.file?.size} • Uploaded {doc.uploadedDate || doc.file?.lastModified}
                                            </p>
                                            {(doc.fileType || doc.file?.type) && (
                                                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                                    {(doc.fileType || doc.file?.type)?.includes('pdf') ? 'PDF' : (doc.fileType || doc.file?.type)?.includes('png') ? 'PNG' : 'JPEG'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handlePreview(doc)}
                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                        <FaEye className="mr-1" />
                                        Preview
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveFile(doc.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            </div>

                            {/* Error Display */}
                            {doc.status === DocumentStatus.ERROR && doc.error && (
                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700">{doc.error}</p>
                                </div>
                            )}

                            {/* Replace Document Option */}
                            <div className="mt-3 pt-3 border-t border-green-200">
                                {doc.status === DocumentStatus.ERROR ? (
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => handleRetryUpload(doc.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        Retry Upload
                                    </Button>
                                ) : (
                                    <>
                                        <input
                                            type="file"
                                            id={`replace-${doc.id}`}
                                            accept=".pdf,.png,.jpg,.jpeg"
                                            onChange={(e) => handleFileUpload(doc.id, e)}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor={`replace-${doc.id}`}
                                            className="text-xs text-gray-600 hover:text-gray-900 cursor-pointer underline"
                                        >
                                            Replace document
                                        </label>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Preview Modal */}
            {previewDoc && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closePreview}>
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{previewDoc.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{previewDoc.fileName || previewDoc.file?.name}</p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={closePreview}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ✕
                            </Button>
                        </div>
                        <div className="p-6">
                            {previewDoc.previewUrl || previewDoc.fileUrl || previewDoc.file ? (
                                <div className="space-y-4">
                                    {/* Render based on file type */}
                                    {(previewDoc.fileType || previewDoc.file?.type)?.startsWith('image/') ? (
                                        <div className="flex justify-center bg-gray-50 rounded-lg p-4">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={previewDoc.previewUrl || previewDoc.fileUrl}
                                                alt={previewDoc.fileName || previewDoc.file?.name}
                                                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                                            />
                                        </div>
                                    ) : (previewDoc.fileType || previewDoc.file?.type)?.includes('pdf') ? (
                                        <div className="relative bg-gray-50 rounded-lg overflow-hidden">
                                            {/* Zoom Controls */}
                                            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setZoom(Math.max(50, zoom - 25))}
                                                    disabled={zoom <= 50}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    −
                                                </Button>
                                                <span className="text-xs font-medium min-w-12 text-center">{zoom}%</span>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setZoom(Math.min(200, zoom + 25))}
                                                    disabled={zoom >= 200}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    +
                                                </Button>
                                            </div>
                                            
                                            <div className="overflow-auto h-[70vh]" style={{ zoom: `${zoom}%` }}>
                                                <iframe
                                                    src={`${previewDoc.previewUrl || previewDoc.fileUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                                                    className="w-full h-full border-0"
                                                    title={previewDoc.fileName || previewDoc.file?.name}
                                                    style={{ minHeight: '70vh' }}
                                                />
                                            </div>
                                            
                                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-xs text-gray-600">
                                                <p className="font-medium">PDF Viewer</p>
                                                <p className="text-gray-500">Use scroll to navigate pages</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-100 rounded-lg p-8 text-center">
                                            <FaFileAlt className="text-6xl text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 mb-2">Preview not available</p>
                                            <p className="text-sm text-gray-500">Click &ldquo;Open in New Tab&rdquo; to view the document</p>
                                        </div>
                                    )}
                                    {previewDoc.validFrom && previewDoc.validTo && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-sm text-blue-900">
                                                <span className="font-medium">Valid Period:</span> {previewDoc.validFrom} to {previewDoc.validTo}
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex gap-3">
                                        <Button
                                            type="button"
                                            className="flex-1 bg-theme-green hover:bg-theme-green/90"
                                            onClick={() => {
                                                if (previewDoc.previewUrl || previewDoc.fileUrl) {
                                                    window.open(previewDoc.previewUrl || previewDoc.fileUrl, '_blank');
                                                }
                                            }}
                                        >
                                            Open in New Tab
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => {
                                                const url = previewDoc.previewUrl || previewDoc.fileUrl;
                                                if (url && (previewDoc.fileName || previewDoc.file?.name)) {
                                                    const link = document.createElement('a');
                                                    link.href = url;
                                                    link.download = previewDoc.fileName || previewDoc.file?.name || previewDoc.name;
                                                    link.click();
                                                }
                                            }}
                                        >
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-100 rounded-lg p-8 text-center">
                                    <FaFileAlt className="text-6xl text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-2">Document Preview</p>
                                    <p className="text-sm text-gray-500">{previewDoc.fileName}</p>
                                    <p className="text-xs text-gray-400 mt-2">{previewDoc.fileSize} • Uploaded {previewDoc.uploadedDate}</p>
                                    {previewDoc.validFrom && previewDoc.validTo && (
                                        <div className="mt-4 pt-4 border-t border-gray-300">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Valid Period:</span> {previewDoc.validFrom} to {previewDoc.validTo}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Important Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex gap-2">
                    <span className="text-amber-600 text-lg">⚠️</span>
                    <div>
                        <p className="text-sm font-semibold text-amber-900">Important:</p>
                        <p className="text-sm text-amber-900 mt-1">
                            Documents with expiry dates (TCC, PENCOM, ITF, NSITF) must be renewed annually. 
                            You will receive reminders 30, 60, and 7 days before expiry to reupload updated certificates.
                        </p>
                        <p className="text-sm text-amber-900 mt-2">
                            Accepted formats: PDF, PNG, JPEG
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
