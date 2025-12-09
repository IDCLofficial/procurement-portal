'use client';

import { FaFileAlt } from 'react-icons/fa';

interface DocumentUpdateItemProps {
    title: string;
    expiryDate?: string;
    currentExpiry?: string;
    status: 'expiring_soon' | 'expired';
}

export default function DocumentUpdateItem({ title, expiryDate, currentExpiry, status }: DocumentUpdateItemProps) {
    const displayExpiry = expiryDate || currentExpiry || 'N/A';
    const statusConfig = {
        expiring_soon: {
            label: 'Expiring Soon',
            bgColor: 'bg-orange-100',
            textColor: 'text-orange-700',
        },
        expired: {
            label: 'Expired',
            bgColor: 'bg-red-100',
            textColor: 'text-red-700',
        },
    };

    const config = statusConfig[status];

    return (
        <div className="flex items-center justify-between py-2 border border-yellow-300 shadow-md shadow-black/5 bg-white px-2 rounded-lg">
            <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <FaFileAlt className="text-orange-600 text-lg" />
                </div>
                <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{title}</h4>
                    <p className="text-xs text-gray-500">Current expiry: {displayExpiry}</p>
                </div>
            </div>
            <span
                className={`inline-flex items-center px-3 py-1 ${config.bgColor} ${config.textColor} text-xs font-medium rounded-full`}
            >
                {config.label}
            </span>
        </div>
    );
}
