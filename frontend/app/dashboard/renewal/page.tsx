'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import StepIndicator from '@/components/renewal/StepIndicator';
import Step1ReviewInformation from '@/components/renewal/Step1ReviewInformation';
import Step2UpdateDocuments from '@/components/renewal/Step2UpdateDocuments';
import Step3Payment from '@/components/renewal/Step3Payment';
import DocumentsRequiringUpdateSection from '@/components/renewal/DocumentsRequiringUpdateSection';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { FaCreditCard } from 'react-icons/fa6';
import SubHeader from '@/components/SubHeader';

export default function RegistrationRenewalPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);

    const getStepStatus = (stepNumber: number): 'completed' | 'active' | 'pending' => {
        if (stepNumber < currentStep) return 'completed';
        if (stepNumber === currentStep) return 'active';
        return 'pending';
    };

    const steps = [
        {
            number: 1,
            title: 'Review Information',
            subtitle: 'Current status',
            status: getStepStatus(1),
        },
        {
            number: 2,
            title: 'Update Documents',
            subtitle: 'Upload renewed certificate',
            status: getStepStatus(2),
        },
        {
            number: 3,
            title: 'Payment',
            subtitle: 'Process renewal fee',
            status: getStepStatus(3),
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
            currentExpiry: '31/12/2024',
            status: 'expiring_soon' as const,
        },
        {
            title: 'PENCOM Compliance Certificate',
            currentExpiry: '15/12/2024',
            status: 'expired' as const,
        },
        {
            title: 'ITF Certificate',
            currentExpiry: '31/12/2024',
            status: 'expiring_soon' as const,
        },
        {
            title: 'NSITF Certificate',
            currentExpiry: '31/12/2024',
            status: 'expiring_soon' as const,
        },
    ];

    const handleUpdateCompanyInfo = () => {
        router.push('/dashboard/profile');
    };

    const handleContinue = () => {
        setCurrentStep(2);
    };

    const handleFileUpload = (title: string, file: File, validFrom: string, validTo: string) => {
        console.log('File uploaded:', title, file.name, validFrom, validTo);
        // Handle file upload logic
    };

    const handlePayment = () => {
        console.log('Processing payment...');
        // Handle payment logic
    };

    const summaryItems = [
        { label: 'Current Period', value: 'Jan 1, 2024 - Dec 31, 2024' },
        { label: 'Renewal Period', value: 'Jan 1, 2025 - Dec 31, 2025' },
        { label: 'Documents Updated', value: '0 of 4' },
        { label: 'Processing Time', value: '3-5 business days' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <SubHeader
                title='Registration Renewal'
                hasBackButton
            />

            {/* Step Indicator */}
            <StepIndicator steps={steps} />

            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Step 1: Review Information */}
                {currentStep === 1 && (
                    <>
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
                    </>
                )}

                {/* Step 2: Update Documents */}
                {currentStep === 2 && (
                    <>
                        <Step2UpdateDocuments
                            documents={documentsRequiringUpdate}
                            onFileUpload={handleFileUpload}
                        />

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(1)}
                            >
                                <FaArrowLeft className="mr-2 text-sm" />
                                Previous
                            </Button>
                            <Button
                                className="bg-teal-700 hover:bg-teal-800 text-white px-8"
                                onClick={() => setCurrentStep(3)}
                            >
                                Continue to Payment
                                <FaArrowRight className="ml-2 text-sm" />
                            </Button>
                        </div>
                    </>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                    <>
                        <Step3Payment
                            amount="₦180,000"
                            categories={['WORKS • ICT', 'Grade A']}
                            summaryItems={summaryItems}
                            onPayment={handlePayment}
                        />

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(2)}
                            >
                                <FaArrowLeft className="mr-2 text-sm" />
                                Previous
                            </Button>
                            <Button
                                className="bg-teal-700 hover:bg-teal-800 text-white px-8"
                                onClick={handlePayment}
                            >
                                <FaCreditCard className="mr-2 text-sm" />
                                Pay ₦180,000
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
