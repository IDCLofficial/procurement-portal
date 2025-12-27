'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FaCheckCircle, FaExclamationCircle, FaUpload, FaFilePdf, FaFileImage, FaFileAlt, FaTrash } from 'react-icons/fa';
import { DownloadIcon, EyeIcon, Loader2 } from "lucide-react";
import AlertBanner from './AlertBanner';
import useFileDownload from '@useverse/usefiledownload';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import sirvClient from '@/lib/sirv.class';
import { useCompleteVendorRegistrationMutation, useGetCompanyDetailsQuery } from '@/store/api/vendor.api';
import { VendorSteps } from '@/store/api/enum';
import { CompleteVendorRegistrationRequest, ResponseError } from '@/store/api/types';
import { useAuth } from '@/components/providers/public-service/AuthProvider';

type DocumentStatus = 'verified' | 'required' | 'expiring' | 'expired' | 'pending' | 'review';

interface DocumentCardProps {
    id: string;
    title: string;
    status: DocumentStatus;
    certificateNumber?: string;
    isSelected?: boolean;
    fileUrl?: string;
    fileSize?: string;
    fileType?: string;
    uploadDate?: string;
    expiryStatus?: 'Expires Annually' | 'Expired';
    validFrom?: string;
    validTo?: string;
    errorMessage?: string;
    showReplaceSection?: boolean;
    hasValidityPeriod?: boolean;
    documentId?: string;
    documentPresetName?: string;
    onView?: () => void;
}

