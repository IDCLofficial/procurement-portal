'use client';

import { FaFileInvoice } from 'react-icons/fa';

interface ReceiptInfoBoxProps {
    title: string;
    items: string[];
}

export default function ReceiptInfoBox({ title, items }: ReceiptInfoBoxProps) {
    return (
        <div className="bg-linear-to-b from-white to-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <FaFileInvoice className="text-blue-600 text-lg" />
                </div>
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
