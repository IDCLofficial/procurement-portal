'use client';

import { FaInfoCircle } from 'react-icons/fa';

interface InfoBannerProps {
    message: string;
}

export default function InfoBanner({ message }: InfoBannerProps) {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
                <FaInfoCircle className="text-blue-600 text-lg mt-0.5 shrink-0" />
                <p className="text-sm text-blue-800 flex-1">
                    {message}
                </p>
            </div>
        </div>
    );
}
