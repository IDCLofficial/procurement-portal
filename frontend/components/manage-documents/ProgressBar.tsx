'use client';

interface ProgressBarProps {
    label: string;
    percentage: number;
    color?: 'teal' | 'blue' | 'green' | 'yellow' | 'red';
}

export default function ProgressBar({ label, percentage, color = 'teal' }: ProgressBarProps) {
    const colorClasses = {
        teal: 'bg-teal-600',
        blue: 'bg-blue-600',
        green: 'bg-green-600',
        yellow: 'bg-yellow-600',
        red: 'bg-red-600',
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${colorClasses[color]}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
