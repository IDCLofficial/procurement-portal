'use client';

import { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/payment-history/StatCard';
import SearchBar from '@/components/payment-history/SearchBar';
import FilterDropdown from '@/components/payment-history/FilterDropdown';
import TransactionTable, { Transaction } from '@/components/payment-history/TransactionTable';
import ReceiptInfoBox from '@/components/payment-history/ReceiptInfoBox';
import { FaWallet, FaCalendar, FaReceipt, FaClock, FaDownload } from 'react-icons/fa';

export default function PaymentHistoryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [yearFilter, setYearFilter] = useState('All Years');
    const [typeFilter, setTypeFilter] = useState('All Types');

    const transactions: Transaction[] = [
        {
            paymentId: 'PAY-2024-001',
            date: '20 Oct 2024',
            description: 'Initial Registration - Works Grade A',
            category: 'WORKS, ICT',
            type: 'Registration',
            amount: '₦180,000',
            status: 'completed',
            reference: 'PYSTACK-2MC123XYZ',
        },
        {
            paymentId: 'PAY-2024-002',
            date: '15 Jan 2024',
            description: 'Annual Renewal - Works Grade A',
            category: 'WORKS',
            type: 'Renewal',
            amount: '₦180,000',
            status: 'completed',
            reference: 'PYSTACK-DE1456UVA',
        },
        {
            paymentId: 'PAY-2023-003',
            date: '10 Oct 2023',
            description: 'Initial Registration - Works Grade B',
            category: 'WORKS',
            type: 'Registration',
            amount: '₦120,000',
            status: 'completed',
            reference: 'PYSTACK-GH789RST',
        },
        {
            paymentId: 'PAY-2023-004',
            date: '20 Jan 2023',
            description: 'Annual Renewal - Works Grade B',
            category: 'WORKS',
            type: 'Renewal',
            amount: '₦120,000',
            status: 'completed',
            reference: 'PYSTACK-JKL912PQ',
        },
        {
            paymentId: 'PAY-2024-005',
            date: '15 Jun 2024',
            description: 'Category Upgrade to Grade A',
            category: 'WORKS',
            type: 'Upgrade',
            amount: '₦60,000',
            status: 'completed',
            reference: 'PYSTACK-MNO345STU',
        },
    ];

    const handleLogout = () => {
        console.log('Logout');
    };

    const handleDownload = (transaction: Transaction) => {
        console.log('Download receipt:', transaction.paymentId);
    };

    const handleViewReceipt = (transaction: Transaction) => {
        console.log('View receipt:', transaction.paymentId);
    };

    const handleExport = () => {
        console.log('Export payment history');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader
                companyName="Payment History"
                subtitle="Back to Dashboard"
                hasBackButton
                onLogout={handleLogout}
            />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Paid (All Time)"
                        value="₦660,000"
                        icon={<FaWallet className="text-teal-600 text-lg" />}
                        iconColor="bg-teal-50"
                    />
                    <StatCard
                        title="This Year (2025)"
                        value="₦0"
                        subtitle="0 transactions"
                        icon={<FaCalendar className="text-blue-600 text-lg" />}
                        iconColor="bg-blue-50"
                    />
                    <StatCard
                        title="Total Transactions"
                        value="5"
                        icon={<FaReceipt className="text-purple-600 text-lg" />}
                        iconColor="bg-purple-50"
                    />
                    <StatCard
                        title="Last Payment"
                        value="20 Oct 2024"
                        subtitle="₦180,000"
                        icon={<FaClock className="text-orange-600 text-lg" />}
                        iconColor="bg-orange-50"
                    />
                </div>

                {/* Export Button */}
                <div className="flex justify-end mb-6">
                    <Button
                        onClick={handleExport}
                        className="bg-teal-700 hover:bg-teal-800 text-white"
                    >
                        <FaDownload className="mr-2" />
                        Export
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        <FilterDropdown
                            label="Filter by Year"
                            value={yearFilter}
                            options={['All Years', '2024', '2023', '2022']}
                            onChange={setYearFilter}
                        />
                        <FilterDropdown
                            label="Filter by Type"
                            value={typeFilter}
                            options={['All Types', 'Registration', 'Renewal', 'Upgrade']}
                            onChange={setTypeFilter}
                        />
                    </div>
                </div>

                {/* Transaction Table */}
                <div className="mb-6">
                    <TransactionTable
                        transactions={transactions}
                        onDownload={handleDownload}
                        onViewReceipt={handleViewReceipt}
                    />
                </div>

                {/* Receipt Info Box */}
                <ReceiptInfoBox
                    title="About Your Receipts:"
                    items={[
                        'All receipts are official tax receipts issued by Imo State Bureau of Public Procurement and Price Intelligence.',
                        'Receipts include transaction details, payment reference, and official seal.',
                        'Keep receipts for your financial records and tax purposes.',
                        'Receipts can be downloaded at any time and are permanently accessible.',
                        'For payment disputes or queries, contact BPPPI support with your payment reference number.',
                    ]}
                />
            </div>
        </div>
    );
}
