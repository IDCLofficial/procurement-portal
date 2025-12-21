'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FaEnvelope, FaArrowLeft, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useDebounce } from '@/hooks/useDebounce';
import { useForgotPasswordMutation } from '@/store/api/vendor.api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [forgotPassword, { isLoading: isForgotPasswordLoading }] = useForgotPasswordMutation();

    const debouncedEmail = useDebounce(email, 500);

    // Email validation
    const emailError = useMemo(() => {
        if (!debouncedEmail) return '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(debouncedEmail) ? 'Please enter a valid email address' : '';
    }, [debouncedEmail]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        if (emailError) return;
        if (isForgotPasswordLoading) return;

        try {
            const response = await forgotPassword({ email });
            if ('error' in response) {
                throw new Error('Failed to send reset password email');
            }
            setMessage(response.data.message);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error sending reset email:', error);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 to-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 relative">
                            <div className="relative w-20 h-20">
                                <Link href="/">
                                    <Image
                                        src="/images/ministry-logo.png"
                                        alt="Ministry Logo"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Did you forget your password?</h1>
                    <p className="text-sm text-gray-600">
                        {isSubmitted
                            ? 'Check your email for a password reset link'
                            : 'Enter your email to receive a password reset link'}
                    </p>
                </div>

                {!isSubmitted ? (
                    <Card className="border-gray-200 shadow-lg">
                        <CardContent className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email Address */}
                                <div>
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Email Address
                                    </Label>
                                    <div className="relative mt-1.5">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaEnvelope className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="your-email@company.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={isForgotPasswordLoading}
                                                className="pl-10 bg-gray-50"
                                                required
                                            />
                                        </div>
                                        {emailError && (
                                            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                                                <FaTimesCircle /> {emailError}
                                            </p>
                                        )}
                                        {!emailError && debouncedEmail && (
                                            <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                                                <FaCheckCircle /> Valid email address
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={!email || (!!emailError) || isForgotPasswordLoading}
                                    className="w-full bg-theme-green hover:bg-theme-green/90 text-white h-11 text-sm font-medium cursor-pointer"
                                >
                                    {isForgotPasswordLoading ? 'Sending...' : 'Send Reset Link'}
                                </Button>

                                {/* Back to Login */}
                                <div className="text-center">
                                    <Link
                                        href="/vendor-login"
                                        className="text-sm text-gray-600 hover:text-theme-green flex items-center justify-center gap-2"
                                    >
                                        <FaArrowLeft className="h-3 w-3" />
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-gray-200 shadow-lg">
                        <CardContent className="p-8 text-center">
                            <div className="mb-6">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <FaEnvelope className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Check Your Email</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                {message ? message : <>
                                    We&apos;ve sent a password reset link to <span className="font-medium">{email}</span>.
                                    The link will expire in 1 hour.
                                </>}
                            </p>

                            <div className="space-y-4">
                                <Link
                                    href="/vendor-login"
                                    className="inline-flex items-center justify-center w-full text-sm font-medium text-theme-green hover:text-theme-green/80"
                                >
                                    <FaArrowLeft className="h-3 w-3" />
                                    Back to Login
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} Imo State Bureau of Public Procurement & Infrastructure
                    </p>
                </div>
            </div>
        </div>
    );
}