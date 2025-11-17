'use client';

import { FaExclamationCircle, FaInfoCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface AlertBannerProps {
    type: 'warning' | 'info' | 'success' | 'error';
    message: string;
}

export default function AlertBanner({ type, message }: AlertBannerProps) {
    const config = {
        warning: {
            bg: 'bg-linear-to-b from-white to-yellow-50',
            border: 'border-yellow-200',
            icon: FaExclamationCircle,
            iconColor: 'text-yellow-600',
            textColor: 'text-yellow-800',
        },
        info: {
            bg: 'bg-linear-to-b from-white to-blue-50',
            border: 'border-blue-200',
            icon: FaInfoCircle,
            iconColor: 'text-blue-600',
            textColor: 'text-blue-800',
        },
        success: {
            bg: 'bg-linear-to-b from-white to-green-50',
            border: 'border-green-200',
            icon: FaCheckCircle,
            iconColor: 'text-green-600',
            textColor: 'text-green-800',
        },
        error: {
            bg: 'bg-linear-to-b from-white to-red-50',
            border: 'border-red-200',
            icon: FaTimesCircle,
            iconColor: 'text-red-600',
            textColor: 'text-red-800',
        },
    };

    const { bg, border, icon: Icon, iconColor, textColor } = config[type];

    return (
        <div className={`${bg} ${border} border rounded-lg p-4`}>
            <div className="flex items-start gap-3">
                <Icon className={`${iconColor} text-lg mt-0.5 shrink-0`} />
                <p className={`text-sm ${textColor} flex-1`}>{message}</p>
            </div>
        </div>
    );
}
