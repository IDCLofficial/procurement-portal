'use client';

import DashboardHeader from '@/components/DashboardHeader';
import RegistrationStatusCard from '@/components/dashboard/RegistrationStatusCard';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';

export default function DeclinedStatusExample() {
    const recentActivities = [
        {
            id: '1',
            title: 'Application declined by Registrar',
            date: '2024-11-15',
            type: 'warning' as const,
        },
        {
            id: '2',
            title: 'Application submitted for review',
            date: '2024-10-18',
            type: 'info' as const,
        },
    ];

    const handleReapply = () => {
        console.log('Reapply for registration');
    };

    const handleContactSupport = () => {
        console.log('Contact support');
    };

    const handleLogout = () => {
        console.log('Logout');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader
                companyName="ABC Construction Ltd"
                subtitle="Vendor Portal"
                onLogout={handleLogout}
            />

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Registration Status - DECLINED */}
                        <RegistrationStatusCard
                            registrationId="IDN-CONT-2024-002"
                            status="declined"
                            declineReason="Incomplete documentation: Tax Clearance Certificate is missing or invalid. Please ensure all required documents are properly uploaded and verified before reapplying."
                            onReapply={handleReapply}
                            onContactSupport={handleContactSupport}
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
