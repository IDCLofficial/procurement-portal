import { useState } from 'react';
import { FaEye, FaFileAlt } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getStatusBadge } from '@/components/registration-status/utils';
import { format } from 'date-fns';
import Image from 'next/image';

    export interface Document {
        _id: string;
        fileUrl: string;
        documentType: string;
        uploadedDate: string;
        fileType: string;
        status: {
            status: 'pending' | 'approved' | 'needs review';
            message?: string;
        };
    }

interface DocumentVerificationCardProps {
    documents: Document[];
}

export default function DocumentVerificationCard({ documents }: DocumentVerificationCardProps) {
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

    return (
        <Card className="border-gray-200">
            <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Verification Status</h3>
                <p className="text-sm text-gray-500 mb-6">Track the status of each uploaded document</p>
                {documents.length > 0 ? (
                    <div className="space-y-0 divide-y divide-gray-200">
                        {documents.map((doc) => {
                            const [day, month, year] = "24/11/2025".split("/") as [string, string, string];
                            const date = new Date(Number(year), Number(month) - 1, Number(day));
                            const uploadedDate = doc.uploadedDate ? format(new Date(date), 'dd MMMM yyyy') : 'N/A';
                            return (
                                <div
                                    key={doc._id}
                                    className="flex items-center justify-between py-4 first:pt-0"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <FaFileAlt className="text-gray-400 text-lg" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900">{doc.documentType}</h4>
                                            <p className="text-xs text-gray-500">Uploaded {uploadedDate}</p>
                                            {doc.status.message && (
                                                <p className="text-xs text-red-600 mt-1 truncate" title={doc.status.message}>
                                                    {doc.status.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(doc.status.status)}
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-8 w-8 p-0 hover:bg-gray-100"
                                            onClick={() => setSelectedDoc(doc)}
                                        >
                                            <FaEye className="text-gray-600" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 text-center py-8">No documents uploaded yet.</p>
                )}
            </CardContent>

            {/* Document Preview Modal */}
            <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
                <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0">
                    <DialogHeader className="p-6 pb-4 border-b">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <DialogTitle className="text-lg font-semibold">{selectedDoc?.documentType}</DialogTitle>
                                <p className="text-sm text-gray-500 mt-1">
                                    Uploaded {selectedDoc?.uploadedDate ? format(new Date(selectedDoc.uploadedDate), 'dd MMMM yyyy') : 'N/A'}
                                </p>
                                <div className="mt-2">
                                    {selectedDoc?.status && getStatusBadge(selectedDoc.status.status)}
                                </div>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto p-6 space-y-4">
                        {selectedDoc?.status.message && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="text-sm font-semibold text-blue-900 mb-2">Status Message</h4>
                                <p className="text-sm text-blue-800">{selectedDoc.status.message}</p>
                            </div>
                        )}
                        {selectedDoc?.fileType === 'application/pdf' ? (
                            <iframe
                                src={selectedDoc.fileUrl}
                                className="w-full h-full min-h-[600px] border rounded-lg"
                                title={selectedDoc.documentType}
                            />
                        ) : selectedDoc?.fileUrl ? (
                            <div className="relative w-full h-full min-h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
                                <Image
                                    src={selectedDoc.fileUrl}
                                    alt={selectedDoc.documentType}
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                        ) : null}
                    </div>
                    <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setSelectedDoc(null)}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={() => selectedDoc && window.open(selectedDoc.fileUrl, '_blank')}
                        >
                            Open in New Tab
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
