'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaCheckCircle, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import { DownloadIcon, EyeIcon, Loader2 } from "lucide-react"
import AlertBanner from './AlertBanner';
import useFileDownload from '@useverse/usefiledownload';

type DocumentStatus = 'verified' | 'required' | 'expiring' | 'expired' | 'pending' | 'review';

interface DocumentCardProps {
    title: string;
    status: DocumentStatus;
    certificateNumber?: string;
    fileUrl?: string;
    fileSize?: string;
    fileType?: string;
    uploadDate?: string;
    expiryStatus?: 'Expires Annually' | 'Expired';
    validFrom?: string;
    validTo?: string;
    errorMessage?: string;
    showReplaceSection?: boolean;
    onView?: () => void;
    onClose?: () => void;
    onReplace?: () => void;
}

export default function DocumentCard({
    title,
    status,
    certificateNumber,
    fileUrl,
    fileSize,
    fileType,
    uploadDate,
    expiryStatus,
    validFrom,
    validTo,
    errorMessage,
    showReplaceSection = false,
    onView,
    onClose,
    onReplace,
}: DocumentCardProps) {
    const [downloadStatus, startDownload] = useFileDownload();

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

    const config = statusConfig[status];

    return (
        <Card className={`shadow-sm hover:shadow-md transition-shadow border ${config.cardClass}`}>
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
                        {(status === 'expiring' || status === 'expired') && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-gray-900"
                                onClick={onClose}
                            >
                                <FaTimes className="text-sm" />
                            </Button>
                        )}
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
                {showReplaceSection && (status === 'expiring' || status === 'expired' || status === 'review') && (
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
                )}
            </CardContent>
        </Card>
    );
}
