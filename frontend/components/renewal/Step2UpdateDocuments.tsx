'use client';

import { FaUpload } from 'react-icons/fa';

interface Step2UpdateDocumentsProps {
    onContinue: () => void;
}

export default function Step2UpdateDocuments({ onContinue }: Step2UpdateDocumentsProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-3 mb-6">
                <FaUpload className="text-gray-600 text-xl mt-1" />
                <div>
                    <h2 className="text-base font-semibold text-gray-900 mb-1">
                        Update Documents
                    </h2>
                    <p className="text-sm text-gray-500">
                        Upload renewed certificates
                    </p>
                </div>
            </div>

            <div className="text-center py-12 text-gray-500">
                Step 2: Update Documents - Coming soon...
            </div>
        </div>
    );
}
