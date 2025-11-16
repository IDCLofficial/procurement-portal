'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaUser, FaCheckCircle, FaBuilding, FaUsers, FaUniversity, FaFileAlt, FaMoneyBill, FaCreditCard, FaReceipt } from 'react-icons/fa';
import { toast } from 'sonner';
import Step1Account from '@/components/registration-steps/Step1Account';
import Step2CompanyDetails from '@/components/registration-steps/Step2CompanyDetails';
import StepPlaceholder from '@/components/registration-steps/StepPlaceholder';
import EmailVerification from '@/components/registration-steps/EmailVerification';
import { FaTag } from 'react-icons/fa6';

const steps = [
    { id: 1, name: 'Create Account', icon: FaUser, description: 'Verify Contact' },
    { id: 2, name: 'Company Details', icon: FaBuilding, description: 'Company Details' },
    { id: 3, name: 'Directors', icon: FaUsers, description: 'Directors' },
    { id: 4, name: 'Bank Details', icon: FaUniversity, description: 'Bank Details' },
    { id: 5, name: 'Documents', icon: FaFileAlt, description: 'Documents' },
    { id: 6, name: 'Category & Grade', icon: FaTag, description: 'Category & Grade' },
    { id: 7, name: 'Payment Summary', icon: FaMoneyBill, description: 'Payment Summary' },
    { id: 8, name: 'Confirm Payment', icon: FaCreditCard, description: 'Confirm Payment' },
    { id: 9, name: 'Receipt', icon: FaReceipt, description: 'Receipt' },
];

export default function RegistrationStepper() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // Obscure param names for security
    // vrf = verification mode (requires uid)
    // uid = user identifier
    // stp = step number (requires uid)
    const userId = searchParams.get('uid') || '';
    const isVerificationMode = userId && searchParams.get('vrf') === '1';
    const resumeStep = userId ? parseInt(searchParams.get('stp') || '1') : 1;
    
    const [currentStep, setCurrentStep] = useState(resumeStep > 1 ? resumeStep : 1);
    const [showEmailVerification, setShowEmailVerification] = useState(isVerificationMode);
    const [formData, setFormData] = useState({
        // Step 1: Account
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
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
    
    const handleEmailVerified = () => {
        setShowEmailVerification(false);
        
        // Move to step 2 after verification
        const nextStep = 2;
        setCurrentStep(nextStep);
        
        // Update URL params - remove vrf, keep uid, set stp to 2
        const params = new URLSearchParams(searchParams.toString());
        params.delete('vrf');
        params.set('stp', nextStep.toString());
        
        router.replace(`/register?${params.toString()}`);
        toast.success('Email verified! You can now continue your registration.');
    };

    const handleCancelVerification = () => {
        setShowEmailVerification(false);
        setCurrentStep(1);
        
        // Remove all params and go back to clean registration
        router.replace('/register');
        toast.info('Verification cancelled. You can edit your information.');
    };

    const handleContinue = async () => {
        // Validate current steps
        if (currentStep === 1) {
            if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
                toast.error('Please fill in all fields');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }
            if (formData.password.length < 8) {
                toast.error('Password must be at least 8 characters');
                return;
            }

            // Step 1 complete - trigger email verification
            // TODO: Send registration data to backend and get userId
            const mockUserId = 'usr_' + Math.random().toString(36).substring(2, 15);
            
            // Simulate API call
            toast.loading('Creating your account...');
            setTimeout(() => {
                toast.dismiss();
                toast.success('Account created! Please check your email for verification code.');
                
                // Set URL params for email verification
                const params = new URLSearchParams();
                params.set('vrf', '1');
                params.set('uid', mockUserId);
                params.set('stp', '1');
                
                router.replace(`/register?${params.toString()}`);
                setShowEmailVerification(true);
            }, 1500);
            
            return;
        }

        // For other steps, just move to next step and update URL
        if (currentStep < steps.length) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            
            // Update URL with current progress
            const params = new URLSearchParams(searchParams.toString());
            if (userId) {
                params.set('uid', userId);
            }
            params.set('stp', nextStep.toString());
            
            router.replace(`/register?${params.toString()}`);
            toast.success('Progress saved');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStepContent = () => {
        // Show email verification if in verification mode
        if (showEmailVerification && currentStep === 1) {
            return (
                <EmailVerification
                    email={formData.email || 'your-email@example.com'}
                    userId={userId}
                    onVerified={handleEmailVerified}
                    onCancel={handleCancelVerification}
                />
            );
        }

        switch (currentStep) {
            case 1:
                return (
                    <Step1Account 
                        formData={{
                            fullName: formData.fullName,
                            email: formData.email,
                            phone: formData.phone,
                            password: formData.password,
                            confirmPassword: formData.confirmPassword,
                        }}
                        onInputChange={handleInputChange}
                    />
                );
            
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
                            {showEmailVerification && currentStep === 1 
                                ? 'Email Verification' 
                                : steps[currentStep - 1].name
                            }
                        </CardTitle>
                        <CardDescription>
                            {showEmailVerification && currentStep === 1
                                ? 'Verify your email address to continue'
                                : currentStep === 1
                                ? 'Enter your contact information to get started'
                                : currentStep === 2
                                ? 'Provide your company registration details'
                                : `Complete step ${currentStep} of your registration`
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderStepContent()}

                        {/* Navigation Buttons - Hide during email verification */}
                        {!showEmailVerification && (
                            <div className="flex justify-between mt-8 pt-6 border-t">
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={currentStep < 3}
                                    className="min-w-[100px]"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleContinue}
                                    className="bg-theme-green hover:bg-theme-green/90 min-w-[100px]"
                                >
                                    Continue
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
