'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaCheckCircle, FaEye, FaDownload } from 'react-icons/fa';

interface DocumentCardVerifiedProps {
    title: string;
    status: 'Verified' | 'Required';
    certificateNumber?: string;
    fileSize?: string;
    uploadDate?: string;
    onView?: () => void;
    onDownload?: () => void;
}

export default function DocumentCardVerified({
    title,
    status,
    certificateNumber,
    fileSize,
    uploadDate,
    onView,
    onDownload,
}: DocumentCardVerifiedProps) {
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
                            {status === 'Verified' && (
                                <div className="flex items-center gap-1 text-xs text-green-600">
                                    <FaCheckCircle className="text-xs" />
                                    <span className="font-medium">{status}</span>
                                </div>
                            )}
                            {status === 'Required' && (
                                <span className="text-xs text-gray-500">{status}</span>
                            )}
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
                    </div>
                </div>

                {/* Details */}
                {(certificateNumber || fileSize || uploadDate) && (
                    <div className="text-xs text-gray-500 space-y-0.5">
                        {certificateNumber && <p>CAC: {certificateNumber}</p>}
                        {fileSize && uploadDate && (
                            <p>{fileSize} • Uploaded: {uploadDate}</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
