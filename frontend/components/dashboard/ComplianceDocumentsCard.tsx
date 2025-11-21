'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ComplianceDocumentItem from './ComplianceDocumentItem';
import { FaFolder} from 'react-icons/fa6';

interface ComplianceDocument {
    id: string;
    name: string;
    validUntil?: string;
    expiresText?: string;
    status: 'verified' | 'pending' | 'expired';
}

interface ComplianceDocumentsCardProps {
    documents: ComplianceDocument[];
    onManage?: () => void;
    onDownload?: (documentId: string) => void;
}

export default function ComplianceDocumentsCard({
    documents,
    onManage,
    onDownload,
}: ComplianceDocumentsCardProps) {
    return (
        <Card className="shadow-sm">
            <CardContent className="px-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 mb-1">Compliance Documents</h2>
                        <p className="text-sm text-gray-500">Status of your uploaded documents</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-700 hover:text-gray-900 -mt-1"
                        onClick={onManage}
                    >
                        <FaFolder className="mr-2 text-sm" />
                        Manage
                    </Button>
                </div>

                <div className="space-y-2">
                    {documents.map((doc) => (
                        <ComplianceDocumentItem
                            key={doc.id}
                            name={doc.name}
                            validUntil={doc.validUntil}
                            expiresText={doc.expiresText}
                            onDownload={() => onDownload?.(doc.id)}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
