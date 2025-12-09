'use client';

import { useState } from 'react';
import { Download, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface PaymentTransaction {
    id: string;
    date: string;
    description: string;
    category: string;
    type: string;
    amount: string;
    status: 'completed' | 'pending' | 'failed';
    reference: string;
}

interface PaymentHistoryTableProps {
    transactions: PaymentTransaction[];
    onDownload: (id: string) => void;
    onViewReceipt: (id: string) => void;
}

export default function PaymentHistoryTable({ transactions, onDownload, onViewReceipt }: PaymentHistoryTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'failed':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // Pagination calculations
    const totalPages = Math.ceil(transactions.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePageSizeChange = (value: string) => {
        setPageSize(Number(value));
        setCurrentPage(1); // Reset to first page when changing page size
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">Transaction History</h3>
                    <p className="text-sm text-gray-500">Complete record of all payments and transactions</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-gray-700 w-16 px-5">S/N</TableHead>
                            <TableHead className="font-semibold text-gray-700">Payment ID</TableHead>
                            <TableHead className="font-semibold text-gray-700">Date</TableHead>
                            <TableHead className="font-semibold text-gray-700">Description</TableHead>
                            <TableHead className="font-semibold text-gray-700">Type</TableHead>
                            <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                            <TableHead className="font-semibold text-gray-700">Status</TableHead>
                            <TableHead className="font-semibold text-gray-700">Reference</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-right px-5">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedTransactions.map((transaction, index) => (
                            <TableRow key={transaction.id} className="hover:bg-gray-50">
                                <TableCell className="text-gray-600 font-medium px-5">{startIndex + index + 1}</TableCell>
                                <TableCell className="font-medium text-gray-900">{transaction.id}</TableCell>
                                <TableCell className="text-gray-600">{transaction.date}</TableCell>
                                <TableCell>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                                        <p className="text-xs text-gray-500">{transaction.category}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-600">{transaction.type}</TableCell>
                                <TableCell className="font-semibold text-gray-900">{transaction.amount}</TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                        {transaction.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-gray-500 text-xs font-mono">{transaction.reference}</TableCell>
                                <TableCell className="px-5">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDownload(transaction.id)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Download className="w-4 h-4 text-gray-600" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onViewReceipt(transaction.id)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <FileText className="w-4 h-4 text-gray-600" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Rows per page:</span>
                        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                            <SelectTrigger className="w-20 h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-4">
                        <p className="text-sm text-gray-600">
                            Showing {startIndex + 1} to {Math.min(endIndex, transactions.length)} of {transactions.length} transactions
                        </p>
                        
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="h-9 w-9 p-0"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="h-9 w-9 p-0"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
