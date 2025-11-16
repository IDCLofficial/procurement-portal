'use client';

import { FaCheckCircle, FaDownload, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

interface Step9ReceiptProps {
    transactionRef: string;
    dateTime: string;
    paymentMethod: string;
    companyName: string;
    cacNumber: string;
    contactPerson: string;
    email: string;
    registrationFee: number;
    processingFee: number;
    certificateFee: number;
    selectedGrade: string;
}

export default function Step9Receipt({
    transactionRef,
    dateTime,
    paymentMethod,
    companyName,
    cacNumber,
    contactPerson,
    email,
    registrationFee,
    processingFee,
    certificateFee,
    selectedGrade,
}: Step9ReceiptProps) {
    const totalPaid = registrationFee + processingFee + certificateFee;

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString()}`;
    };

    const gradeLabels: Record<string, string> = {
        a: 'A',
        b: 'B',
        c: 'C',
        d: 'D',
    };

    const handleDownloadReceipt = () => {
        // TODO: Implement PDF download
        console.log('Download receipt');
    };

    const handleEmailReceipt = () => {
        // TODO: Implement email receipt
        console.log('Email receipt');
    };

    const handleViewApplicationStatus = () => {
        // TODO: Navigate to dashboard
        console.log('View application status');
    };

    return (
        <div className="space-y-6">
            {/* Success Header */}
            <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                    <FaCheckCircle className="text-theme-green text-4xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Successful!
                </h2>
                <p className="text-gray-600">
                    Your registration has been submitted for review
                </p>
            </div>

            {/* Official Receipt */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <div className="text-center mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Official Payment Receipt
                    </h3>
                    <p className="text-sm text-gray-600">
                        Imo State Bureau of Public Procurement & Infrastructure
                    </p>
                </div>

                {/* Transaction Details */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Transaction Reference:</span>
                        <span className="text-sm font-mono font-semibold text-gray-900">
                            {transactionRef}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Date & Time:</span>
                        <span className="text-sm font-medium text-gray-900">{dateTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Payment Method:</span>
                        <span className="text-sm font-medium text-gray-900">{paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Payment Status:</span>
                        <span className="text-sm font-semibold text-green-600">Completed</span>
                    </div>
                </div>

                {/* Paid By */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="text-base font-semibold text-gray-900 mb-3">Paid By</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Company:</span>
                            <span className="text-sm font-medium text-gray-900">{companyName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">CAC Number:</span>
                            <span className="text-sm font-medium text-gray-900">{cacNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Contact Person:</span>
                            <span className="text-sm font-medium text-gray-900">{contactPerson}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Email:</span>
                            <span className="text-sm font-medium text-gray-900">{email}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Details */}
                <div className="mb-6">
                    <h4 className="text-base font-semibold text-gray-900 mb-3">Payment Details</h4>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">
                                Registration Fee (Grade {gradeLabels[selectedGrade] || 'B'})
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(registrationFee)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Processing Fee</span>
                            <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(processingFee)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Certificate Issuance</span>
                            <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(certificateFee)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t-2 border-gray-300">
                    <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-gray-900">Total Paid</span>
                        <span className="text-2xl font-bold text-theme-green">
                            {formatCurrency(totalPaid)}
                        </span>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-center text-gray-500">
                        This is a computer-generated receipt and does not require a signature.
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid sm:grid-cols-2 gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleDownloadReceipt}
                    className="w-full"
                >
                    <FaDownload className="mr-2" />
                    Download Receipt
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleEmailReceipt}
                    className="w-full"
                >
                    <FaEnvelope className="mr-2" />
                    Email Receipt
                </Button>
            </div>

            {/* Next Steps */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                <div className="flex items-start gap-3 mb-4">
                    <FaCheckCircle className="text-green-600 text-xl mt-0.5 shrink-0" />
                    <div>
                        <h4 className="text-base font-semibold text-green-900 mb-1">
                            Next Steps
                        </h4>
                        <p className="text-sm text-green-900">
                            Your application is now under review. You can track the status in your dashboard.
                        </p>
                    </div>
                </div>
                <Button
                    type="button"
                    onClick={handleViewApplicationStatus}
                    className="w-full bg-theme-green hover:bg-theme-green/90"
                >
                    View Application Status
                    <FaArrowRight className="ml-2" />
                </Button>
            </div>

            {/* Email Confirmation */}
            <div className="text-center">
                <p className="text-sm text-gray-600">
                    A copy of this receipt has been sent to{' '}
                    <span className="font-medium text-gray-900">{email}</span>
                </p>
            </div>
        </div>
    );
}
