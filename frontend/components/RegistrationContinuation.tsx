'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaUser, FaCheckCircle, FaBuilding, FaUsers, FaUniversity, FaFileAlt, FaMoneyBill, FaCreditCard, FaReceipt } from 'react-icons/fa';
import { toast } from 'sonner';
import Step2CompanyDetails from '@/components/registration-steps/Step2CompanyDetails';
import StepPlaceholder from '@/components/registration-steps/StepPlaceholder';
import { FaTag } from 'react-icons/fa6';

const steps = [
    { id: 1, name: 'Create Account', icon: FaUser, description: 'Verify Contact', completed: true },
    { id: 2, name: 'Company Details', icon: FaBuilding, description: 'Company Details', completed: false },
    { id: 3, name: 'Directors', icon: FaUsers, description: 'Directors', completed: false },
    { id: 4, name: 'Bank Details', icon: FaUniversity, description: 'Bank Details', completed: false },
    { id: 5, name: 'Documents', icon: FaFileAlt, description: 'Documents', completed: false },
    { id: 6, name: 'Category & Grade', icon: FaTag, description: 'Category & Grade', completed: false },
    { id: 7, name: 'Payment Summary', icon: FaMoneyBill, description: 'Payment Summary', completed: false },
    { id: 8, name: 'Confirm Payment', icon: FaCreditCard, description: 'Confirm Payment', completed: false },
    { id: 9, name: 'Receipt', icon: FaReceipt, description: 'Receipt', completed: false },
];

interface RegistrationContinuationProps {
    token: string;
}

export default function RegistrationContinuation({ token }: RegistrationContinuationProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(2); // Start from step 2
    const [formData, setFormData] = useState({
        // Step 2: Company Details
        companyName: '',
        rcNumber: '',
        tinNumber: '',
        address: '',
        city: '',
        state: '',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleContinue = async () => {
        // Validate current step
        if (currentStep === 2) {
            if (!formData.companyName || !formData.rcNumber) {
                toast.error('Please fill in required fields');
                return;
            }
        }

        // For other steps, just move to next step
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
            toast.success('Progress saved');
        } else {
            toast.success('Registration completed!');
            // TODO: Submit final registration
        }
    };

    const handleBack = () => {
        if (currentStep > 2) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 2:
                return (
                    <Step2CompanyDetails
                        formData={{
                            companyName: formData.companyName,
                            rcNumber: formData.rcNumber,
                            tinNumber: formData.tinNumber,
                            address: formData.address,
                            city: formData.city,
                            state: formData.state,
                        }}
                        onInputChange={handleInputChange}
                    />
                );
            
            default:
                return (
                    <StepPlaceholder 
                        stepNumber={currentStep} 
                        stepName={steps[currentStep - 1].name}
                    />
                );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Progress Steps */}
                <div className="mb-8">
                    {/* Desktop/Tablet View - Horizontal Steps */}
                    <div className="hidden md:block">
                        <div className="relative">
                            {/* Background Line */}
                            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200" style={{ zIndex: 0 }} />
                            
                            {/* Progress Line */}
                            <div 
                                className="absolute top-6 left-0 h-0.5 bg-theme-green transition-all duration-500" 
                                style={{ 
                                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                                    zIndex: 1 
                                }} 
                            />

                            {/* Steps */}
                            <div className="relative flex justify-between w-[102%] left-[-1.5%]" style={{ zIndex: 2 }}>
                                {steps.map((step) => (
                                    <div key={step.id} className="flex flex-col items-center">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${
                                                currentStep > step.id
                                                    ? 'border-theme-green bg-theme-green'
                                                    : currentStep === step.id
                                                    ? 'border-theme-green shadow-lg shadow-green-200 bg-white'
                                                    : 'border-gray-300 bg-gray-50'
                                            }`}
                                        >
                                            {currentStep > step.id ? (
                                                <FaCheckCircle className="text-white text-xl" />
                                            ) : (
                                                <step.icon className={`text-lg ${
                                                    currentStep === step.id ? 'text-theme-green' : 'text-gray-400'
                                                }`} />
                                            )}
                                        </div>
                                        <p className={`text-xs mt-3 text-center font-medium max-w-[90px] leading-tight ${
                                            currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                                        }`}>
                                            {step.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile View - Compact Progress */}
                    <div className="md:hidden">
                        {/* Current Step Card */}
                        <div className="bg-white border-2 border-theme-green rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-theme-green flex items-center justify-center shrink-0 shadow-lg">
                                    {(() => {
                                        const StepIcon = steps[currentStep - 1].icon;
                                        return <StepIcon className="text-white text-2xl" />;
                                    })()}
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-600 font-medium">Step {currentStep} of {steps.length}</p>
                                    <h3 className="text-lg font-bold text-gray-900">{steps[currentStep - 1].name}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-theme-green h-2 rounded-full transition-all duration-500 relative"
                                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                                >
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 animate-pulse" />
                                </div>
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-gray-600 font-medium">{currentStep}/{steps.length} Complete</span>
                                <span className="text-xs text-theme-green font-semibold">{Math.round((currentStep / steps.length) * 100)}%</span>
                            </div>
                        </div>

                        {/* Mini Steps Preview */}
                        <div className="flex gap-1 mt-4 overflow-x-auto pb-2">
                            {steps.map((step) => (
                                <div
                                    key={step.id}
                                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                        currentStep > step.id
                                            ? 'bg-theme-green text-white'
                                            : currentStep === step.id
                                            ? 'bg-theme-green text-white ring-2 ring-green-200'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                                >
                                    {currentStep > step.id ? '✓' : step.id}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            {steps[currentStep - 1].name}
                        </CardTitle>
                        <CardDescription>
                            {currentStep === 2
                                ? 'Provide your company registration details'
                                : `Complete step ${currentStep} of your registration`
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderStepContent()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 2}
                                className="min-w-[100px]"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleContinue}
                                className="bg-theme-green hover:bg-theme-green/90 min-w-[100px]"
                            >
                                {currentStep === steps.length ? 'Complete' : 'Continue'}
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
