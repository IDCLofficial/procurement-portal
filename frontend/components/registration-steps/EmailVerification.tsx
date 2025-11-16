'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { FaEnvelope, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'sonner';

interface EmailVerificationProps {
    email: string;
    userId: string;
    onVerified: () => void;
    onCancel?: () => void;
}

export default function EmailVerification({ email, userId, onVerified, onCancel }: EmailVerificationProps) {
    const [otp, setOtp] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);

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
        if (otp.length !== 6) {
            toast.error('Please enter the complete 6-digit code');
            return;
        }

        setIsVerifying(true);
        
        // Simulate API call
        setTimeout(() => {
            // TODO: Replace with actual API call using userId
            console.log('Verifying OTP for user:', userId);
            if (otp === '123456') {
                toast.success('Email verified successfully!');
                onVerified();
            } else {
                toast.error('Invalid verification code. Please try again.');
            }
            setIsVerifying(false);
        }, 1500);
    };

    const handleResend = async () => {
        if (!canResend) return;
        
        setIsResending(true);
        
        // Simulate API call
        setTimeout(() => {
            // TODO: Replace with actual API call
            toast.success('Verification code resent to your email');
            setIsResending(false);
            setResendTimer(60); // Reset timer
        }, 1000);
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
                        maxLength={6}
                        value={otp}
                        onChange={(value) => setOtp(value)}
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-row-reverse gap-3">
                <Button
                    onClick={handleVerify}
                    disabled={otp.length !== 6 || isVerifying}
                    className="flex-1 bg-theme-green hover:bg-theme-green/90"
                >
                    {isVerifying ? (
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
                        className="flex-1"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Registration
                    </Button>
                )}
            </div>

            {/* Resend Code */}
            <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Didn&apos;t receive the code?</p>
                <button
                    onClick={handleResend}
                    disabled={!canResend || isResending}
                    className="text-sm text-theme-green hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isResending ? (
                        'Sending...'
                    ) : canResend ? (
                        'Resend Code'
                    ) : (
                        `Resend in ${resendTimer}s`
                    )}
                </button>
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900">
                    <strong>Note:</strong> The verification code will expire in 10 minutes. 
                    Check your spam folder if you don&apos;t see the email.
                </p>
            </div>
        </div>
    );
}
