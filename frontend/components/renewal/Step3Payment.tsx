'use client';

import { FaCreditCard } from 'react-icons/fa';

interface Step3PaymentProps {
    onComplete: () => void;
}

export default function Step3Payment({ onComplete }: Step3PaymentProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-3 mb-6">
                <FaCreditCard className="text-gray-600 text-xl mt-1" />
                <div>
                    <h2 className="text-base font-semibold text-gray-900 mb-1">
                        Payment
                    </h2>
                    <p className="text-sm text-gray-500">
                        Process renewal fee
                    </p>
                </div>
            </div>

            <div className="text-center py-12 text-gray-500">
                Step 3: Payment - Coming soon...
            </div>
        </div>
    );
}
