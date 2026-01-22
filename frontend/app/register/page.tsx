import Header from '@/components/Header';
import RegistrationStepper from '@/components/RegistrationStepper';
import Loader from '@/components/ui/loader';
import { Suspense } from 'react';
import { getPageMetadata } from '../../lib/metadata';

export const metadata = getPageMetadata({
    title: 'Contractor Registration - Imo State BPPPI',
    description: 'Register as a contractor with the Imo State Bureau of Public Procurement & Price Inteligence',
});

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-green-50 to-gray-50">
            <Header
                title="Contractor Registration"
                description="Register your company with BPPPI"
                hasBackButton
            />
            <Suspense fallback={<Loader />}>
                <RegistrationStepper />
            </Suspense>
        </div>
    );
}
