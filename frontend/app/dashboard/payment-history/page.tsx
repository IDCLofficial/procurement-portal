'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import StatCard from '@/components/payment-history/StatCard';
import SearchInput from '@/components/payment-history/SearchInput';
import FilterDropdown from '@/components/payment-history/FilterDropdown';
import PaymentHistoryTable from '@/components/payment-history/PaymentHistoryTable';
import ReceiptInfoBox from '@/components/payment-history/ReceiptInfoBox';
import { Wallet, Calendar, Receipt, Clock, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SubHeader from '@/components/SubHeader';
import { useGetPaymentHistoryQuery } from '@/store/api/vendor.api';
import { useAuth } from '@/components/providers/public-service/AuthProvider';
import jsPDF from 'jspdf';
import { useDebounce } from '@/hooks/useDebounce';

export default function PaymentHistoryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Initialize state from URL params
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [yearFilter, setYearFilter] = useState(searchParams.get('year') || 'all');
    const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'all');
    const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
    const [itemsPerPage] = useState(10);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    const isFirstRender = useRef(true);

    const { company, user } = useAuth();

    // Update URL when debounced search or other filters change
    useEffect(() => {
        // Skip first render to avoid overwriting initial URL params
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const params = new URLSearchParams();
        if (debouncedSearchQuery) params.set('search', debouncedSearchQuery);
        if (yearFilter !== 'all') params.set('year', yearFilter);
        if (typeFilter !== 'all') params.set('type', typeFilter);
        if (currentPage > 1) params.set('page', currentPage.toString());
        
        const newUrl = params.toString() ? `?${params.toString()}` : '/dashboard/payment-history';
        router.replace(newUrl, { scroll: false });
    }, [debouncedSearchQuery, yearFilter, typeFilter, currentPage, router]);

    // Wrapper functions to reset page when filters change
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        if (currentPage !== 1) setCurrentPage(1);
    };

    const handleYearChange = (value: string) => {
        setYearFilter(value);
        if (currentPage !== 1) setCurrentPage(1);
    };

    const handleTypeChange = (value: string) => {
        setTypeFilter(value);
        if (currentPage !== 1) setCurrentPage(1);
    };

    const { data: paymentHistory, isLoading } = useGetPaymentHistoryQuery({
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearchQuery || '',
        year: yearFilter !== 'all' ? yearFilter : '',
        type: typeFilter !== 'all' ? typeFilter : '',
    });

    // Transform API data to match component format
    const transactions = useMemo(() => {
        if (!paymentHistory?.paymentTable) return [];
        
        return paymentHistory.paymentTable.map((payment) => ({
            id: `${payment.reference}`.toUpperCase(),
            date: new Date(payment.data).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            description: payment.description,
            category: '', // Not provided by API
            type: payment.type,
            amount: `₦${payment.amount.toLocaleString()}`,
            status: payment.status.toLowerCase() as 'completed' | 'pending' | 'failed',
            reference: payment.reference,
        }));
    }, [paymentHistory]);

    // Use API data if available, otherwise use mock data
    const displayTransactions = transactions.length > 0 ? transactions : [];

    const yearOptions = [
        { value: 'all', label: 'All Years' },
        ...new Array(5).fill(0).map((_, index) => ({
            value: (new Date().getFullYear() - index).toString(),
            label: (new Date().getFullYear() - index).toString(),
        }))
    ];

    const typeOptions = [
        { value: 'all', label: 'All Types' },
        { value: 'new', label: 'Registration' },
        { value: 'renewal', label: 'Renewal' },
        { value: 'upgrade', label: 'Upgrade' },
    ];

    const handleDownload = async (id: string) => {
        // Find the transaction
        const transaction = displayTransactions.find(t => t.id === id);
        if (!transaction) return;

        // Generate PDF with modern design
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 25;
        let yPos = 30;

        // Load and add Satoshi font
        try {
            const fontResponse = await fetch('/fonts/Satoshi-Regular.ttf');
            const fontBlob = await fontResponse.blob();
            const fontBase64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = (reader.result as string).split(',')[1];
                    resolve(base64);
                };
                reader.readAsDataURL(fontBlob);
            });

            // Add Satoshi Regular
            doc.addFileToVFS('Satoshi-Regular.ttf', fontBase64);
            doc.addFont('Satoshi-Regular.ttf', 'Satoshi', 'normal');

            // Load Bold variant
            const fontBoldResponse = await fetch('/fonts/Satoshi-Bold.ttf');
            const fontBoldBlob = await fontBoldResponse.blob();
            const fontBoldBase64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = (reader.result as string).split(',')[1];
                    resolve(base64);
                };
                reader.readAsDataURL(fontBoldBlob);
            });

            doc.addFileToVFS('Satoshi-Bold.ttf', fontBoldBase64);
            doc.addFont('Satoshi-Bold.ttf', 'Satoshi', 'bold');
        } catch (error) {
            console.error('Failed to load Satoshi font, using default:', error);
            // Continue with default font if Satoshi fails to load
        }

        // Background color for header
        doc.setFillColor(20, 184, 166); // Teal color
        doc.rect(0, 0, pageWidth, 50, 'F');

        // Add ministry logo
        const logoImg = new Image();
        logoImg.src = '/images/ministry-logo.png';
        logoImg.onload = () => {
            try {
                doc.addImage(logoImg, 'PNG', pageWidth / 2 - 8, 27, 16, 16);
            } catch {
                // Fallback to icon if logo fails
                drawSuccessIcon();
            }
            finalizePDF();
        };
        
        logoImg.onerror = () => {
            // Fallback to success icon if logo doesn't load
            drawSuccessIcon();
            finalizePDF();
        };

        const drawSuccessIcon = () => {
            // Success icon circle
            doc.setFillColor(255, 255, 255);
            doc.circle(pageWidth / 2, 35, 12, 'F');
            doc.setFillColor(20, 184, 166);
            doc.circle(pageWidth / 2, 35, 10, 'F');
            
            // Checkmark
            doc.setDrawColor(255, 255, 255);
            doc.setLineWidth(1.5);
            doc.line(pageWidth / 2 - 4, 35, pageWidth / 2 - 1, 38);
            doc.line(pageWidth / 2 - 1, 38, pageWidth / 2 + 4, 33);
        };

        const finalizePDF = () => {

        // Receipt title
        yPos = 70;
        doc.setTextColor(31, 41, 55); // Gray-800
        doc.setFontSize(24);
        doc.setFont('Satoshi', 'bold');
        doc.text('Payment Receipt', pageWidth / 2, yPos, { align: 'center' });

        // Reference number
        yPos += 10;
        doc.setFontSize(11);
        doc.setFont('Satoshi', 'normal');
        doc.setTextColor(107, 114, 128); // Gray-500
        doc.text(`${transaction.reference.toUpperCase()}`, pageWidth / 2, yPos, { align: 'center' });

        // Date
        yPos += 6;
        doc.setFontSize(9);
        doc.text(transaction.date, pageWidth / 2, yPos, { align: 'center' });

        // Status badge
        yPos += 12;
        const statusText = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);
        const statusWidth = doc.getTextWidth(statusText) + 12;
        doc.setFillColor(16, 185, 129); // Green
        doc.roundedRect(pageWidth / 2 - statusWidth / 2, yPos - 5, statusWidth, 8, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont('Satoshi', 'bold');
        doc.text(statusText, pageWidth / 2, yPos, { align: 'center' });

        // Card container
        yPos += 18;
        doc.setDrawColor(229, 231, 235); // Gray-200
        doc.setLineWidth(0.5);
        doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 85, 3, 3);

        // Company info section
        yPos += 10;
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(8);
        doc.setFont('Satoshi', 'normal');
        doc.text('PAID BY', margin + 5, yPos);

        yPos += 6;
        doc.setTextColor(31, 41, 55);
        doc.setFontSize(11);
        doc.setFont('Satoshi', 'bold');
        doc.text(company?.companyName || 'N/A', margin + 5, yPos);

        yPos += 5;
        doc.setFontSize(9);
        doc.setFont('Satoshi', 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text(user?.email || 'N/A', margin + 5, yPos);

        // Divider line
        yPos += 8;
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.3);
        doc.line(margin + 5, yPos, pageWidth - margin - 5, yPos);

        // Payment details
        yPos += 8;
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text('AMOUNT', margin + 5, yPos);
        // Format amount with proper Naira symbol
        const amountText = `\u20A6${transaction.amount}`;
        doc.text(amountText, pageWidth - margin - 5, yPos, { align: 'right' });

        yPos += 8;
        doc.text('DESCRIPTION', margin + 5, yPos);
        doc.setFontSize(9);
        doc.setTextColor(31, 41, 55);
        const descWidth = pageWidth - 2 * margin - 20;
        const splitDesc = doc.splitTextToSize(transaction.description, descWidth);
        doc.text(splitDesc, pageWidth - margin - 5, yPos, { align: 'right' });

        yPos += 8;
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text('SERVICE TYPE', margin + 5, yPos);
        doc.setFontSize(9);
        doc.setTextColor(31, 41, 55);
        doc.text(transaction.type === "new" ? "Vendor Registration" : "Upgrade", pageWidth - margin - 5, yPos, { align: 'right' });

        yPos += 8;
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text('PAYMENT METHOD', margin + 5, yPos);
        doc.setFontSize(9);
        doc.setTextColor(31, 41, 55);
        doc.text('Paystack', pageWidth - margin - 5, yPos, { align: 'right' });

        // Total section with background
        yPos += 12;
        doc.setFillColor(249, 250, 251); // Gray-50
        doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 18, 2, 2, 'F');

        yPos += 7;
        doc.setFontSize(10);
        doc.setFont('Satoshi', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text('TOTAL AMOUNT', margin + 5, yPos);

        yPos += 6;
        doc.setFontSize(16);
        doc.setTextColor(20, 184, 166); // Teal
        const totalAmountText = `${transaction.amount}`.replace('₦', '\u20A6');
        doc.text(totalAmountText, pageWidth - margin - 5, yPos, { align: 'right' });

        // Footer section
        yPos = pageHeight - 40;
        doc.setFillColor(249, 250, 251);
        doc.rect(0, yPos, pageWidth, 40, 'F');

        yPos += 10;
        doc.setFontSize(9);
        doc.setFont('Satoshi', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text('Imo State Bureau of Public Procurement', pageWidth / 2, yPos, { align: 'center' });

        yPos += 5;
        doc.setFontSize(8);
        doc.setFont('Satoshi', 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text('& Price Intelligence', pageWidth / 2, yPos, { align: 'center' });

        yPos += 8;
        doc.setFontSize(7);
        doc.setFont('Satoshi', 'normal');
        doc.text('This is a computer-generated receipt and does not require a signature', pageWidth / 2, yPos, { align: 'center' });

        // Save the PDF
        doc.save(`Receipt-BPPPI-${transaction.reference}.pdf`);
        };

        // Start loading the logo
        logoImg.src = '/images/ministry-logo.png';
    };

    const handleExport = () => {
        if (!paymentHistory?.paymentTable || paymentHistory.paymentTable.length === 0) {
            alert('No payment history to export');
            return;
        }

        // Prepare CSV data
        const headers = ['Reference', 'Date', 'Description', 'Type', 'Amount', 'Status'];
        const rows = paymentHistory.paymentTable.map(payment => [
            payment.reference,
            new Date(payment.data).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            payment.description,
            payment.type === 'new' ? 'Vendor Registration' : payment.type,
            `₦${payment.amount.toLocaleString()}`,
            payment.status
        ]);

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `Payment-History-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <StatCard
                                title="Total Paid (All Time)"
                                value={`₦${paymentHistory?.totalAmountPaid?.toLocaleString() || '0'}`}
                                icon={Wallet}
                                iconColor="text-teal-600"
                                iconBgColor="bg-teal-100"
                            />
                            <StatCard
                                title="This Year (2025)"
                                value={`₦${paymentHistory?.totalThisYear?.toLocaleString() || '0'}`}
                                subtitle={`${paymentHistory?.totalTransactions || 0} transactions`}
                                icon={Calendar}
                                iconColor="text-blue-600"
                                iconBgColor="bg-blue-100"
                            />
                            <StatCard
                                title="Total Transactions"
                                value={String(paymentHistory?.totalTransactions || 0)}
                                icon={Receipt}
                                iconColor="text-purple-600"
                                iconBgColor="bg-purple-100"
                            />
                            <StatCard
                                title="Last Payment"
                                value={displayTransactions[0]?.date || 'N/A'}
                                subtitle={displayTransactions[0]?.amount || ''}
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
                                    onChange={handleSearchChange}
                                />
                                <FilterDropdown
                                    label="Filter by Year"
                                    value={yearFilter}
                                    onChange={handleYearChange}
                                    options={yearOptions}
                                    placeholder="All Years"
                                />
                                <FilterDropdown
                                    label="Filter by Type"
                                    value={typeFilter}
                                    onChange={handleTypeChange}
                                    options={typeOptions}
                                    placeholder="All Types"
                                />
                            </div>
                        </div>

                        {/* Payment History Table */}
                        <div className="mb-6">
                            <PaymentHistoryTable
                                transactions={displayTransactions}
                                onDownload={handleDownload}
                            />
                            
                            {/* Pagination */}
                            {paymentHistory?.pagination && paymentHistory.pagination.totalPages > 1 && (
                                <div className="mt-4 flex items-center justify-between bg-white rounded-lg border border-gray-200 px-4 py-3">
                                    <div className="text-sm text-gray-600">
                                        Showing page {paymentHistory.pagination.page} of {paymentHistory.pagination.totalPages}
                                        {' '}({paymentHistory.pagination.total} total transactions)
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.min(paymentHistory.pagination.totalPages, prev + 1))}
                                            disabled={currentPage === paymentHistory.pagination.totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
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
                    </>
                )}
            </div>
        </div>
    );
}
