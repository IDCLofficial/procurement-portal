'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FaCheckCircle, FaDownload, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
import { getGradeConfig, getSectorConfig, getStatusConfig } from '@/lib/constants';
import { useAppSelector } from '@/store/hooks';
import { useGetAllContractorsQuery } from '@/store/api/public.api';
import { toast } from 'sonner';

export interface Contractor {
    id: string;
    name: string;
    rcbnNumber: string;
    sector: string;
    grade: string;
    lga: string;
    status: 'approved' | 'pending' | 'suspended';
    expiryDate: string;
}

export default function ContractorTable() {
    // Get Redux state
    const { searchQuery, sectorFilter, gradeFilter, lgaFilter, statusFilter, currentPage, itemsPerPage } = useAppSelector((state) => state.public);
    
    // Fetch contractors from API
    const { data: contractorsData, isLoading, error: errorContractors } = useGetAllContractorsQuery({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        sector: sectorFilter !== 'all' ? sectorFilter : undefined,
        grade: gradeFilter !== 'all' ? gradeFilter : undefined,
        lga: lgaFilter !== 'all' ? lgaFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
    });
    
    // Transform API data to match Contractor interface
    const contractors = useMemo(() => {
        if (!contractorsData?.certificates) return [];
        
        return contractorsData.certificates.map((cert) => ({
            id: cert.certificateId,
            name: cert.contractorId.fullname,
            rcbnNumber: cert.contractorId.companyId || 'N/A',
            sector: 'Works', // TODO: Get from API
            grade: 'A', // TODO: Get from API
            lga: 'Owerri Municipal', // TODO: Get from API
            status: 'approved' as const, // TODO: Get from API
            expiryDate: new Date(cert.contractorId.createdAt).toLocaleDateString('en-GB'),
        }));
    }, [contractorsData]);
    
    const error = errorContractors ? 'Failed to fetch contractors' : null;
    // CSV Export Handler
    const handleExportCSV = () => {
        if (!contractors || contractors.length === 0) {
            toast.error('No contractors to export', {
                description: 'Please apply filters to see contractors',
                duration: 3000,
            });
            return;
        }

        // Create CSV export
        const csv = [
            ['S/N', 'Contractor Name', 'RC/BN Number', 'Registration ID', 'Sector', 'Grade', 'LGA', 'Status', 'Expiry Date'],
            ...contractors.map((c, i) => [
                i + 1,
                c.name,
                c.rcbnNumber,
                c.id,
                c.sector,
                c.grade,
                c.lga,
                c.status,
                c.expiryDate,
            ]),
        ]
            .map((row) => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Contractors-${new Date().toISOString().split('T')[0]}.csv`;
        a.style.visibility = 'hidden';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success('CSV exported successfully', {
            description: `${contractors.length} contractors exported`,
            duration: 3000,
        });
    };
    
    const [localPage, setLocalPage] = useState(1);
    const localItemsPerPage = 10;
    
    // Pagination logic (client-side for display only)
    const totalPages = Math.ceil(contractors.length / localItemsPerPage);
    const startIndex = (localPage - 1) * localItemsPerPage;
    const endIndex = startIndex + localItemsPerPage;
    const paginatedContractors = contractors.slice(startIndex, endIndex);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="sm:text-xl text-base">Search Results</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{contractors.length} contractors found</p>
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={handleExportCSV}
                        className="cursor-pointer sm:text-base text-xs active:scale-95 transition-transform duration-300"
                    >
                        <FaDownload className="mr-2" />
                        Export CSV
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {/* Loading State */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <FaSpinner className="text-4xl text-theme-green animate-spin mb-4" />
                        <p className="text-gray-600 font-medium">Loading contractors...</p>
                        <p className="text-sm text-gray-500 mt-1">Please wait</p>
                    </div>
                ) : error ? (
                    /* Error State */
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <FaExclamationTriangle className="text-3xl text-red-600" />
                        </div>
                        <p className="text-gray-900 font-semibold text-lg mb-2">Error Loading Data</p>
                        <p className="text-gray-600 text-center max-w-md">{error}</p>
                        <Button 
                            onClick={() => window.location.reload()} 
                            className="mt-4 bg-theme-green hover:bg-theme-green/90"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : contractors.length === 0 ? (
                    /* Not Found State */
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FaCircleXmark className="text-3xl text-gray-400" />
                        </div>
                        <p className="text-gray-900 font-semibold text-lg mb-2">No Contractors Found</p>
                        <p className="text-gray-600 text-center max-w-md">
                            No contractors match your search criteria. Try adjusting your filters.
                        </p>
                    </div>
                ) : (
                    /* Table with Data */
                    <>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">S/N</TableHead>
                                        <TableHead>Contractor Name</TableHead>
                                        <TableHead>RC/BN Number</TableHead>
                                        <TableHead>Sector</TableHead>
                                        <TableHead>Grade</TableHead>
                                        <TableHead>LGA</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Expiry Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedContractors.map((contractor, index) => (
                                        <TableRow key={contractor.id} className={index % 2 === 1 ? 'bg-gray-50' : 'bg-white' + " hover:bg-gray-50"}>
                                            <TableCell className="font-medium text-gray-600">{startIndex + index + 1}</TableCell>
                                            <TableCell className="font-medium">{contractor.name}</TableCell>
                                            <TableCell className="font-mono text-sm">{contractor.rcbnNumber}</TableCell>
                                            <TableCell>
                                                <Badge className={`${getSectorConfig(contractor.sector).badgeClass} text-xs uppercase`}>
                                                    {contractor.sector}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getGradeConfig(contractor.grade).badgeClass} font-bold text-sm`}>
                                                    {contractor.grade}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">{contractor.lga}</TableCell>
                                            <TableCell>
                                                <Badge className={`${getStatusConfig(contractor.status).badgeClass} flex items-center gap-1 w-fit`}>
                                                    <FaCheckCircle className="text-xs" />
                                                    {contractor.status.charAt(0).toUpperCase() + contractor.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">{new Date(contractor.expiryDate).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/contractor/${contractor.id}`}>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        className="cursor-pointer active:scale-95 transition-transform duration-300"
                                                    >
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <p className="text-sm text-gray-600 max-sm:hidden">
                                    Showing {startIndex + 1} to {Math.min(endIndex, contractors.length)} of {contractors.length} results
                                </p>
                                <div className="flex gap-2 max-sm:flex-1 max-sm:justify-between">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setLocalPage(prev => Math.max(1, prev - 1))}
                                        disabled={localPage === 1}
                                        className="cursor-pointer active:scale-95 transition-transform duration-300"
                                    >
                                        Previous
                                    </Button>
                                    <div className="flex gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <Button
                                                key={page}
                                                variant={localPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setLocalPage(page)}
                                                className={`w-9 cursor-pointer active:scale-95 transition-transform duration-300 ${
                                                    localPage === page ? 'bg-theme-green hover:bg-theme-green/90' : ''
                                                }`}
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setLocalPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={localPage === totalPages}
                                        className="cursor-pointer active:scale-95 transition-transform duration-300"
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
