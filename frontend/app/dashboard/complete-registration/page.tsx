'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import RegistrationContinuation from '@/components/RegistrationContinuation';
import { toast } from 'sonner';
import DashboardHeader from '@/components/DashboardHeader';

export default function CompleteRegistrationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        // Validate token exists
        if (!token) {
            toast.error('Invalid access. Please complete email verification first.');
            router.push('/register');
            return;
        }

        // TODO: Validate token with backend
        // For now, just check if it exists
        const isValidToken = token.length > 0;
        
        if (!isValidToken) {
            toast.error('Session expired. Please register again.');
            router.push('/register');
        }
    }, [token, router]);

    if (!token) {
        return null;
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-green-50 to-gray-50">
            <DashboardHeader
                companyName='ABC Construction Ltd'
                subtitle="Complete Your Registration"
                justLogout
            />
            <RegistrationContinuation />
        </div>
    );
}
