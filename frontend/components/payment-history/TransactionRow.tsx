'use client';

import { FaDownload, FaReceipt, FaCheckCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

interface TransactionRowProps {
    paymentId: string;
    date: string;
    description: string;
    category: string;
    type: string;
    amount: string;
    status: 'completed' | 'pending' | 'failed';
    reference: string;
    onDownload: () => void;
    onViewReceipt: () => void;
}

export default function TransactionRow({
    paymentId,
    date,
    description,
    category,
    type,
    amount,
    status,
    reference,
    onDownload,
    onViewReceipt,
}: TransactionRowProps) {
    const statusConfig = {
        completed: {
            label: 'completed',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            iconColor: 'text-green-600',
        },
        pending: {
            label: 'pending',
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-700',
            iconColor: 'text-yellow-600',
        },
        failed: {
            label: 'failed',
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
            iconColor: 'text-red-600',
        },
    };

    const config = statusConfig[status];

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-6 py-4 text-sm font-medium text-gray-900">{paymentId}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{date}</td>
            <td className="px-6 py-4">
                <div>
                    <p className="text-sm font-medium text-gray-900">{description}</p>
                    <p className="text-xs text-gray-500">{category}</p>
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">{type}</td>
            <td className="px-6 py-4 text-sm font-semibold text-gray-900">{amount}</td>
            <td className="px-6 py-4">
                <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 ${config.bgColor} ${config.textColor} text-xs font-medium rounded-full`}
                >
                    <FaCheckCircle className={config.iconColor} />
                    {config.label}
                </span>
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">{reference}</td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onDownload}
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
                    >
                        <FaDownload className="text-sm" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onViewReceipt}
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
                    >
                        <FaReceipt className="text-sm" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}
