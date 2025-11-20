'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FaUser, FaBuilding, FaUsers, FaUniversity, FaFileAlt, FaMoneyBill, FaCreditCard, FaReceipt } from 'react-icons/fa';
import { toast } from 'sonner';
import Step1Account from '@/components/registration-steps/Step1Account';
import EmailVerification from '@/components/registration-steps/EmailVerification';
import { FaTag } from 'react-icons/fa6';
import { useCreateVendorMutation } from '@/store/api/vendor.api';
import { CreateVendorRequest } from '@/store/api/types';
import { decrypt, encrypt } from '@/lib/crypto';

const allSteps = [
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

    const [createVendor, { isLoading: isCreatingVendor }] = useCreateVendorMutation();
    
    // Obscure param names for security
    // vrf = verification mode (requires uid)
    // uid = user identifier
    const userId = searchParams.get('uid') || '';
    const isVerificationMode = userId && searchParams.get('vrf') === '1';
    
    const [showEmailVerification, setShowEmailVerification] = useState(isVerificationMode);
    const [formData, setFormData] = useState({
        // Step 1: Account
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleEmailVerified = () => {
        toast.success('Email verified! Redirecting to complete registration...');
        setTimeout(() => {
            router.replace(`/dashboard/complete-registration`);
        }, 100);
    };

    const handleCancelVerification = () => {
        setShowEmailVerification(false);
        
        // Remove all params and go back to clean registration
        router.replace('/register');
        toast.info('Verification cancelled. You can edit your information.');
    };

    const handleContinue = async () => {
        if (isCreatingVendor) {
            toast.info('Please wait while we create your account...');
            return;
        };
        // Validate Step 1
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

        const payload: CreateVendorRequest = {
            email: formData.email,
            fullname: formData.fullName,
            password: formData.password,
            phoneNo: formData.phone
        };

        try {
            toast.loading('Creating your account...', { id: 'create-vendor' });
            const response = await createVendor(payload);

            // Check if response has an error property (RTK Query error response)
            if ('error' in response) {
                toast.dismiss('create-vendor');

                // Extract error message with proper typing
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const error = response.error as any;
                const errorMessage =
                    error?.data?.message ||
                    error?.message ||
                    'Failed to create vendor';

                toast.error(errorMessage);
                return;
            }

            // Success case
            toast.dismiss('create-vendor');
            toast.success('Vendor created successfully!');

            const params = new URLSearchParams();
            params.set('vrf', '1');
            params.set('uid', encrypt(payload.email));
            
            router.replace(`/register?${params.toString()}`);
            setShowEmailVerification(true);

        } catch (error) {
            console.error('Error creating vendor:', error);

            // Dismiss loading toast
            toast.dismiss('create-vendor');

            // Handle different error types
            let errorMessage = 'Failed to create vendor. Please try again.';

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            } else if (error && typeof error === 'object') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const err = error as Record<string, any>;
                errorMessage =
                    err.data?.message ||
                    err.message ||
                    err.error?.message ||
                    errorMessage;
            }

            toast.error(errorMessage);
        }
    };


    const renderStepContent = () => {
        // Show email verification if in verification mode
        if (showEmailVerification) {
            return (
                <EmailVerification
                    email={decrypt(userId)}
                    onVerified={handleEmailVerified}
                    onCancel={handleCancelVerification}
                />
            );
        }

        // Show Step 1 Account form
        return (
            <Step1Account 
                formData={{
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                }}
                isLoading={isCreatingVendor}
                onInputChange={handleInputChange}
                onContinue={handleContinue}
            />
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Progress Steps - Show all 9 steps with Step 1 active */}
                <div className="mb-8">
                    {/* Desktop/Tablet View - Horizontal Steps */}
                    <div className="hidden md:block">
                        <div className="relative">
                            {/* Background Line */}
                            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200" style={{ zIndex: 0 }} />
                            
                            {/* Progress Line - Only to Step 1 */}
                            <div 
                                className="absolute top-6 left-0 h-0.5 bg-theme-green transition-all duration-500" 
                                style={{ 
                                    width: showEmailVerification ? '0%' : '0%',
                                    zIndex: 1 
                                }} 
                            />

                            {/* Steps */}
                            <div className="relative flex justify-between w-[102%] left-[-1.5%]" style={{ zIndex: 2 }}>
                                {allSteps.map((step) => (
                                    <div key={step.id} className="flex flex-col items-center">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${
                                                step.id === 1
                                                    ? 'border-theme-green shadow-lg shadow-green-200 bg-white'
                                                    : 'border-gray-300 bg-gray-50'
                                            }`}
                                        >
                                            <step.icon className={`text-lg ${
                                                step.id === 1 ? 'text-theme-green' : 'text-gray-400'
                                            }`} />
                                        </div>
                                        <p className={`text-xs mt-3 text-center font-medium max-w-[90px] leading-tight ${
                                            step.id === 1 ? 'text-gray-900' : 'text-gray-500'
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
                                    <FaUser className="text-white text-2xl" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-600 font-medium">Step 1 of 9</p>
                                    <h3 className="text-lg font-bold text-gray-900">Create Account</h3>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-theme-green h-2 rounded-full transition-all duration-500 relative"
                                    style={{ width: '11%' }}
                                >
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 animate-pulse" />
                                </div>
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-gray-600 font-medium">1/9 Complete</span>
                                <span className="text-xs text-theme-green font-semibold">11%</span>
                            </div>
                        </div>

                        {/* Mini Steps Preview */}
                        <div className="flex gap-1 mt-4 overflow-x-auto pb-2">
                            {allSteps.map((step) => (
                                <div
                                    key={step.id}
                                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                        step.id === 1
                                            ? 'bg-theme-green text-white ring-2 ring-green-200'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                                >
                                    {step.id}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            {showEmailVerification 
                                ? 'Email Verification' 
                                : 'Create Account'
                            }
                        </CardTitle>
                        <CardDescription>
                            {showEmailVerification
                                ? 'Verify your email address to continue'
                                : 'Enter your contact information to get started'
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderStepContent()}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
