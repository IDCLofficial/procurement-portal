'use client';

interface VerificationItemProps {
    label: string;
    value: string;
}

export default function VerificationItem({ label, value }: VerificationItemProps) {
    return (
        <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200 last:border-0">
            <p className="text-sm text-gray-700">{label}</p>
            <p className="text-sm font-semibold text-gray-900">{value}</p>
        </div>
    );
}