export default function DocumentCard({
    id,
    title,
    status: initialStatus,
    certificateNumber,
    isSelected,
    fileUrl,
    fileSize,
    fileType,
    uploadDate,
    expiryStatus,
    validFrom,
    validTo,
    errorMessage,
    showReplaceSection = false,
    hasValidityPeriod = false,
    documentId,
    documentPresetName,
    onView,
}: DocumentCardProps) {
    const { company, documents: docPresets, certificate } = useAuth();
    const [downloadStatus, startDownload] = useFileDownload();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [localValidFrom, setLocalValidFrom] = useState(validFrom || '');
    const [localValidTo, setLocalValidTo] = useState(validTo || '');
    const [isReplacing, setIsReplacing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string>('');
    const [completeVendorRegistration] = useCompleteVendorRegistrationMutation();
    const { refetch } = useGetCompanyDetailsQuery()
    
    const status = isUploading ? 'pending' : initialStatus;

    const getFileExtension = (mimeType?: string): string => {
        if (!mimeType) return 'pdf';
        
        // Handle MIME types (e.g., "image/png" -> "png")
        if (mimeType.includes('/')) {
            const extension = mimeType.split('/')[1];
            // Handle special cases
            if (extension === 'jpeg') return 'jpg';
            return extension;
        }
        
        // If it's already just an extension, return it
        return mimeType;
    };

    const handleDownload = () => {
        if (!fileUrl) return;
        const extension = getFileExtension(fileType);
        startDownload(fileUrl, `${title}.${extension}`);
    };
    // Status configuration
    const statusConfig = {
        verified: {
            icon: <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>,
            iconBg: 'bg-gray-100',
            badge: (
                <div className="flex items-center gap-1 text-xs text-green-600">
                    <FaCheckCircle className="text-xs" />
                    <span className="font-medium">Verified</span>
                </div>
            ),
            cardClass: 'border-gray-200',
        },
        required: {
            icon: <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>,
            iconBg: 'bg-gray-100',
            badge: <span className="text-xs text-gray-500">Required</span>,
            cardClass: 'border-gray-200',
        },
        expiring: {
            icon: <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>,
            iconBg: 'bg-gray-100',
            badge: (
                <div className="flex items-center gap-1 text-xs text-green-600">
                    <FaCheckCircle className="text-xs" />
                    <span className="font-medium">Verified</span>
                </div>
            ),
            cardClass: 'border-gray-200',
        },
        expired: {
            icon: <FaExclamationCircle className="text-sm text-red-600" />,
            iconBg: 'bg-red-100',
            badge: (
                <div className="flex items-center gap-1 text-xs text-red-600">
                    <FaExclamationCircle className="text-xs" />
                    <span className="font-medium">Expired</span>
                </div>
            ),
            cardClass: 'border-red-200 bg-red-50/30',
        },
        review: {
            icon: <FaExclamationCircle className="text-sm text-red-600" />,
            iconBg: 'bg-red-100',
            badge: (
                <div className="flex items-center gap-1 text-xs text-red-600">
                    <FaExclamationCircle className="text-xs" />
                    <span className="font-medium">Needs Review</span>
                </div>
            ),
            cardClass: 'border-red-200 bg-red-50/30',
        },
        pending: {
            icon: <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>,
            iconBg: 'bg-blue-100',
            badge: (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Pending Verification</span>
                </div>
            ),
            cardClass: 'border-blue-200 bg-blue-50/30',
        },
    };

    const handleUpload = useCallback(async () => {
        if (status !== 'review') {
            toast.error('Document is not in review status');
            return;
        }
        if (!selectedFile) {
            toast.error('Please select a file');
            return;
        }
        if (hasValidityPeriod && (!localValidFrom || !localValidTo)) {
            toast.error('Please provide validity dates');
            return;
        }

        // Find document preset
        const docPreset = docPresets?.find(d =>
            d.documentName.toLowerCase().trim() === (documentPresetName || title).toLowerCase().trim()
        );

        setIsUploading(true);
        setUploadError('');

        try {
            // Upload file to Sirv
            toast.loading(`Uploading ${title}...`, { id: `upload-${documentId || title}` });
            const uploadedFileUrl = await sirvClient.uploadAttachment(selectedFile);

            // Prepare document payload
            const documentPayload = {
                id: documentId || title,
                fileUrl: uploadedFileUrl,
                validFrom: localValidFrom || '',
                validTo: localValidTo || '',
                documentType: title,
                uploadedDate: new Date().toISOString().split('T')[0],
                fileName: selectedFile.name,
                fileSize: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
                fileType: selectedFile.type,
                validFor: docPreset?.renewalFrequency || '',
                hasValidityPeriod: hasValidityPeriod || false,
            };

            // Get all current documents
            const currentDocs = company?.documents || [];

            // Check if document already exists
            const existingDocIndex = currentDocs.findIndex(d =>
                d.documentType.toLowerCase().trim() === title.toLowerCase().trim()
            );

            let updatedDocuments;
            if (existingDocIndex !== -1) {
                // Replace existing document
                updatedDocuments = [...currentDocs];
                updatedDocuments[existingDocIndex] = {
                    ...currentDocs[existingDocIndex],
                    ...documentPayload,
                };
            } else {
                // Add new document
                updatedDocuments = [...currentDocs, documentPayload];
            }

            // Submit to API
            const payload = {
                [VendorSteps.DOCUMENTS]: updatedDocuments.map((doc) => ({
                    id: 'id' in doc ? doc.id : doc._id,
                    fileUrl: doc.fileUrl,
                    validFrom: doc.validFrom,
                    validTo: doc.validTo,
                    documentType: doc.documentType,
                    uploadedDate: doc.uploadedDate,
                    fileName: doc.fileName,
                    fileSize: doc.fileSize,
                    fileType: doc.fileType,
                    validFor: doc.validFor,
                    hasValidityPeriod: doc.hasValidityPeriod,
                })),
                mode: (certificate ? 'renewal' : undefined) as CompleteVendorRegistrationRequest['mode']    
            };

            const response = await completeVendorRegistration(payload);

            if (response.error) {
                throw new Error((response.error as ResponseError["error"]).data.message);
            }

            toast.dismiss(`upload-${documentId || title}`);
            toast.success(`${title} uploaded successfully!`);

            // Reset state
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setSelectedFile(null);
            setPreviewUrl('');
            setIsReplacing(false);
            setLocalValidFrom('');
            setLocalValidTo('');
            refetch();
        } catch (error) {
            console.error('Upload failed:', error);
            toast.dismiss(`upload-${documentId || title}`);
            toast.error((error as Error).message || `Failed to upload ${title}`);
            setUploadError((error as Error).message || 'Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    }, [selectedFile, localValidFrom, localValidTo, company, documentId, title, docPresets, completeVendorRegistration, refetch, previewUrl, documentPresetName, hasValidityPeriod, status, certificate]);

    const config = statusConfig[status];

    return (
        <Card id={id} className={`shadow-sm relative hover:shadow-md transition-shadow scroll-mt-40 border ${config.cardClass} ${isSelected ? 'ring-2 ring-blue-500/50' : ''}`}>
            {isSelected && (
                <div className="absolute top-0 left-0 w-full h-full bg-blue-500/50" />
            )}
            <CardContent>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                        <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${config.iconBg}`}>
                            {config.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{title}</h3>
                            {config.badge}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-gray-900"
                            onClick={onView}
                        >
                            <EyeIcon className="text-sm" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-gray-900"
                            onClick={handleDownload}
                            disabled={downloadStatus === 'downloading'}
                        >
                            {downloadStatus === 'downloading' ? (
                                <Loader2 className="text-sm animate-spin" />
                            ) : (
                                <DownloadIcon className="text-sm" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Details */}
                {(certificateNumber || fileSize || uploadDate) && (
                    <div className="text-xs text-gray-500 space-y-0.5 mb-3">
                        {certificateNumber && <p>{certificateNumber}</p>}
                        {fileSize && uploadDate && (
                            <p>{fileSize} • Uploaded: {uploadDate}</p>
                        )}
                    </div>
                )}

                {/* Expiry Badge */}
                {expiryStatus && status === 'expiring' && (
                    <div className="mb-3">
                        <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                            {expiryStatus}
                        </span>
                    </div>
                )}

                {/* Valid From/To Section */}
                {(validFrom || validTo) && status === 'expiring' && (
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        {validFrom && (
                            <div className="bg-gray-50 rounded p-2">
                                <p className="text-xs text-gray-500 mb-0.5">Valid From</p>
                                <p className="text-sm font-medium text-gray-900">{validFrom}</p>
                            </div>
                        )}
                        {validTo && (
                            <div className="bg-gray-50 rounded p-2">
                                <p className="text-xs text-gray-500 mb-0.5">Valid To</p>
                                <p className="text-sm font-medium text-gray-900">{validTo}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Error Alert for Expired */}
                {errorMessage && (status === 'expired' || status === 'review') && (
                    <div className="mb-3">
                        <AlertBanner type="error" message={errorMessage} />
                    </div>
                )}

                {/* Replace Document Section */}
                {showReplaceSection && (status === 'review' || status === 'required') && (
                    <div className="border-t border-gray-200 pt-3">
                        {!isReplacing && !selectedFile ? (
                            <>
                                <p className="text-xs text-gray-600 mb-2">{status === 'required' ? 'Upload Document' : 'Replace Document'}</p>
                                <p className="text-xs text-gray-500 mb-2">Accepted formats: PDF, JPG, PNG (Max 10MB)</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-xs"
                                    onClick={() => setIsReplacing(true)}
                                >
                                    <FaUpload className="mr-1.5" />
                                    {status === 'required' ? 'Upload' : 'Replace'}
                                </Button>
                            </>
                        ) : (
                            <div className="space-y-3">
                                {/* Validity Period Fields */}
                                {hasValidityPeriod && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label htmlFor={`validFrom-${title}`} className="text-xs">
                                                Valid From
                                            </Label>
                                            <Input
                                                id={`validFrom-${title}`}
                                                type="date"
                                                value={localValidFrom}
                                                onChange={(e) => setLocalValidFrom(e.target.value)}
                                                className="mt-1 h-8 text-xs"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor={`validTo-${title}`} className="text-xs">
                                                Valid To
                                            </Label>
                                            <Input
                                                id={`validTo-${title}`}
                                                type="date"
                                                value={localValidTo}
                                                onChange={(e) => setLocalValidTo(e.target.value)}
                                                min={localValidFrom ? (() => {
                                                    const date = new Date(localValidFrom);
                                                    date.setFullYear(date.getFullYear() + 1);
                                                    return date.toISOString().split('T')[0];
                                                })() : undefined}
                                                className="mt-1 h-8 text-xs"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* File Upload Section */}
                                {!selectedFile ? (
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id={`file-${title}`}
                                            accept=".pdf,.png,.jpg,.jpeg"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    // Validate file type
                                                    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
                                                    if (!allowedTypes.includes(file.type)) {
                                                        toast.error('Please upload a PDF or image file (JPEG, PNG)');
                                                        return;
                                                    }

                                                    // Validate file size (10MB limit)
                                                    const maxSize = 10 * 1024 * 1024;
                                                    if (file.size > maxSize) {
                                                        toast.error('File size must be less than 10MB');
                                                        return;
                                                    }

                                                    setSelectedFile(file);
                                                    setPreviewUrl(URL.createObjectURL(file));
                                                }
                                            }}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor={`file-${title}`}
                                            className="flex items-center justify-between w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-teal-600 hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-xs text-gray-600">Choose File (PDF, PNG, or JPEG)</span>
                                            <FaUpload className="text-gray-400 text-xs" />
                                        </label>
                                    </div>
                                ) : (
                                    <div className="bg-linear-to-b from-white to-green-50 border border-green-400 rounded p-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-2 flex-1">
                                                {selectedFile.type.includes('pdf') ? (
                                                    <FaFilePdf className="text-red-600 mt-0.5 text-sm" />
                                                ) : selectedFile.type.startsWith('image/') ? (
                                                    <FaFileImage className="text-blue-600 mt-0.5 text-sm" />
                                                ) : (
                                                    <FaFileAlt className="text-green-600 mt-0.5 text-sm" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium truncate text-gray-900">
                                                        {selectedFile.name}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (previewUrl) {
                                                            window.open(previewUrl, '_blank');
                                                        }
                                                    }}
                                                    className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
                                                >
                                                    <EyeIcon className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (previewUrl) {
                                                            URL.revokeObjectURL(previewUrl);
                                                        }
                                                        setSelectedFile(null);
                                                        setPreviewUrl('');
                                                    }}
                                                    className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                                                >
                                                    <FaTrash className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Upload Error */}
                                {uploadError && (
                                    <div className="p-2 bg-red-50 border border-red-200 rounded">
                                        <p className="text-xs text-red-700">{uploadError}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="flex-1 bg-teal-700 hover:bg-teal-800 text-white h-8 text-xs"
                                        onClick={handleUpload}
                                        disabled={isUploading || !selectedFile}
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <FaUpload className="mr-1" />
                                                Upload
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs"
                                        onClick={() => {
                                            if (previewUrl) {
                                                URL.revokeObjectURL(previewUrl);
                                            }
                                            setSelectedFile(null);
                                            setPreviewUrl('');
                                            setIsReplacing(false);
                                            setUploadError('');
                                        }}
                                        disabled={isUploading}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
