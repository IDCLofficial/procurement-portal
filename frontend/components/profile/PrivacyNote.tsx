'use client';

import { FaExclamationTriangle } from 'react-icons/fa';

interface PrivacyNoteProps {
    message: string;
}

export default function PrivacyNote({ message }: PrivacyNoteProps) {
    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-yellow-600 text-sm mt-0.5 shrink-0" />
                <div className="flex-1">
                    <p className="text-sm text-yellow-800">
                        <span className="font-semibold">Privacy Note:</span> {message}
                    </p>
                </div>
            </div>
        </div>
    );
}
