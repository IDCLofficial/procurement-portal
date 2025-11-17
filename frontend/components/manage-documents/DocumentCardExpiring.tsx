'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaCheckCircle, FaEye, FaDownload, FaTimes } from 'react-icons/fa';

interface DocumentCardExpiringProps {
    title: string;
    status: 'Verified' | 'Required';
    certificateNumber?: string;
    fileSize?: string;
    uploadDate?: string;
    expiryStatus?: 'Expires Annually' | 'Expired';
    validFrom?: string;
    validTo?: string;
    onView?: () => void;
    onDownload?: () => void;
    onClose?: () => void;
}

export default function DocumentCardExpiring({
    title,
    status,
    certificateNumber,
    fileSize,
    uploadDate,
    expiryStatus,
    validFrom,
    validTo,
    onView,
    onDownload,
    onClose,
}: DocumentCardExpiringProps) {
    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{title}</h3>
                            <div className="flex items-center gap-1 text-xs text-green-600">
                                <FaCheckCircle className="text-xs" />
                                <span className="font-medium">{status}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-gray-900"
                            onClick={onView}
                        >
                            <FaEye className="text-sm" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-gray-900"
                            onClick={onDownload}
                        >
                            <FaDownload className="text-sm" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-gray-900"
                            onClick={onClose}
                        >
                            <FaTimes className="text-sm" />
                        </Button>
                    </div>
                </div>

                {/* Details */}
                <div className="text-xs text-gray-500 space-y-0.5 mb-3">
                    {certificateNumber && <p>{certificateNumber}</p>}
                    {fileSize && uploadDate && (
                        <p>{fileSize} • Uploaded: {uploadDate}</p>
                    )}
                </div>

                {/* Expiry Badge */}
                {expiryStatus && (
                    <div className="mb-3">
                        <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                            {expiryStatus}
                        </span>
                    </div>
                )}

                {/* Valid From/To Section */}
                {(validFrom || validTo) && (
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

                {/* Replace Document Section */}
                <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs text-gray-600 mb-2">Replace Document</p>
                    <p className="text-xs text-gray-500 mb-2">Accepted formats: PDF, JPG, PNG (Max 10MB)</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                    >
                        <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Replace
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
