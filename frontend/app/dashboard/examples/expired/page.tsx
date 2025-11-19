'use client';

import DashboardHeader from '@/components/DashboardHeader';
import RegistrationStatusCard from '@/components/dashboard/RegistrationStatusCard';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import ComplianceDocumentsCard from '@/components/dashboard/ComplianceDocumentsCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';

export default function ExpiredStatusExample() {
    const complianceDocuments = [
        {
            id: '1',
            name: 'CAC Incorporation Certificate',
            status: 'verified' as const,
        },
        {
            id: '2',
            name: 'Tax Clearance Certificate (TCC)',
            validUntil: '31 Dec 2023',
            expiresText: 'Expired',
            status: 'verified' as const,
        },
    ];

    const recentActivities = [
        {
            id: '1',
            title: 'Registration expired',
            date: '2024-01-01',
            type: 'warning' as const,
        },
        {
            id: '2',
            title: 'Certificate downloaded',
            date: '2023-11-08',
            type: 'success' as const,
        },
    ];

    const handleRenew = () => {
        console.log('Renew registration');
    };

    const handleUpdateProfile = () => {
        console.log('Update profile');
    };

    const handleManageDocuments = () => {
        console.log('Manage documents');
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
                        {/* Registration Status - EXPIRED */}
                        <RegistrationStatusCard
                            registrationId="IDN-CONT-2023-001"
                            validUntil="31 December 2023"
                            status="expired"
                            onReapply={handleRenew}
                            onUpdateProfile={handleUpdateProfile}
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
