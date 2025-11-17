'use client';

import DashboardHeader from '@/components/DashboardHeader';
import RegistrationStatusCard from '@/components/dashboard/RegistrationStatusCard';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';

export default function SuspendedStatusExample() {
    const recentActivities = [
        {
            id: '1',
            title: 'Registration suspended',
            date: '2024-11-10',
            type: 'warning' as const,
        },
        {
            id: '2',
            title: 'Payment confirmed - ₦180,000',
            date: '2024-10-20',
            type: 'success' as const,
        },
        {
            id: '3',
            title: 'Registration approved by Registrar',
            date: '2024-10-28',
            type: 'success' as const,
        },
    ];

    const handleContactSupport = () => {
        console.log('Contact support');
    };

    const handleViewDetails = () => {
        console.log('View details');
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
                        {/* Registration Status - SUSPENDED */}
                        <RegistrationStatusCard
                            registrationId="IDN-CONT-2024-001"
                            validUntil="31 December 2024"
                            status="suspended"
                            suspensionReason="Your registration has been temporarily suspended due to pending compliance review. Multiple documents have expired and require immediate renewal. Please contact support for more information."
                            onContactSupport={handleContactSupport}
                            onUpdateProfile={handleViewDetails}
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
