'use client';

import StatusMetricCard from '@/components/manage-documents/StatusMetricCard';
import ProgressBar from '@/components/manage-documents/ProgressBar';
import AlertBanner from '@/components/manage-documents/AlertBanner';
import DocumentCard from '@/components/manage-documents/DocumentCard';
import InstructionsCard from '@/components/manage-documents/InstructionsCard';
import { FaFileAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import SubHeader from '@/components/SubHeader';
import { useAuth } from '@/components/providers/public-service/AuthProvider';
import { format, differenceInDays } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { toValidJSDate } from '@/lib';
import { useSearchParams } from 'next/navigation';

type TransformedDocument = {
    _id: string;
    id: string;
    vendor: string;
    title: string;
    documentType: string;
    certificateNumber: string;
    fileName: string;
    fileSize: string;
    fileType: string;
    fileUrl: string;
    issueDate: string;
    expiryDate: string;
    status: 'approved' | 'pending' | 'needs review';
    validFor: string;
    validFrom?: string;
    validTo?: string;
    uploadedDate: string;
    hasValidityPeriod: boolean;
    expiryWarning?: string;
    rejectionReason?: string;
    apiStatus: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export default function CertificatesPage() {
    const { company, documents, isLoading } = useAuth();
    const [previewFile, setPreviewFile] = useState<{ url: string; type: string; title: string; message?: string } | null>(null);
    const hash = useSearchParams().get('id');

    // Transform company documents to certificates format
    const certificates = useMemo<TransformedDocument[]>(() => {
        const documents = company?.documents;

        if (!documents) return [];
        
        return documents.map((doc) => {
            const issueDate = doc.uploadedDate ? format(toValidJSDate(doc.uploadedDate), 'dd MMM yyyy') : 'N/A';
            const expiryDate = doc.validTo ? format(toValidJSDate(doc.validTo), 'dd MMM yyyy') : 'No Expiry';
            
            // Calculate expiring soon based on validFrom-validTo period
            let daysUntilExpiry: number | null = null;
            if (doc.validFrom && doc.validTo) {
                const daysRemaining = differenceInDays(toValidJSDate(doc.validTo), new Date());
                daysUntilExpiry = daysRemaining;
            } else if (doc.validTo) {
                daysUntilExpiry = differenceInDays(toValidJSDate(doc.validTo), new Date());
            }
            
            // Determine status
            let status: 'approved' | 'pending' | 'needs review';
            let expiryWarning: string | undefined;
            let rejectionReason: string | undefined;
            
            const docStatus = doc.status.status.toLowerCase();
            
            if (docStatus === 'needs review') {
                status = 'needs review';
                rejectionReason = doc.status.message || 'Document rejected. Please resubmit.';
            } else if (daysUntilExpiry !== null && daysUntilExpiry < 0) {
                status = 'needs review';
                rejectionReason = 'This document has expired. Please renew immediately to maintain compliance.';
            } else if (daysUntilExpiry !== null && daysUntilExpiry <= 60 && daysUntilExpiry > 0) {
                status = 'needs review';
                expiryWarning = `This document will expire in ${daysUntilExpiry} days. Please initiate renewal to avoid service interruption.`;
            } else if (docStatus === 'approved') {
                status = 'approved';
            } else {
                status = 'pending'; // pending documents shown as active
            }
            
            return {
                _id: doc._id,
                id: doc._id,
                vendor: doc.vendor,
                title: doc.documentType,
                documentType: doc.documentType,
                certificateNumber: doc.fileName || 'N/A',
                fileName: doc.fileName,
                fileSize: doc.fileSize,
                fileType: doc.fileType,
                fileUrl: doc.fileUrl,
                issueDate,
                expiryDate,
                status,
                validFor: doc.validFor,
                validFrom: doc.validFrom,
                validTo: doc.validTo,
                uploadedDate: doc.uploadedDate,
                hasValidityPeriod: doc.hasValidityPeriod,
                expiryWarning,
                rejectionReason,
                apiStatus: doc.status.status,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt,
                __v: doc.__v,
            };
        });
    }, [company?.documents]);


    // Use live data if available, otherwise use mock data
    const displayCertificates: TransformedDocument[] = certificates.length > 0 ? certificates : [];
    
    // Find missing documents by comparing with document presets
    const missingDocuments = useMemo(() => {
        if (!documents || documents.length === 0) return [];
        
        const uploadedDocTypes = new Set(
            (company?.documents || []).map(doc => doc.documentType.toLowerCase().trim())
        );
        
        return documents
            .filter(preset => preset.isRequired)
            .filter(preset => !uploadedDocTypes.has(preset.documentName.toLowerCase().trim()))
            .map(preset => ({
                id: `missing-${preset.documentName}`,
                documentName: preset.documentName,
                isRequired: preset.isRequired,
                hasExpiry: preset.hasExpiry,
                renewalFrequency: preset.renewalFrequency,
            }));
    }, [documents, company?.documents]);

    const instructions = [
        'Ensure all certificates are valid and up-to-date before bidding on projects',
        'Download copies of your certificates for offline access and submission',
        'Set up renewal reminders at least 90 days before expiry dates',
        'Contact support immediately if you notice any discrepancies in certificate details',
        'Keep digital and physical copies of all certificates in a secure location',
    ];

    const handleViewCertificate = (id: string) => {
        const cert = displayCertificates.find(c => c.id === id);
        if (cert && cert.fileUrl) {
            setPreviewFile({
                url: cert.fileUrl,
                type: cert.fileType || 'pdf',
                title: cert.title || 'Document Preview',
                message: undefined
            });
        } else {
            console.log('View certificate:', id);
        }
    };

    // Calculate metrics
    const totalCertificates = documents?.length || 0;
    const activeCertificates = displayCertificates.filter(c => {
        const status = (c.status as string | { status: string; message?: string });
        const statusStr = typeof status === 'string' ? status : status?.status;
        return statusStr?.toLowerCase() === 'approved';
    }).length;
    
    // Expiring soon: documents with validFrom and validTo where remaining time is less than 20% of total validity period
    const expiringSoon = displayCertificates.filter(c => {
        if (!('validFrom' in c) || !('validTo' in c) || !c.validFrom || !c.validTo) return false;
        const validFromDate = new Date(c.validFrom);
        const validToDate = new Date(c.validTo);
        const totalPeriod = differenceInDays(validToDate, validFromDate);
        const remaining = differenceInDays(validToDate, new Date());
        const threshold = Math.max(60, totalPeriod * 0.2);
        return remaining > 0 && remaining <= threshold;
    }).length;
    
    // Expired: documents past their validTo date
    const expired = displayCertificates.filter(c => {
        if (!('validTo' in c) || !c.validTo) return false;
        return differenceInDays(new Date(c.validTo), new Date()) < 0;
    }).length;
    
    const pendingVerification = displayCertificates.filter(c => {
        const status = (c.status as string | { status: string; message?: string });
        const statusStr = typeof status === 'string' ? status : status?.status;
        return statusStr?.toLowerCase() === 'pending';
    }).length;
    
    const needsReview = displayCertificates.filter(c => {
        const status = (c.status as string | { status: string; message?: string });
        const statusStr = typeof status === 'string' ? status : status?.status;
        return statusStr?.toLowerCase() === 'needs review';
    }).length;
    
    const missingDocumentsCount = missingDocuments.length;
    const compliancePercentage = totalCertificates > 0 ? Math.round((activeCertificates / totalCertificates) * 100) : 0;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <SubHeader
                    title='Manage Compliance Documents'
                    hasBackButton
                />
                <div className="container mx-auto px-64 py-6 flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                        <p className="text-gray-600">Loading documents...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <SubHeader
                title='Manage Compliance Documents'
                hasBackButton
                subtitle="View and manage all your compliance documents and certificates"
            />

            <div className="container mx-auto lg:px-64 md:px-32 sm:px-16 px-4 py-6">
                {/* Status Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <StatusMetricCard
                        label="Total Documents"
                        value={totalCertificates || "N/A"}
                        icon={<FaFileAlt className="text-xl" />}
                        iconColor="text-blue-600"
                        iconBg="bg-blue-50"
                    />
                    <StatusMetricCard
                        label="Verified"
                        value={activeCertificates}
                        icon={<FaCheckCircle className="text-xl" />}
                        iconColor="text-green-600"
                        iconBg="bg-green-50"
                    />
                    <StatusMetricCard
                        label="Pending Verification"
                        value={pendingVerification}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                        iconColor="text-blue-600"
                        iconBg="bg-blue-50"
                    />
                    <StatusMetricCard
                        label="Needs Review"
                        value={needsReview}
                        icon={<FaExclamationCircle className="text-xl" />}
                        iconColor="text-yellow-600"
                        iconBg="bg-yellow-50"
                    />
                    <StatusMetricCard
                        label="Expiring Soon"
                        value={expiringSoon}
                        icon={<FaExclamationCircle className="text-xl" />}
                        iconColor="text-orange-600"
                        iconBg="bg-orange-50"
                    />
                    <StatusMetricCard
                        label="Expired"
                        value={expired}
                        icon={<FaExclamationCircle className="text-xl" />}
                        iconColor="text-red-600"
                        iconBg="bg-red-50"
                    />
                    {missingDocumentsCount > 0 && <StatusMetricCard
                        label="Missing Documents"
                        value={missingDocumentsCount}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        }
                        iconColor="text-purple-600"
                        iconBg="bg-purple-50"
                    />}
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <ProgressBar
                        label="Overall Compliance Status"
                        percentage={compliancePercentage}
                        color="teal"
                    />
                </div>

                {/* Alert Banner */}
                {(expiringSoon > 0 || expired > 0 || missingDocumentsCount > 0) && (
                    <div className="mb-6">
                        {missingDocumentsCount > 0 && (
                            <div className="mb-3">
                                <AlertBanner
                                    type="warning"
                                    message={`Missing Documents: You have ${missingDocumentsCount} required document(s) that need to be uploaded. Please upload them to complete your profile.`}
                                />
                            </div>
                        )}
                        {(expiringSoon > 0 || expired > 0) && (
                            <AlertBanner
                                type="warning"
                                message={`Action required: You have ${expiringSoon} certificate(s) expiring soon and ${expired} expired certificate(s). Please renew them to maintain compliance.`}
                            />
                        )}
                    </div>
                )}

                {/* Documents List - Full Width */}
                <div className="space-y-4 mb-6">
                    {/* Missing Documents Cards */}
                    {missingDocuments.map((missing) => (
                        <DocumentCard
                            key={missing.id}
                            id={missing.id}
                            isSelected={hash === missing.id}
                            title={missing.documentName}
                            status="required"
                            certificateNumber="Not Uploaded"
                            fileSize="-"
                            uploadDate="-"
                            showReplaceSection={true}
                            hasValidityPeriod={missing.hasExpiry === 'yes'}
                            documentId={missing.id}
                            documentPresetName={missing.documentName}
                        />
                    ))}
                    
                    {/* Uploaded Documents */}
                    {displayCertificates.length > 0 ? (
                        displayCertificates.map((cert) => {
                            const certId = cert.id;
                            const certTitle = cert.title;
                            const certStatus = cert.status;
                            const certNumber = cert.certificateNumber;
                            const certIssueDate = cert.issueDate;
                            const certRejection = cert.rejectionReason;
                            const certMessage = undefined;
                            const certFileSize = cert.fileSize;
                            
                            // Calculate if expired or expiring based on validFrom-validTo
                            let displayStatus: 'verified' | 'pending' | 'expiring' | 'expired' | 'review' = 'pending';
                            
                            if (certStatus.toLowerCase() === 'approved') {
                                displayStatus = 'verified';
                            } else if (certStatus.toLowerCase() === 'needs review') {
                                displayStatus = 'review';
                            } else if (certStatus.toLowerCase() === 'pending') {
                                displayStatus = 'pending';
                            }
                        
                            // Override with expired/expiring if validFrom-validTo indicates so
                            if (cert.validFrom && cert.validTo) {
                                const validToDate = new Date(cert.validTo);
                                const validFromDate = new Date(cert.validFrom);
                                const daysRemaining = differenceInDays(validToDate, new Date());
                                const totalPeriod = differenceInDays(validToDate, validFromDate);
                                const threshold = Math.max(60, totalPeriod * 0.2);
                                
                                if (daysRemaining < 0) {
                                    displayStatus = 'expired';
                                } else if (daysRemaining <= threshold && daysRemaining > 0) {
                                    displayStatus = 'expiring';
                                }
                            } else if (cert.validTo) {
                                const daysRemaining = differenceInDays(new Date(cert.validTo), new Date());
                                if (daysRemaining < 0) {
                                    displayStatus = 'expired';
                                }
                            }
                            
                            return (
                                <DocumentCard
                                    key={certId}
                                    id={certId}
                                    isSelected={hash === certId}
                                    title={certTitle}
                                    status={displayStatus}
                                    certificateNumber={certNumber}
                                    fileUrl={cert.fileUrl}
                                    fileType={cert.fileType}
                                    fileSize={certFileSize}
                                    uploadDate={certIssueDate}
                                    expiryStatus={displayStatus === 'expiring' ? 'Expires Annually' : displayStatus === 'expired' ? 'Expired' : undefined}
                                    validFrom={displayStatus === 'expiring' || displayStatus === 'expired' ? cert.validFrom : undefined}
                                    validTo={displayStatus === 'expiring' || displayStatus === 'expired' ? cert.validTo : undefined}
                                    errorMessage={displayStatus === 'expired' || displayStatus === 'expiring' || displayStatus === 'review' ? (certRejection || certMessage) : undefined}
                                    showReplaceSection={displayStatus === 'expired' || displayStatus === 'expiring' || displayStatus === 'review' || certStatus.toLowerCase() === 'needs review'}
                                    hasValidityPeriod={cert.hasValidityPeriod}
                                    documentId={cert._id}
                                    documentPresetName={cert.documentType}
                                    onView={() => handleViewCertificate(certId)}
                                />
                            );
                        })
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                            <FaFileAlt className="mx-auto text-4xl text-gray-400 mb-4" />
                            <p className="text-gray-600 mb-2">No documents found</p>
                            <p className="text-sm text-gray-500">Upload your compliance documents to get started</p>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <InstructionsCard
                    title="Important Information"
                    instructions={instructions}
                />
            </div>

            {/* File Preview Modal */}
            <Dialog open={!!previewFile} onOpenChange={(open) => !open && setPreviewFile(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>{previewFile?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        {previewFile && (
                            <>
                                {previewFile.message && (
                                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <p className="text-sm text-yellow-800">
                                            <span className="font-semibold">Message: </span>
                                            {previewFile.message}
                                        </p>
                                    </div>
                                )}
                                {previewFile.type.toLowerCase().includes('image') ? (
                                    <div className="relative w-full min-h-[400px]">
                                        <Image 
                                            src={previewFile.url} 
                                            alt={previewFile.title}
                                            width={800}
                                            height={600}
                                            className="w-full h-auto rounded-lg object-contain"
                                            unoptimized
                                        />
                                    </div>
                                ) : previewFile.type.toLowerCase() === 'pdf' || previewFile.url.toLowerCase().endsWith('.pdf') ? (
                                    <iframe
                                        src={previewFile.url}
                                        className="w-full h-[70vh] rounded-lg border"
                                        title={previewFile.title}
                                    />
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                                        <a 
                                            href={previewFile.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Open in new tab
                                        </a>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
