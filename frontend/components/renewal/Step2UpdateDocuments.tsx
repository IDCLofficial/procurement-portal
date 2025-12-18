'use client';

import { DocumentRenewal } from './DocumentsRequiringUpdateSection';
import RenewalDocumentUploadCard from './RenewalDocumentUploadCard';
import UploadInstructionBanner from './UploadInstructionBanner';

interface Step2UpdateDocumentsProps {
    documents: DocumentRenewal[];
}

export default function Step2UpdateDocuments({ documents }: Step2UpdateDocumentsProps) {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Upload Renewed Certificates
                </h2>
                <p className="text-sm text-gray-500">
                    Upload updated versions of expired or expiring compliance documents
                </p>
            </div>

            {/* Instruction Banner */}
            <UploadInstructionBanner message="Upload the latest versions of your certificates. All documents will be verified by BPPPI staff before approval." />

            {/* Document Upload Cards */}
            <div className="space-y-4">
                {documents.map((doc, index) => (
                    <RenewalDocumentUploadCard
                        key={index}
                        title={doc.documentName}
                        currentExpiry={doc.currentExpiry!}
                        status={doc.status}
                        documentId={doc.id}
                        hasExpiry={doc.hasExpiry}
                        documentPresetName={doc.documentName}
                    />
                ))}
            </div>
        </div>
    );
}
