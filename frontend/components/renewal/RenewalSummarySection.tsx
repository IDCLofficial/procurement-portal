'use client';

interface SummaryItem {
    label: string;
    value: string;
}

interface RenewalSummarySectionProps {
    items: SummaryItem[];
    totalAmount: string;
}

export default function RenewalSummarySection({ items, totalAmount }: RenewalSummarySectionProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Renewal Summary</h3>
            
            <div className="space-y-3 mb-4">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">Total Amount</span>
                    <span className="text-lg font-bold text-gray-900">{totalAmount}</span>
                </div>
            </div>
        </div>
    );
}
