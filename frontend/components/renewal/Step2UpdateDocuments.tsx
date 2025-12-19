'use client';

import { useCallback, useState } from 'react';
import { DocumentRenewal } from './DocumentsRequiringUpdateSection';
import RenewalDocumentUploadCard from './RenewalDocumentUploadCard';
import UploadInstructionBanner from './UploadInstructionBanner';
import { Button } from '../ui/button';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { toast } from 'sonner';
import { useAuth } from '../providers/public-service/AuthProvider';
import { VendorSteps } from '@/store/api/enum';
import { CompleteVendorRegistrationRequest, ResponseError } from '@/store/api/types';
import { useCompleteVendorRegistrationMutation } from '@/store/api/vendor.api';
import { Loader2 } from 'lucide-react';

interface Step2UpdateDocumentsProps {
    documents: DocumentRenewal[];
    setCurrentStep: (step: number) => void;
}

export interface DocumentUpload {
    id: string;
    fileUrl: string;
    validFrom?: string;
    validTo?: string;
    documentType: string;
    uploadedDate: string;
    fileName: string;
    fileSize: string;
    fileType: string;
    validFor: string;
    hasValidityPeriod: boolean;
}

export default function Step2UpdateDocuments({ documents, setCurrentStep }: Step2UpdateDocumentsProps) {
    const [uploads, setUploads] = useState<DocumentUpload[]>([]);
    const { company } = useAuth();

    const [ completeVendorRegistration, { isLoading, error } ] = useCompleteVendorRegistrationMutation();

    const handleUpload = (upload: DocumentUpload) => {
        if (!upload) return;

        setUploads((prev) => {
            const updated = prev ? [...prev] : [];
            updated.push(upload);
            return updated;
        });
    };

    const handleFinalUpload = useCallback(async () => {
        // Validation
        if (!uploads.length) {
            toast.error('Please upload all documents');
            return;
        }

        if (uploads.length !== documents.length) {
            toast.error("Please upload all documents");
            return;
        }

        try {
            toast.loading('Uploading documents...', { id: 'bulk-upload' });

            // Get all current documents
            const currentDocs = company?.documents || [];

            // Create a map of uploads by document name for efficient lookup
            const uploadsMap = new Map(
                uploads.map(upload => [
                    upload.documentType.toLowerCase().trim(),
                    upload
                ])
            );

            // Update existing documents or keep them as-is
            let updatedDocuments = currentDocs.map(doc => {
                const uploadedDoc = uploadsMap.get(doc.documentType.toLowerCase().trim());
                if (uploadedDoc) {
                    // Mark this upload as processed
                    uploadsMap.delete(doc.documentType.toLowerCase().trim());
                    return {
                        ...doc,
                        ...uploadedDoc,
                    };
                }
                return doc;
            });

            // Add any remaining uploads as new documents
            if (uploadsMap.size > 0) {
                const newDocuments = Array.from(uploadsMap.values());
                // model new files 
                const modeledNewDocuments: {
                    _id: string;
                    vendor: string;
                    fileUrl: string;
                    validFrom?: string | undefined;
                    validTo?: string | undefined;
                    documentType: string;
                    uploadedDate: string;
                    fileName: string;
                    fileSize: string;
                    fileType: string;
                    validFor: string;
                    hasValidityPeriod: boolean;
                    status: {
                        status: "pending" | "approved" | "needs review";
                        message?: string | undefined;
                    };
                    createdAt: string;
                    updatedAt: string;
                    __v: number;
                }[] = newDocuments.map((doc) => {
                    return {
                        _id: doc.id,
                        vendor: company?.userId || '',
                        fileUrl: doc.fileUrl,
                        validFrom: doc.validFrom,
                        validTo: doc.validTo,
                        documentType: doc.documentType,
                        uploadedDate: doc.uploadedDate,
                        fileName: doc.fileName,
                        fileSize: doc.fileSize,
                        fileType: doc.fileType,
                        validFor: doc.validFor,
                        hasValidityPeriod: doc.hasValidityPeriod,
                        status: {
                            status: "pending",
                        },
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        __v: 0,
                    }
                })
                updatedDocuments = [...updatedDocuments, ...modeledNewDocuments];
            }

            // Prepare API payload - ensure all required fields exist
            const payload = {
                [VendorSteps.DOCUMENTS]: updatedDocuments.map((doc) => {
                    // Type guard to ensure doc has all required properties
                    const docWithId = 'id' in doc ? doc.id as string : ('_id' in doc ? doc._id : '');

                    return {
                        id: docWithId,
                        fileUrl: doc.fileUrl || '',
                        validFrom: doc.validFrom,
                        validTo: doc.validTo,
                        documentType: doc.documentType || '',
                        uploadedDate: doc.uploadedDate || new Date().toISOString(),
                        fileName: doc.fileName || '',
                        fileSize: doc.fileSize || '',
                        fileType: doc.fileType || '',
                        validFor: doc.validFor,
                        hasValidityPeriod: doc.hasValidityPeriod ?? false,
                    };
                }),
                mode: "renewal" as CompleteVendorRegistrationRequest["mode"]
            };

            console.log('Bulk upload payload:', payload);

            // Submit to API
            const response = await completeVendorRegistration(payload);

            if (response.error) {
                throw new Error((response.error as ResponseError["error"]).data.message);
            }

            toast.dismiss('bulk-upload');
            toast.success(`${uploads.length} document(s) uploaded successfully!`);

            // Clean up blob URLs
            uploads.forEach(upload => {
                if (upload.fileUrl && upload.fileUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(upload.fileUrl);
                }
            });

            setCurrentStep(3);
        } catch (error) {
            console.error('Bulk upload failed:', error);
            toast.dismiss('bulk-upload');
            toast.error((error as Error).message || 'Failed to upload documents');
        }
    }, [uploads, documents, company, completeVendorRegistration, setCurrentStep]);
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
                {error && <p className="text-red-500">{JSON.stringify(error)}</p>}
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
                        onUpload={handleUpload}
                        documentId={doc.id}
                        hasExpiry={doc.hasExpiry}
                        documentPresetName={doc.documentName}
                    />
                ))}
            </div>

            <div className="flex justify-between mt-6">
                <Button
                    variant="outline"
                    className='cursor-pointer'
                    onClick={() => setCurrentStep(1)}
                >
                    <FaArrowLeft className="mr-2 text-sm" />
                    Previous
                </Button>
                {uploads.length === documents.length && <Button
                    className="bg-teal-700 hover:bg-teal-800 text-white px-8"
                    onClick={handleFinalUpload}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="mr-2 text-sm animate-spin" /> : <>
                        Continue to Payment
                        <FaArrowRight className="ml-2 text-sm" />
                    </>}
                </Button>}
            </div>
        </div>
    );
}
