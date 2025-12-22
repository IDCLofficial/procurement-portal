'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetProfileQuery, useVerifyPaymentQuery } from '@/store/api/vendor.api';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { return_url_key } from '@/lib/constants';

interface PaymentVerificationProps {
    reference: string | null;
}

export default function PaymentVerification({ reference }: PaymentVerificationProps) {
    const router = useRouter();
    const [countdown, setCountdown] = useState(3);

    const { error, isLoading, isSuccess, isError } = useVerifyPaymentQuery(reference!, {
        skip: !reference,
    });

    const { refetch: refetchProfile } = useGetProfileQuery();

    useEffect(() => {
        if (isSuccess) {
            refetchProfile();
            const return_url = localStorage.getItem(return_url_key);
            // Start countdown
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        if (return_url) {
                            router.push(return_url);
                        } else {
                            localStorage.removeItem(return_url_key);
                            router.push('/dashboard/complete-registration');
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isSuccess, router, refetchProfile]);

    const renderContent = () => {
        if (isLoading || !reference) {
            return (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Verifying Payment...
                    </h2>
                    <p className="text-gray-600 text-center max-w-md">
                        Please wait while we confirm your payment with Paystack.
                        This should only take a moment.
                    </p>
                </div>
            );
        }

        if (isError) {
            return (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="bg-red-50 rounded-full p-4">
                        <XCircle className="h-16 w-16 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Payment Verification Failed
                    </h2>
                    <p className="text-gray-600 text-center max-w-md">
                        {error && 'data' in error 
                            ? (error.data as { message?: string })?.message || 'We could not verify your payment. Please contact support if you were charged.'
                            : 'An error occurred while verifying your payment.'}
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
                        <div className="flex gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                            <div className="text-sm text-yellow-800">
                                <p className="font-medium mb-1">Payment Reference:</p>
                                <p className="font-mono text-xs break-all">{reference}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={() => router.push(localStorage.getItem(return_url_key) || "/dashboard/complete-registration")}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Go to Dashboard
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        if (isSuccess) {
            return (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="bg-green-50 rounded-full p-4">
                        <CheckCircle2 className="h-16 w-16 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Payment Successful!
                    </h2>
                    <p className="text-gray-600 text-center max-w-md">
                        Your payment has been verified successfully. Your registration is now complete.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md">
                        <div className="text-sm text-green-800">
                            <p className="font-medium mb-2">What&apos;s Next?</p>
                            <ul className="space-y-1 ml-4">
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>You&apos;ll receive a payment receipt via email</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>Your application will be reviewed (3-5 business days)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>You&apos;ll be notified of your application status</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>Redirecting to dashboard in</span>
                        <div className="relative inline-flex items-center justify-center w-8 h-8 bg-teal-100 rounded-full overflow-hidden">
                            <div
                                key={countdown}
                                className="absolute inset-0 flex items-center justify-center font-semibold text-teal-700 animate-[slideDown_0.3s_ease-out]"
                            >
                                {countdown}
                            </div>
                        </div>
                        <span>seconds...</span>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl w-full">
                {renderContent()}
            </div>
        </div>
    );
}
