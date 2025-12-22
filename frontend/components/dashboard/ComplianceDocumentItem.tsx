'use client';

import Link from 'next/link';
import { FaFile, FaGear } from 'react-icons/fa6';
import { Button } from '../ui/button';

interface ComplianceDocumentItemProps {
    name: string;
    validUntil?: string;
    expiresText?: string;
    status: 'verified' | 'pending' | string;
    id: string;
}

export default function ComplianceDocumentItem({
    name,
    validUntil,
    expiresText,
    status,
    id,
}: ComplianceDocumentItemProps) {
    const getStatusBadge = () => {
        switch (status) {
            case 'verified':
                return (
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-xl border border-black/5">
                        Verified
                    </span>
                );
            case 'pending':
                return (
                    <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-xl border border-black/5">
                        Pending
                    </span>
                );
            case 'expired':
                return (
                    <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-black/5">
                        Expired
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-black/5">
                        {status}
                    </span>
                );
        }
    };
    return (
        <div className="flex items-center justify-between py-2 px-3 rounded-lg border border-gray-100 transition-colors hover:bg-gray-50 duration-300">
            <div className="flex items-center gap-3 flex-1">
                <FaFile className="text-gray-400 text-lg shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    {validUntil && (
                        <p className="text-xs text-gray-500 mt-0.5">
                            Valid until: {validUntil}
                            {expiresText && <span className="text-orange-600 ml-1">• {expiresText}</span>}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3 ml-4">
                {getStatusBadge()}
                {(status.toLowerCase() === 'needs review' || status.toLowerCase() === 'expired') && <Link href={`/dashboard/manage-documents?id=${id}`}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-100 cursor-pointer"
                    >
                        <FaGear className="text-gray-600" />
                    </Button>
                </Link>}
            </div>
        </div>
    );
}
