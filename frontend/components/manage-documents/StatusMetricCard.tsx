'use client';

interface StatusMetricCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    iconColor: string;
    iconBg: string;
}

export default function StatusMetricCard({ label, value, icon, iconColor, iconBg }: StatusMetricCardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}>
                    <div className={iconColor}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );
}
