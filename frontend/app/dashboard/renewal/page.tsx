'use client';

import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import StepIndicator from '@/components/renewal/StepIndicator';
import Step1ReviewInformation from '@/components/renewal/Step1ReviewInformation';
import DocumentsRequiringUpdateSection from '@/components/renewal/DocumentsRequiringUpdateSection';
import { FaArrowRight } from 'react-icons/fa';

export default function RegistrationRenewalPage() {
    const router = useRouter();

    const steps = [
        {
            number: 1,
            title: 'Review Information',
            subtitle: 'Current status',
            status: 'active' as const,
        },
        {
            number: 2,
            title: 'Update Documents',
            subtitle: 'Upload renewed certificate',
            status: 'pending' as const,
        },
        {
            number: 3,
            title: 'Payment',
            subtitle: 'Process renewal fee',
            status: 'pending' as const,
        },
    ];

    const categories = [
        { category: 'WORKS', grade: 'Grade A' },
        { category: 'ICT', grade: 'Grade A' },
    ];

    const verificationItems = [
        { label: 'CAC Number', value: 'RC1234567' },
        { label: 'TIN', value: 'TIN-12345678' },
    ];

    const documentsRequiringUpdate = [
        {
            title: 'Tax Clearance Certificate (TCC)',
            expiryDate: '31/12/2024',
            status: 'expiring_soon' as const,
        },
        {
            title: 'PENCOM Compliance Certificate',
            expiryDate: '15/12/2024',
            status: 'expired' as const,
        },
        {
            title: 'ITF Certificate',
            expiryDate: '31/12/2024',
            status: 'expiring_soon' as const,
        },
        {
            title: 'NSITF Certificate',
            expiryDate: '31/12/2024',
            status: 'expiring_soon' as const,
        },
    ];

    const handleLogout = () => {
        console.log('Logout');
    };

    const handleUpdateCompanyInfo = () => {
        router.push('/dashboard/profile');
    };

    const handleContinue = () => {
        console.log('Continue to upload documents');
        // Navigate to step 2
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader
                companyName="Registration Renewal"
                subtitle="Back to Dashboard"
                hasBackButton
                onLogout={handleLogout}
            />

            {/* Step Indicator */}
            <StepIndicator steps={steps} />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Step 1: Review Information */}
                <Step1ReviewInformation
                    registrationId="IMO-CONT-2024-001"
                    companyName="ABC Construction Limited"
                    currentExpiryDate="31 December 2024"
                    newExpiryDate="31 December 2025"
                    categories={categories}
                    verificationItems={verificationItems}
                    onUpdateCompanyInfo={handleUpdateCompanyInfo}
                />

                {/* Documents Requiring Update */}
                <div className="mt-6">
                    <DocumentsRequiringUpdateSection documents={documentsRequiringUpdate} />
                </div>

                {/* Continue Button */}
                <div className="flex justify-end mt-6">
                    <Button
                        className="bg-teal-700 hover:bg-teal-800 text-white px-8"
                        onClick={handleContinue}
                    >
                        Continue to Update Documents
                        <FaArrowRight className="ml-2 text-sm" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
