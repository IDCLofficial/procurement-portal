'use client';

import { FaExclamationCircle } from 'react-icons/fa';

interface WarningAlertProps {
    title: string;
    children: React.ReactNode;
}

export default function WarningAlert({ title, children }: WarningAlertProps) {
    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
                <FaExclamationCircle className="text-yellow-600 text-lg mt-0.5 shrink-0" />
                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-yellow-900 mb-2">{title}</h4>
                    <div className="text-sm text-yellow-800">{children}</div>
                </div>
            </div>
        </div>
    );
}
