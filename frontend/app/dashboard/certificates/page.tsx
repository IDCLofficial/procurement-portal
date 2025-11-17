'use client';

import DashboardHeader from '@/components/DashboardHeader';
import StatusMetricCard from '@/components/certificates/StatusMetricCard';
import ProgressBar from '@/components/certificates/ProgressBar';
import AlertBanner from '@/components/certificates/AlertBanner';
import DocumentCard from '@/components/certificates/DocumentCard';
import InstructionsCard from '@/components/certificates/InstructionsCard';
import { FaFileAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function CertificatesPage() {
    // Mock data
    const certificates = [
        {
            id: '1',
            title: 'CAC Incorporation Certificate',
            certificateNumber: 'RC 123456',
            issueDate: '15 Jan 2020',
            expiryDate: 'No Expiry',
            status: 'active' as const,
            validFor: 'All construction projects',
        },
        {
            id: '2',
            title: 'Tax Clearance Certificate',
            certificateNumber: 'TCC-2024-001',
            issueDate: '01 Jan 2024',
            expiryDate: '31 Dec 2024',
            status: 'expiring_soon' as const,
            validFor: 'Federal and State contracts',
            expiryWarning: 'This certificate will expire in 45 days. Please initiate renewal to avoid service interruption.',
        },
        {
            id: '3',
            title: 'PENCOM Compliance Certificate',
            certificateNumber: 'PEN-2023-789',
            issueDate: '01 Jan 2023',
            expiryDate: '31 Dec 2023',
            status: 'expired' as const,
            validFor: 'Pension compliance verification',
            rejectionReason: 'This certificate has expired. Please renew immediately to maintain compliance.',
        },
        {
            id: '4',
            title: 'ITF Certificate',
            certificateNumber: 'ITF-2024-456',
            issueDate: '01 Jan 2024',
            expiryDate: '31 Dec 2024',
            status: 'active' as const,
            validFor: 'Industrial Training Fund compliance',
        },
        {
            id: '5',
            title: 'NSITF Certificate',
            certificateNumber: 'NSITF-2023-321',
            issueDate: '01 Jan 2023',
            expiryDate: '31 Dec 2023',
            status: 'expired' as const,
            validFor: 'Social Insurance compliance',
            rejectionReason: 'Certificate expired. Renewal required for continued operations.',
        },
        {
            id: '6',
            title: 'ISO 9001 Certificate',
            certificateNumber: 'ISO-2024-111',
            issueDate: '01 Mar 2024',
            expiryDate: '28 Feb 2027',
            status: 'active' as const,
            validFor: 'Quality Management System certification',
        },
        {
            id: '7',
            title: 'Safety Certificate',
            certificateNumber: 'SAF-2024-222',
            issueDate: '15 Feb 2024',
            expiryDate: '14 Feb 2025',
            status: 'active' as const,
            validFor: 'Workplace safety compliance',
        },
        {
            id: '8',
            title: 'Environmental Clearance',
            certificateNumber: 'ENV-2024-333',
            issueDate: '01 Apr 2024',
            expiryDate: '31 Mar 2025',
            status: 'active' as const,
            validFor: 'Environmental impact projects',
        },
        {
            id: '9',
            title: 'Professional Indemnity Insurance',
            certificateNumber: 'PII-2024-444',
            issueDate: '01 Jan 2024',
            expiryDate: '31 Dec 2024',
            status: 'expiring_soon' as const,
            validFor: 'Professional liability coverage',
            expiryWarning: 'Insurance policy expiring in 60 days. Contact your provider for renewal.',
        },
    ];

    const instructions = [
        'Ensure all certificates are valid and up-to-date before bidding on projects',
        'Download copies of your certificates for offline access and submission',
        'Set up renewal reminders at least 90 days before expiry dates',
        'Contact support immediately if you notice any discrepancies in certificate details',
        'Keep digital and physical copies of all certificates in a secure location',
    ];

    const handleLogout = () => {
        console.log('Logout');
    };

    const handleViewCertificate = (id: string) => {
        console.log('View certificate:', id);
    };

    const handleDownloadCertificate = (id: string) => {
        console.log('Download certificate:', id);
    };

    const handleMoreActions = (id: string) => {
        console.log('More actions:', id);
    };

    // Calculate metrics
    const totalCertificates = certificates.length;
    const activeCertificates = certificates.filter(c => c.status === 'active').length;
    const expiringSoon = certificates.filter(c => c.status === 'expiring_soon').length;
    const expired = certificates.filter(c => c.status === 'expired').length;
    const compliancePercentage = Math.round((activeCertificates / totalCertificates) * 100);

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader
                companyName="ABC Construction Ltd"
                subtitle="Back to Dashboard"
                hasBackButton
                onLogout={handleLogout}
            />

            <div className="container mx-auto px-64 py-6">
                {/* Page Header */}
                <div className="my-6">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900">Manage Compliance Documents</h1>
                    </div>
                    <p className="text-sm text-gray-600">View and manage all your compliance documents and certificates</p>
                </div>

                {/* Status Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <StatusMetricCard
                        label="Total Documents"
                        value={totalCertificates}
                        icon={<FaFileAlt className="text-xl" />}
                        iconColor="text-blue-600"
                        iconBg="bg-blue-50"
                    />
                    <StatusMetricCard
                        label="Uploaded"
                        value={totalCertificates}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        }
                        iconColor="text-green-600"
                        iconBg="bg-green-50"
                    />
                    <StatusMetricCard
                        label="Verified"
                        value={activeCertificates}
                        icon={<FaCheckCircle className="text-xl" />}
                        iconColor="text-green-600"
                        iconBg="bg-green-50"
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
                {(expiringSoon > 0 || expired > 0) && (
                    <div className="mb-6">
                        <AlertBanner
                            type="warning"
                            message={`Action required: You have ${expiringSoon} certificate(s) expiring soon and ${expired} expired certificate(s). Please renew them to maintain compliance.`}
                        />
                    </div>
                )}

                {/* Documents List - Full Width */}
                <div className="space-y-4 mb-6">
                    {certificates.map((cert) => (
                        <DocumentCard
                            key={cert.id}
                            title={cert.title}
                            status={
                                cert.status === 'active' ? 'verified' :
                                cert.status === 'expiring_soon' ? 'expiring' :
                                'expired'
                            }
                            certificateNumber={cert.certificateNumber}
                            fileSize="2.4 MB"
                            uploadDate={cert.issueDate}
                            expiryStatus={cert.status === 'expiring_soon' ? 'Expires Annually' : cert.status === 'expired' ? 'Expired' : undefined}
                            validFrom={cert.status === 'expiring_soon' ? cert.issueDate : undefined}
                            validTo={cert.status === 'expiring_soon' ? cert.expiryDate : undefined}
                            errorMessage={cert.status === 'expired' ? cert.rejectionReason : undefined}
                            showReplaceSection={cert.status === 'expiring_soon' || cert.status === 'expired'}
                            onView={() => handleViewCertificate(cert.id)}
                            onDownload={() => handleDownloadCertificate(cert.id)}
                            onClose={() => handleMoreActions(cert.id)}
                            onReplace={() => console.log('Replace:', cert.id)}
                        />
                    ))}
                </div>

                {/* Instructions */}
                <InstructionsCard
                    title="Important Information"
                    instructions={instructions}
                />
            </div>
        </div>
    );
}
