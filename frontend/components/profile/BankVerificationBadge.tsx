'use client';

import { FaCheckCircle } from 'react-icons/fa';

interface BankVerificationBadgeProps {
    accountName: string;
    bankName: string;
}

export default function BankVerificationBadge({ accountName, bankName }: BankVerificationBadgeProps) {
    return (
        <div className="bg-linear-to-b from-transparent to-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 text-lg mt-0.5 shrink-0" />
                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-green-900 mb-1">
                        Bank Account Verification
                    </h4>
                    <p className="text-sm text-green-800">
                        Account Name: <span className="font-semibold">{accountName}</span>
                    </p>
                    <p className="text-sm text-green-800">
                        Bank: <span className="font-semibold">{bankName}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
