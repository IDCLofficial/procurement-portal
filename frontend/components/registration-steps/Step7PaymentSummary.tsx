'use client';

interface Step7PaymentSummaryProps {
    companyName: string;
    cacNumber: string;
    selectedSectors: string[];
    selectedGrade: string;
    registrationFee: number;
}

// Mock data for sectors and grades - should match Step 6
const sectorNames: Record<string, string> = {
    works: 'WORKS',
    services: 'SERVICES',
    supplies: 'SUPPLIES',
    ict: 'ICT',
};

const gradeLabels: Record<string, string> = {
    a: 'Grade A',
    b: 'Grade B',
    c: 'Grade C',
    d: 'Grade D',
};

export default function Step7PaymentSummary({
    companyName,
    cacNumber,
    selectedSectors,
    selectedGrade,
    registrationFee,
}: Step7PaymentSummaryProps) {
    const processingFee = 5000;
    const certificateFee = 2500;
    const totalAmount = registrationFee + processingFee + certificateFee;

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString()}`;
    };

    const getSectorNames = () => {
        return selectedSectors.map(id => sectorNames[id] || id).join(', ');
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
                        <span className="text-sm text-gray-600">Selected Sectors:</span>
                        <span className="text-sm font-medium text-gray-900">
                            {selectedSectors.length > 0 ? getSectorNames() : 'Placeholder'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Grade:</span>
                        <span className="text-sm font-medium text-gray-900">
                            {selectedGrade ? gradeLabels[selectedGrade] : 'Grade B'}
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
                        <span className="text-sm text-gray-700">
                            Registration Fee ({selectedGrade ? gradeLabels[selectedGrade] : 'Grade B'})
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(registrationFee)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Processing Fee</span>
                        <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(processingFee)}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-700">Certificate Issuance</span>
                        <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(certificateFee)}
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
