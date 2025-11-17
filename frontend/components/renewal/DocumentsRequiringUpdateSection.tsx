'use client';

import { FaExclamationCircle } from 'react-icons/fa';
import DocumentUpdateItem from './DocumentUpdateItem';

interface Document {
    title: string;
    expiryDate?: string;
    currentExpiry?: string;
    status: 'expiring_soon' | 'expired';
}

interface DocumentsRequiringUpdateSectionProps {
    documents: Document[];
}

export default function DocumentsRequiringUpdateSection({
    documents,
}: DocumentsRequiringUpdateSectionProps) {
    return (
        <div className="bg-linear-to-b from-white to-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-5">
                <FaExclamationCircle className="text-yellow-500 text-xl mt-1" />
                Documents Requiring Update
            </h3>
            <div className="space-y-3">
                {documents.map((doc, index) => (
                    <DocumentUpdateItem
                        key={index}
                        title={doc.title}
                        expiryDate={doc.expiryDate}
                        currentExpiry={doc.currentExpiry}
                        status={doc.status}
                    />
                ))}
            </div>
        </div>
    );
}
