'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FaCheckCircle, FaDownload, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { FaCircleXmark, FaClock, FaX } from 'react-icons/fa6';
import { getGradeConfig, getSectorConfig, getStatusConfig } from '@/lib/constants';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCurrentPage, setItemsPerPage } from '@/store/slices/publicSlice';
import { useGetAllContractorsQuery } from '@/store/api/public.api';
import { toast } from 'sonner';
import { toValidJSDate } from '@/lib';
import { updateSearchParam } from '@/lib/utils';
import { Loader } from 'lucide-react';

export interface Contractor {
    id: string;
    name: string;
    company: string;
    rcbnNumber: string;
    sector: string[];
    grade: string;
    lga: string;
    status: 'approved' | 'pending' | 'suspended';
    expiryDate: string;
}

export default function ContractorTable() {
    const dispatch = useAppDispatch();
    const [isMobile, setIsMobile] = useState(false);

    // Detect screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Set items per page based on screen size
    useEffect(() => {
        const newLimit = isMobile ? 5 : 10;
        dispatch(setItemsPerPage(newLimit));
    }, [isMobile, dispatch]);

    // Get Redux state
    const { searchQuery, sectorFilter, gradeFilter, mdasFilter, statusFilter, currentPage, itemsPerPage } = useAppSelector((state) => state.public);

    // Fetch contractors from API
    const { data: contractorsData, isLoading, error: errorContractors, isFetching } = useGetAllContractorsQuery({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        sector: sectorFilter !== 'all' ? sectorFilter : undefined,
        grade: gradeFilter !== 'all' ? gradeFilter : undefined,
        mda: mdasFilter !== 'all' ? mdasFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
    });

    // Transform API data to match Contractor interface
    const contractors = useMemo(() => {
        if (!contractorsData?.certificates) return [];

        return contractorsData.certificates.map((cert) => ({
            id: cert._id,
            name: cert.contractorName,
            company: cert.companyName,
            certId: cert.certificateId,
            rcbnNumber: cert.rcBnNumber || 'N/A',
            sector: cert.mda || "N/A", // TODO: Get from API
            grade: cert.grade || 'N/A', // TODO: Get from API
            lga: cert.lga || 'N/A', // TODO: Get from API
            status: cert.status || 'approved' as const, // TODO: Get from API
            expiryDate: new Date(cert.validUntil).toLocaleDateString('en-GB'),
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

    // Server-side pagination
    const totalPages = contractorsData?.totalPages || 1;
    const totalContractors = contractorsData?.total || 0;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalContractors);

    const handlePageChange = (page: number) => {
        updateSearchParam("page", page.toString());
        dispatch(setCurrentPage(page));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = isMobile ? 3 : 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= maxVisible; i++) {
                    pages.push(i);
                }
                if (totalPages > maxVisible) pages.push('...');
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <Card>
            <CardHeader className="max-sm:p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                        <CardTitle className="sm:text-xl text-base">Search Results</CardTitle>
                        <p className="max-sm:text-xs text-sm text-gray-600 mt-1">{totalContractors} contractors found</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleExportCSV}
                        className="cursor-pointer max-sm:text-xs max-sm:h-9 max-sm:px-3 sm:text-base text-xs active:scale-95 transition-transform duration-300"
                    >
                        <FaDownload className="max-sm:mr-1 mr-2 max-sm:h-3 max-sm:w-3" />
                        <span className="max-sm:hidden">Export CSV</span>
                        <span className="sm:hidden">Export</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="max-sm:p-4 relative">
                {/* Loading State */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center max-sm:py-12 py-16">
                        <FaSpinner className="max-sm:text-3xl text-4xl text-theme-green animate-spin mb-4" />
                        <p className="text-gray-600 font-medium max-sm:text-sm">Loading contractors...</p>
                        <p className="text-sm text-gray-500 mt-1 max-sm:text-xs">Please wait</p>
                    </div>
                ) : error ? (
                    /* Error State */
                    <div className="flex flex-col items-center justify-center max-sm:py-12 py-16">
                        <div className="max-sm:w-12 max-sm:h-12 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <FaExclamationTriangle className="max-sm:text-2xl text-3xl text-red-600" />
                        </div>
                        <p className="text-gray-900 font-semibold max-sm:text-base text-lg mb-2">Error Loading Data</p>
                        <p className="text-gray-600 text-center max-w-md max-sm:text-sm">{error}</p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-theme-green hover:bg-theme-green/90 max-sm:text-sm max-sm:h-9"
                        >
                            Try Again
                        </Button>
                    </div>
                ) : contractors.length === 0 ? (
                    /* Not Found State */
                    <div className="flex flex-col items-center justify-center max-sm:py-12 py-16">
                        <div className="max-sm:w-12 max-sm:h-12 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FaCircleXmark className="max-sm:text-2xl text-3xl text-gray-400" />
                        </div>
                        <p className="text-gray-900 font-semibold max-sm:text-base text-lg mb-2">No Contractors Found</p>
                        <p className="text-gray-600 text-center max-w-md max-sm:text-sm max-sm:px-4">
                            No contractors match your search criteria. Try adjusting your filters.
                        </p>
                    </div>
                ) : (
                    /* Table with Data */
                    <>
                        {/* Loading Overlay for Page Changes */}
                        {isFetching && !isLoading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                                <div className="flex flex-col items-center gap-3">
                                    <FaSpinner className="text-2xl text-theme-green animate-spin" />
                                    <p className="text-sm font-medium text-gray-700">Loading page {currentPage}...</p>
                                </div>
                            </div>
                        )}

                        {/* Desktop Table View */}
                        <div className="overflow-x-auto max-sm:hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">S/N</TableHead>
                                        <TableHead>Company Name</TableHead>
                                        <TableHead>Contractor Name</TableHead>
                                        <TableHead>CAC Number</TableHead>
                                        <TableHead><abbr title="Ministries, Departments, and Agencies (government bodies)">MDA/MDAs</abbr></TableHead>
                                        <TableHead>Grade</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Expiry Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contractors.map((contractor, index) => (
                                        <TableRow key={contractor.id} className={index % 2 === 1 ? 'bg-gray-50' : 'bg-white' + " hover:bg-gray-50"}>
                                            <TableCell className="font-medium text-gray-600">{startIndex + index + 1}</TableCell>
                                            <TableCell className="font-semibold">{contractor.company}</TableCell>
                                            <TableCell className="font-semibold">{contractor.name}</TableCell>
                                            <TableCell className="font-semibold uppercase text-sm">{contractor.rcbnNumber}</TableCell>
                                            <TableCell className='grid gap-1 capitalize'>
                                                {contractor.sector.length > 2 ? contractor.sector : "N/A"}
                                            </TableCell>
                                            <TableCell>
                                                <div className={`w-8 h-8 rounded-full flex items-center uppercase justify-center ${getGradeConfig(contractor.grade).badgeClass} font-bold text-sm`}>
                                                    {contractor.grade}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${getStatusConfig(contractor.status).badgeClass} flex items-center gap-1 w-fit capitalize`}>
                                                    {(() => {
                                                        switch (contractor.status.toLowerCase()) {
                                                            case "approved":
                                                                return <FaCheckCircle className="text-xs" />
                                                            case "expired":
                                                                return <FaClock className="text-xs" />
                                                            case "revoked":
                                                                return <FaX className="text-xs" />
                                                            default:
                                                                return <Loader className="text-xs animate-spin" />
                                                        }
                                                    })()}
                                                    {contractor.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">{new Date(toValidJSDate(contractor.expiryDate)).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Link href={`/contractor/${contractor.certId}`}>
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

                        {/* Mobile & Tablet Card View */}
                        <div className="sm:hidden space-y-3">
                            {contractors.map((contractor, index) => (
                                <Card key={contractor.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
                                    <div className="h-1.5 bg-linear-to-r from-theme-green to-emerald-400" />
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-medium text-gray-500">#{startIndex + index + 1}</span>
                                                    <div className={`px-2 py-0.5 rounded-full flex items-center uppercase justify-center ${getGradeConfig(contractor.grade).badgeClass} font-bold text-xs`}>
                                                        Grade {contractor.grade}
                                                    </div>
                                                </div>
                                                <h3 className="font-bold text-base leading-tight text-gray-900 mb-1">{contractor.name}</h3>
                                                <p className="text-xs text-gray-600 font-mono">{contractor.rcbnNumber}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            <Badge className={`${getSectorConfig(contractor.sector).badgeClass} text-xs max-w-5 truncate uppercase font-medium`}>
                                                {contractor.sector}
                                            </Badge>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-0.5">Location</p>
                                                <p className="font-semibold text-sm text-gray-900">{contractor.lga}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-0.5">Valid Until</p>
                                                <p className="font-semibold text-sm text-gray-900">{new Date(contractor.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between gap-2">
                                            <Badge className={`${getStatusConfig(contractor.status).badgeClass} flex items-center gap-1.5 text-xs font-medium px-3 py-1`}>
                                                <FaCheckCircle className="text-xs" />
                                                {contractor.status.charAt(0).toUpperCase() + contractor.status.slice(1)}
                                            </Badge>
                                            <Link href={`/contractor/${contractor.id}`} className="flex-1 max-w-[140px]">
                                                <Button 
                                                    variant="default"
                                                    size="sm"
                                                    className="w-full cursor-pointer active:scale-95 transition-transform duration-300 h-9 text-xs bg-theme-green hover:bg-theme-green/90 font-medium"
                                                >
                                                    View Details
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t max-sm:flex-col max-sm:gap-3">
                                {/* Loading indicator in pagination */}
                                {isFetching && !isLoading && (
                                    <div className="absolute left-1/2 -translate-x-1/2 -top-8 max-sm:-top-6">
                                        <div className="flex items-center gap-2 bg-theme-green/10 border border-theme-green/30 rounded-full px-3 py-1.5 max-sm:px-2 max-sm:py-1">
                                            <FaSpinner className="text-theme-green animate-spin text-xs" />
                                            <span className="text-xs font-medium text-theme-green max-sm:hidden">Updating...</span>
                                        </div>
                                    </div>
                                )}
                                
                                <p className="text-sm text-gray-600 max-sm:hidden">
                                    Showing {startIndex + 1} to {endIndex} of {totalContractors} results
                                </p>
                                <p className="sm:hidden text-xs text-gray-600 font-medium">
                                    Page {currentPage} of {totalPages} • {totalContractors} total
                                </p>
                                <div className="flex gap-2 max-sm:w-full max-sm:justify-center items-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1 || isFetching}
                                        className="cursor-pointer active:scale-95 transition-transform duration-300 max-sm:text-xs max-sm:h-9 max-sm:px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="max-sm:hidden">Previous</span>
                                        <span className="sm:hidden">Prev</span>
                                    </Button>
                                    <div className="flex gap-1">
                                        {getPageNumbers().map((page, idx) => (
                                            page === '...' ? (
                                                <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 max-sm:w-7 max-sm:h-9">
                                                    ...
                                                </span>
                                            ) : (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(page as number)}
                                                    disabled={isFetching}
                                                    className={`max-sm:w-8 max-sm:h-9 max-sm:text-xs w-9 cursor-pointer active:scale-95 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                        currentPage === page ? 'bg-theme-green hover:bg-theme-green/90 font-bold' : ''
                                                    }`}
                                                >
                                                    {page}
                                                </Button>
                                            )
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages || isFetching}
                                        className="cursor-pointer active:scale-95 transition-transform duration-300 max-sm:text-xs max-sm:h-9 max-sm:px-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
