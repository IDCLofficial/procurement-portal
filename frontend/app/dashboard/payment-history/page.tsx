'use client';

import { useState } from 'react';
import StatCard from '@/components/payment-history/StatCard';
import SearchInput from '@/components/payment-history/SearchInput';
import FilterDropdown from '@/components/payment-history/FilterDropdown';
import PaymentHistoryTable from '@/components/payment-history/PaymentHistoryTable';
import ReceiptInfoBox from '@/components/payment-history/ReceiptInfoBox';
import { Wallet, Calendar, Receipt, Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SubHeader from '@/components/SubHeader';

export default function PaymentHistoryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [yearFilter, setYearFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const transactions = [
        {
            id: 'PAY-2024-001',
            date: '20 Oct 2024',
            description: 'Initial Registration - Works Grade A',
            category: 'WORKS, ICT',
            type: 'Registration',
            amount: '₦180,000',
            status: 'completed' as const,
            reference: 'PYSTACK-2MC1234XZ',
        },
        {
            id: 'PAY-2024-002',
            date: '15 Jan 2024',
            description: 'Annual Renewal - Works Grade A',
            category: 'WORKS',
            type: 'Renewal',
            amount: '₦180,000',
            status: 'completed' as const,
            reference: 'PYSTACK-DE1456LVA',
        },
        {
            id: 'PAY-2023-003',
            date: '10 Oct 2023',
            description: 'Initial Registration - Works Grade B',
            category: 'WORKS',
            type: 'Registration',
            amount: '₦120,000',
            status: 'completed' as const,
            reference: 'PYSTACK-GH1788RST',
        },
        {
            id: 'PAY-2023-004',
            date: '20 Jan 2023',
            description: 'Annual Renewal - Works Grade B',
            category: 'WORKS',
            type: 'Renewal',
            amount: '₦120,000',
            status: 'completed' as const,
            reference: 'PYSTACK-JKL9179KO',
        },
        {
            id: 'PAY-2024-005',
            date: '15 Jun 2024',
            description: 'Category Upgrade to Grade A',
            category: 'WORKS',
            type: 'Upgrade',
            amount: '₦60,000',
            status: 'completed' as const,
            reference: 'PYSTACK-PQR3455TU',
        },
        {
            id: 'PAY-2022-006',
            date: '05 Dec 2022',
            description: 'Initial Registration - ICT Grade B',
            category: 'ICT',
            type: 'Registration',
            amount: '₦100,000',
            status: 'completed' as const,
            reference: 'PYSTACK-ABC7890XY',
        },
        {
            id: 'PAY-2022-007',
            date: '20 Mar 2022',
            description: 'Annual Renewal - ICT Grade B',
            category: 'ICT',
            type: 'Renewal',
            amount: '₦100,000',
            status: 'completed' as const,
            reference: 'PYSTACK-DEF1234ZW',
        },
        {
            id: 'PAY-2023-008',
            date: '12 Aug 2023',
            description: 'Category Upgrade to Grade A',
            category: 'ICT',
            type: 'Upgrade',
            amount: '₦50,000',
            status: 'completed' as const,
            reference: 'PYSTACK-GHI5678AB',
        },
        {
            id: 'PAY-2024-009',
            date: '30 Sep 2024',
            description: 'Document Resubmission Fee',
            category: 'WORKS',
            type: 'Registration',
            amount: '₦20,000',
            status: 'completed' as const,
            reference: 'PYSTACK-JKL9012CD',
        },
        {
            id: 'PAY-2023-010',
            date: '18 May 2023',
            description: 'Late Renewal Penalty',
            category: 'WORKS',
            type: 'Renewal',
            amount: '₦30,000',
            status: 'completed' as const,
            reference: 'PYSTACK-MNO3456EF',
        },
        {
            id: 'PAY-2022-011',
            date: '25 Nov 2022',
            description: 'Additional Category Registration',
            category: 'WORKS, ICT',
            type: 'Registration',
            amount: '₦150,000',
            status: 'completed' as const,
            reference: 'PYSTACK-PQR7890GH',
        },
        {
            id: 'PAY-2024-012',
            date: '08 Feb 2024',
            description: 'Certificate Replacement Fee',
            category: 'WORKS',
            type: 'Upgrade',
            amount: '₦15,000',
            status: 'completed' as const,
            reference: 'PYSTACK-STU1234IJ',
        },
    ];

    const yearOptions = [
        { value: 'all', label: 'All Years' },
        { value: '2024', label: '2024' },
        { value: '2023', label: '2023' },
        { value: '2022', label: '2022' },
    ];

    const typeOptions = [
        { value: 'all', label: 'All Types' },
        { value: 'registration', label: 'Registration' },
        { value: 'renewal', label: 'Renewal' },
        { value: 'upgrade', label: 'Upgrade' },
    ];

    const handleDownload = (id: string) => {
        console.log('Download receipt:', id);
    };

    const handleViewReceipt = (id: string) => {
        console.log('View receipt:', id);
    };

    const handleExport = () => {
        console.log('Export payment history');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <SubHeader
                title='Payment History'
                hasBackButton
                rightButton={
                    <Button
                        variant="outline"
                        className="bg-teal-700 hover:bg-teal-800 text-white"
                        onClick={handleExport}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                }
            />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <StatCard
                        title="Total Paid (All Time)"
                        value="₦660,000"
                        icon={Wallet}
                        iconColor="text-teal-600"
                        iconBgColor="bg-teal-100"
                    />
                    <StatCard
                        title="This Year (2025)"
                        value="₦0"
                        subtitle="0 transactions"
                        icon={Calendar}
                        iconColor="text-blue-600"
                        iconBgColor="bg-blue-100"
                    />
                    <StatCard
                        title="Total Transactions"
                        value="5"
                        icon={Receipt}
                        iconColor="text-purple-600"
                        iconBgColor="bg-purple-100"
                    />
                    <StatCard
                        title="Last Payment"
                        value="20 Oct 2024"
                        subtitle="₦180,000"
                        icon={Clock}
                        iconColor="text-orange-600"
                        iconBgColor="bg-orange-100"
                    />
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <SearchInput
                            value={searchQuery}
                            onChange={setSearchQuery}
                        />
                        <FilterDropdown
                            label="Filter by Year"
                            value={yearFilter}
                            onChange={setYearFilter}
                            options={yearOptions}
                            placeholder="All Years"
                        />
                        <FilterDropdown
                            label="Filter by Type"
                            value={typeFilter}
                            onChange={setTypeFilter}
                            options={typeOptions}
                            placeholder="All Types"
                        />
                    </div>
                </div>

                {/* Payment History Table */}
                <div className="mb-6">
                    <PaymentHistoryTable
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
