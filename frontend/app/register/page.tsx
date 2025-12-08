import Header from '@/components/Header';
import RegistrationStepper from '@/components/RegistrationStepper';
import { Suspense } from 'react';

export const metadata = {
    title: 'Contractor Registration - Imo State BPPPI',
    description: 'Register as a contractor with the Imo State Bureau of Public Private Partnerships & Investments',
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-green-50 to-gray-50">
            <Header
                title="Contractor Registration"
                description="Register your company with BPPPI"
                hasBackButton
            />
            <Suspense fallback={<div>Loading...</div>}>
                <RegistrationStepper />
            </Suspense>
        </div>
    );
}
