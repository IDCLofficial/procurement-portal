'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { FaEnvelope, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'sonner';
import { useResendVerificationOtpMutation, useVerifyVendorMutation } from '@/store/api/vendor.api';

interface EmailVerificationProps {
    email: string;
    onVerified: (token: string) => void;
    onCancel?: () => void;
}

export default function EmailVerification({ email, onVerified, onCancel }: EmailVerificationProps) {
    const [otp, setOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(60);

    const [verifyVendorMutation, { isLoading: isVerifyingVendor }] = useVerifyVendorMutation();
    const [resendVerificationOtpMutation, { isLoading: isResendingOtp }] = useResendVerificationOtpMutation();

    // Countdown timer for resend
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => {
                setResendTimer(resendTimer - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const canResend = resendTimer === 0;

    const handleVerify = async () => {
        if (otp.length !== 5) {
            toast.error('Please enter the complete 5-digit code');
            return;
        }


        try {
            toast.loading('Verifying your account...', { id: 'verify-vendor' });
            const response = await verifyVendorMutation({ email, otp });

            // Check if response has an error property (RTK Query error response)
            if ('error' in response) {
                toast.dismiss('verify-vendor');


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
            toast.dismiss('verify-vendor');
            onVerified(response.data.token);
        } catch (error) {
            console.error('Error creating vendor:', error);

            // Dismiss loading toast
            toast.dismiss('verify-vendor');

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

    const handleResend = async () => {
        if (!canResend) return;
        
        try {
            toast.loading('Sending verification code...', { id: 'resend-otp' });
            const response = await resendVerificationOtpMutation({ email });

            // Check if response has an error property (RTK Query error response)
            if ('error' in response) {
                toast.dismiss('resend-otp');

                // Extract error message with proper typing
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const error = response.error as any;
                const errorMessage =
                    error?.data?.message ||
                    error?.message ||
                    'Failed to resend verification code';

                toast.error(errorMessage);
                return;
            }

            // Success case
            toast.dismiss('resend-otp');
            toast.success('Verification code resent to your email');
            setResendTimer(60); // Reset timer

        } catch (error) {
            console.error('Error resending verification code:', error);

            // Dismiss loading toast
            toast.dismiss('resend-otp');

            // Handle different error types
            let errorMessage = 'Failed to resend verification code. Please try again.';

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

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaEnvelope className="text-3xl text-theme-green" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Verify Your Email</h3>
                <p className="text-sm text-gray-600">
                    We&apos;ve sent a 6-digit verification code to
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{email}</p>
            </div>

            {/* OTP Input */}
            <div className="space-y-3">
                <Label htmlFor="otp" className="text-center block">Enter Verification Code</Label>
                <div className="flex justify-center">
                    <InputOTP
                        maxLength={5}
                        value={otp}
                        onChange={(value) => {
                            // Only allow numeric characters
                            const numericValue = value.replace(/[^0-9]/g, '');
                            setOtp(numericValue);
                        }}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row-reverse flex-wrap gap-3 max-md:px-10">
                <Button
                    onClick={handleVerify}
                    disabled={otp.length !== 5 || isVerifyingVendor}
                    className="flex-1 bg-theme-green min-w-64 hover:bg-theme-green/90"
                >
                    {isVerifyingVendor ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Verifying...
                        </>
                    ) : (
                        <>
                            <FaCheckCircle className="mr-2" />
                            Verify Email
                        </>
                    )}
                </Button>

                {onCancel && (
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1 min-w-64"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Registration
                    </Button>
                )}
            </div>

            {/* Resend Code */}
            <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Didn&apos;t receive the code?</p>
                <Button
                    variant={"ghost"}
                    onClick={handleResend}
                    disabled={!canResend || isResendingOtp}
                >
                    {isResendingOtp ? (
                        'Sending...'
                    ) : canResend ? (
                        'Resend Code'
                    ) : (
                        `Resend in ${resendTimer}s`
                    )}
                </Button>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900">
                    <strong>Note:</strong> The verification code will expire in 15 minutes. 
                    Check your spam folder if you don&apos;t see the email.
                </p>
            </div>
        </div>
    );
}
