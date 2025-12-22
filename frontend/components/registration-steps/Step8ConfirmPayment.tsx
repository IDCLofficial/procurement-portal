'use client';

import { formatCurrency } from '@/lib';
import { FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

interface Step8ConfirmPaymentProps {
    companyName: string;
    email: string;
    phone: string;
    totalAmount: number;
}

export default function Step8ConfirmPayment({
    companyName,
    email,
    phone,
    totalAmount,
}: Step8ConfirmPaymentProps) {
    return (
        <div className="space-y-6">
            {/* Important Notice */}
            <div className="bg-linear-to-b from-white to-yellow-50 border-2 border-yellow-400 rounded-lg p-5">
                <div className="flex gap-3">
                    <FaExclamationCircle className="text-yellow-600 text-2xl mt-0.5 shrink-0" />
                    <div>
                        <h3 className="text-base font-semibold text-yellow-900 mb-2">
                            Important: Please Confirm
                        </h3>
                        <p className="text-sm text-yellow-900">
                            You are about to make a <span className="font-bold">Non Refundable</span> payment of{' '}
                            <span className="font-bold">{formatCurrency(totalAmount)}</span>
                            {' '}for contractor registration. Please ensure all details are correct before proceeding.
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment Confirmation Details */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Payment Confirmation
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Payment Method</span>
                        <span className="text-sm font-medium text-gray-900">Paystack</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Company Name</span>
                        <span className="text-sm font-medium text-gray-900">{companyName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Email</span>
                        <span className="text-sm font-medium text-gray-900">{email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Phone</span>
                        <span className="text-sm font-medium text-gray-900">{phone || 'N/A'}</span>
                    </div>
                </div>
            </div>

            {/* Total Amount */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-theme-green">
                        {formatCurrency(totalAmount)}
                    </span>
                </div>
            </div>

            {/* What Happens After Payment */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <div className="flex gap-3 mb-3">
                    <FaCheckCircle className="text-green-600 text-xl mt-0.5 shrink-0" />
                    <h3 className="text-base font-semibold text-green-900">
                        What Happens After Payment?
                    </h3>
                </div>
                <ul className="space-y-2 ml-8">
                    <li className="text-sm text-green-900 flex items-start">
                        <span className="mr-2"><FaCheckCircle className="text-green-600 text-xl mt-0.5 shrink-0" /></span>
                        <span>You&rsquo;ll receive an instant payment receipt via email</span>
                    </li>
                    <li className="text-sm text-green-900 flex items-start">
                        <span className="mr-2"><FaCheckCircle className="text-green-600 text-xl mt-0.5 shrink-0" /></span>
                        <span>Your application will be submitted for review</span>
                    </li>
                    <li className="text-sm text-green-900 flex items-start">
                        <span className="mr-2"><FaCheckCircle className="text-green-600 text-xl mt-0.5 shrink-0" /></span>
                        <span>Desk officers will verify your documents (3-5 business days)</span>
                    </li>
                    <li className="text-sm text-green-900 flex items-start">
                        <span className="mr-2"><FaCheckCircle className="text-green-600 text-xl mt-0.5 shrink-0" /></span>
                        <span>You&rsquo;ll receive email notifications on your application status</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
