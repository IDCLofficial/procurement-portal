'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ComplianceDocumentItem from './ComplianceDocumentItem';
import { FaFolder} from 'react-icons/fa6';
import Link from 'next/link';

interface ComplianceDocument {
    id: string;
    name: string;
    validUntil?: string;
    expiresText?: string;
    status: 'verified' | 'pending' | string;
}

interface ComplianceDocumentsCardProps {
    documents: ComplianceDocument[];
}

export default function ComplianceDocumentsCard({
    documents,
}: ComplianceDocumentsCardProps) {
    return (
        <Card className="shadow-sm">
            <CardContent className="px-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 mb-1">Compliance Documents</h2>
                        <p className="text-sm text-gray-500">Status of your uploaded documents</p>
                    </div>
                    <Link href="/dashboard/manage-documents">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-700 hover:text-gray-900 -mt-1"
                        >
                            <FaFolder className="mr-2 text-sm" />
                            Manage
                        </Button>
                    </Link>
                </div>

                <div className="space-y-2">
                    {documents.map((doc) => (
                        <ComplianceDocumentItem
                            key={doc.id}
                            name={doc.name}
                            validUntil={doc.validUntil}
                            expiresText={doc.expiresText}
                            status={doc.status}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
