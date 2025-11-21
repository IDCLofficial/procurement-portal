'use client';

interface InfoItemProps {
    label: string;
    value: string;
    valueColor?: 'default' | 'red' | 'green';
}

export default function InfoItem({ label, value, valueColor = 'default' }: InfoItemProps) {
    const colorClasses = {
        default: 'text-gray-900',
        red: 'text-red-600',
        green: 'text-green-600',
    };

    return (
        <div className="p-4">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`text-sm font-semibold ${colorClasses[valueColor]}`}>{value}</p>
        </div>
    );
}
