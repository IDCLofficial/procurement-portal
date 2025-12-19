'use client';

interface Step7PaymentSummaryProps {
    companyName: string;
    cacNumber: string;
    selectedSector: string;
    selectedGrade: string;
}

export default function Step7PaymentSummary({
    companyName,
    cacNumber,
    selectedSector,
    selectedGrade,
}: Step7PaymentSummaryProps) {
    const processingFee = 30_000;
    const totalAmount = processingFee;

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString()}`;
    };

    return (
        <div className="space-y-6">
            {/* Registration Details */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Registration Details
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Company Name:</span>
                        <span className="text-sm font-medium text-gray-900">
                            {companyName || 'Placeholder'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">CAC Number:</span>
                        <span className="text-sm font-medium text-gray-900">
                            {cacNumber || 'Placeholder'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Selected Ministry:</span>
                        <span className="text-sm font-medium text-gray-900">
                            {selectedSector}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Grade:</span>
                        <span className="text-sm font-medium text-gray-900">
                            {selectedGrade.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Fee Breakdown */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Fee Breakdown
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Processing Fee</span>
                        <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(processingFee)}
                        </span>
                    </div>
                    
                    <div className="pt-3 mt-3 border-t-2 border-green-300">
                        <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-gray-900">Total Amount</span>
                            <span className="text-lg font-bold text-gray-900">
                                {formatCurrency(totalAmount)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secure Payment Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    Secure Payment:
                </h4>
                <p className="text-sm text-blue-900">
                    Your payment is processed through certified payment gateways. You&rsquo;ll receive an official receipt upon successful payment.
                </p>
            </div>
        </div>
    );
}
