'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaEye, FaDownload, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import AlertBanner from './AlertBanner';

interface DocumentCardExpiredProps {
    title: string;
    certificateNumber?: string;
    fileSize?: string;
    uploadDate?: string;
    errorMessage: string;
    onView?: () => void;
    onDownload?: () => void;
    onClose?: () => void;
    onReplace?: () => void;
}

export default function DocumentCardExpired({
    title,
    certificateNumber,
    fileSize,
    uploadDate,
    errorMessage,
    onView,
    onDownload,
    onClose,
    onReplace,
}: DocumentCardExpiredProps) {
    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow border border-red-200 bg-red-50/30">
            <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center shrink-0">
                            <FaExclamationCircle className="text-sm text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{title}</h3>
                            <div className="flex items-center gap-1 text-xs text-red-600">
                                <FaExclamationCircle className="text-xs" />
                                <span className="font-medium">Expired</span>
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
                {(certificateNumber || fileSize || uploadDate) && (
                    <div className="text-xs text-gray-500 space-y-0.5 mb-3">
                        {certificateNumber && <p>{certificateNumber}</p>}
                        {fileSize && uploadDate && (
                            <p>{fileSize} • Uploaded: {uploadDate}</p>
                        )}
                    </div>
                )}

                {/* Error Alert */}
                <div className="mb-3">
                    <AlertBanner type="error" message={errorMessage} />
                </div>

                {/* Replace Document Section */}
                <div className="border-t border-gray-200 pt-3">
                    <p className="text-xs text-gray-600 mb-2">Replace Document</p>
                    <p className="text-xs text-gray-500 mb-2">Accepted formats: PDF, JPG, PNG (Max 10MB)</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        onClick={onReplace}
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
