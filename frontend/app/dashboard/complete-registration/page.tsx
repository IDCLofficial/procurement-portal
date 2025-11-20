'use client';

import RegistrationContinuation from '@/components/RegistrationContinuation';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/components/providers/public-service/AuthProvider';

export default function CompleteRegistrationPage() {
    const { user } = useAuth();


    return (
        <div className="min-h-screen bg-linear-to-b from-green-50 to-gray-50">
            <DashboardHeader
                companyName={user?.fullname}
                subtitle="Complete Your Registration"
                justLogout
            />
            <RegistrationContinuation />
        </div>
    );
}
