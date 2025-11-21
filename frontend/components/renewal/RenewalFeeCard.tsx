'use client';

import { FaCalendarAlt } from 'react-icons/fa';

interface RenewalFeeCardProps {
    amount: string;
    categories: string[];
}

export default function RenewalFeeCard({ amount, categories }: RenewalFeeCardProps) {
    return (
        <div className="bg-linear-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-8">
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                    <FaCalendarAlt className="text-white text-2xl" />
                </div>
                <p className="text-sm text-gray-600 mb-2">Annual Renewal Fee</p>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">{amount}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                    {categories.map((category, index) => (
                        <span key={index} className="flex items-center gap-1">
                            {index > 0 && <span className="text-gray-400">•</span>}
                            {category}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
