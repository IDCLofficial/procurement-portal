'use client';

import TransactionRow from './TransactionRow';

export interface Transaction {
    paymentId: string;
    date: string;
    description: string;
    category: string;
    type: string;
    amount: string;
    status: 'completed' | 'pending' | 'failed';
    reference: string;
}

interface TransactionTableProps {
    transactions: Transaction[];
    onDownload: (transaction: Transaction) => void;
    onViewReceipt: (transaction: Transaction) => void;
}

export default function TransactionTable({ transactions, onDownload, onViewReceipt }: TransactionTableProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900">Transaction History</h3>
                <p className="text-sm text-gray-500 mt-1">Complete record of all payments and transactions</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Payment ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reference
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {transactions.map((transaction) => (
                            <TransactionRow
                                key={transaction.paymentId}
                                {...transaction}
                                onDownload={() => onDownload(transaction)}
                                onViewReceipt={() => onViewReceipt(transaction)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                    Showing {transactions.length} of {transactions.length} transactions
                </p>
            </div>
        </div>
    );
}
