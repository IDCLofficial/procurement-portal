'use client';

import DashboardHeader from '@/components/DashboardHeader';
import RegistrationStatusCard from '@/components/dashboard/RegistrationStatusCard';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import RenewalReminderCard from '@/components/dashboard/RenewalReminderCard';
import ComplianceDocumentsCard from '@/components/dashboard/ComplianceDocumentsCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    // Mock data - will come from API
    const complianceDocuments = [
        {
            id: '1',
            name: 'CAC Incorporation Certificate',
            status: 'verified' as const,
        },
        {
            id: '2',
            name: 'Tax Clearance Certificate (TCC)',
            validUntil: '31 Dec 2024',
            status: 'verified' as const,
        },
        {
            id: '3',
            name: 'PENCOM Compliance Certificate',
            validUntil: '31 Dec 2024',
            expiresText: 'Expires soon',
            status: 'verified' as const,
        },
        {
            id: '4',
            name: 'ITF Certificate',
            validUntil: '31 Dec 2024',
            status: 'verified' as const,
        },
        {
            id: '5',
            name: 'NSITF Certificate',
            validUntil: '31 Dec 2024',
            expiresText: 'Expires soon',
            status: 'verified' as const,
        },
        {
            id: '6',
            name: 'Sworn Affidavit of Authenticity',
            status: 'verified' as const,
        },
    ];

    const recentActivities = [
        {
            id: '1',
            title: 'Certificate downloaded',
            date: '2024-11-08',
            type: 'success' as const,
        },
        {
            id: '2',
            title: 'Registration approved by Registrar',
            date: '2024-10-28',
            type: 'success' as const,
        },
        {
            id: '3',
            title: 'Payment confirmed - ₦180,000',
            date: '2024-10-20',
            type: 'success' as const,
        },
        {
            id: '4',
            title: 'Application submitted for review',
            date: '2024-10-18',
            type: 'info' as const,
        },
    ];

    const handleDownloadCertificate = () => {
        console.log('Download certificate');
    };

    const handleUpdateProfile = () => {
        console.log('Update profile');
    };

    const handleStartRenewal = () => {
        router.push('/dashboard/renewal');
    };

    const handleManageDocuments = () => {
        router.push('/dashboard/manage-documents');
    };

    const handleDownloadDocument = (documentId: string) => {
        console.log('Download document:', documentId);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader
                companyName="ABC Construction Ltd"
                subtitle="Vendor Portal"
            />

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Registration Status */}
                        <RegistrationStatusCard
                            registrationId="IDN-CONT-2024-001"
                            validUntil="31 December 2024"
                            daysRemaining={317}
                            status="approved"
                            onDownloadCertificate={handleDownloadCertificate}
                            onUpdateProfile={handleUpdateProfile}
                        />

                        {/* Renewal Reminder */}
                        <RenewalReminderCard
                            daysRemaining={-317}
                            onStartRenewal={handleStartRenewal}
                        />

                        {/* Compliance Documents */}
                        <ComplianceDocumentsCard
                            documents={complianceDocuments}
                            onManage={handleManageDocuments}
                            onDownload={handleDownloadDocument}
                        />

                        {/* Recent Activity */}
                        <RecentActivityCard activities={recentActivities} />
                    </div>

                    {/* Right Column - Quick Actions */}
                    <div className="lg:col-span-1">
                        <QuickActionsCard />
                    </div>
                </div>
            </div>
        </div>
    );
}
