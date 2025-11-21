'use client';

import { FaInfoCircle } from 'react-icons/fa';

interface PostPaymentInfoBoxProps {
    title: string;
    items: string[];
}

export default function PostPaymentInfoBox({ title, items }: PostPaymentInfoBoxProps) {
    return (
        <div className="bg-linear-to-b from-white to-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
                <FaInfoCircle className="text-blue-600 text-lg mt-0.5 shrink-0" />
                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3">{title}</h4>
                    <ul className="space-y-2">
                        {items.map((item, index) => (
                            <li key={index} className="text-sm text-blue-800 flex items-start">
                                <span className="mr-2">•</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
