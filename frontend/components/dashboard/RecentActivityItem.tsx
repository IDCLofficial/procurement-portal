'use client';

interface RecentActivityItemProps {
    title: string;
    date: string;
    type?: 'success' | 'info' | 'warning';
}

export default function RecentActivityItem({ title, date, type = 'info' }: RecentActivityItemProps) {
    const dotColor = type === 'success' ? 'bg-green-600' : type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600';

    return (
        <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
            <div className={`w-2 h-2 rounded-full ${dotColor} mt-1.5 shrink-0`} />
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{date}</p>
            </div>
        </div>
    );
}
