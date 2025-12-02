'use client';

import DashboardHeader from '@/components/DashboardHeader';
import RegistrationStatusCard from '@/components/dashboard/RegistrationStatusCard';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';

export default function PendingStatusExample() {
    const recentActivities = [
        {
            id: '1',
            title: 'Application submitted for review',
            date: '2024-11-20',
            type: 'info' as const,
        },
        {
            id: '2',
            title: 'Payment confirmed - ₦180,000',
            date: '2024-11-20',
            type: 'success' as const,
        },
        {
            id: '3',
            title: 'Documents uploaded',
            date: '2024-11-19',
            type: 'info' as const,
        },
    ];

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
                        {/* Registration Status - PENDING */}
                        <RegistrationStatusCard
                            registrationId="IDN-CONT-2024-003"
                            status="pending"
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
