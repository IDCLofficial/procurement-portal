'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaDownload, FaEye, FaEllipsisV, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import AlertBanner from './AlertBanner';

interface CertificateCardProps {
    title: string;
    certificateNumber: string;
    issueDate: string;
    expiryDate: string;
    status: 'active' | 'expiring_soon' | 'expired';
    validFor?: string;
    expiryWarning?: string;
    rejectionReason?: string;
    onView?: () => void;
    onDownload?: () => void;
    onMore?: () => void;
}

export default function CertificateCard({
    title,
    certificateNumber,
    issueDate,
    expiryDate,
    status,
    validFor,
    expiryWarning,
    rejectionReason,
    onView,
    onDownload,
    onMore,
}: CertificateCardProps) {
    const statusConfig = {
        active: {
            badge: 'bg-green-100 text-green-700 border-green-200',
            label: 'Active',
            icon: FaCheckCircle,
        },
        expiring_soon: {
            badge: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            label: 'Expiring Soon',
            icon: FaExclamationCircle,
        },
        expired: {
            badge: 'bg-red-100 text-red-700 border-red-200',
            label: 'Expired',
            icon: FaExclamationCircle,
        },
    };

    const config = statusConfig[status];
    const StatusIcon = config.icon;

    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
                            <p className="text-xs text-gray-500">Certificate No: {certificateNumber}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${config.badge} text-xs font-medium rounded-full border`}>
                            <StatusIcon className="text-xs" />
                            {config.label}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-gray-900"
                            onClick={onMore}
                        >
                            <FaEllipsisV className="text-sm" />
                        </Button>
                    </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Issue Date</p>
                        <p className="text-sm font-medium text-gray-900">{issueDate}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Expiry Date</p>
                        <p className="text-sm font-medium text-gray-900">{expiryDate}</p>
                    </div>
                </div>

                {validFor && (
                    <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Valid For</p>
                        <p className="text-sm text-gray-700">{validFor}</p>
                    </div>
                )}

                {/* Warnings/Alerts */}
                {expiryWarning && status === 'expiring_soon' && (
                    <div className="mb-4">
                        <AlertBanner type="warning" message={expiryWarning} />
                    </div>
                )}

                {rejectionReason && status === 'expired' && (
                    <div className="mb-4">
                        <AlertBanner type="error" message={rejectionReason} />
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={onView}
                    >
                        <FaEye className="mr-2 text-sm" />
                        View
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={onDownload}
                    >
                        <FaDownload className="mr-2 text-sm" />
                        Download
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
