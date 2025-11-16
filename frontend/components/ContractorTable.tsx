'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FaCheckCircle, FaDownload, FaExclamationTriangle, FaSearch, FaSpinner } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';

export interface Contractor {
    id: string;
    name: string;
    rcbnNumber: string;
    registrationId: string;
    sector: string;
    grade: string;
    lga: string;
    status: 'approved' | 'pending' | 'suspended';
    expiryDate: string;
}

interface ContractorTableProps {
    contractors: Contractor[];
    onExportCSV: () => void;
    isLoading?: boolean;
    error?: string | null;
    isInitialState?: boolean;
}

export default function ContractorTable({ 
    contractors, 
    onExportCSV, 
    isLoading = false, 
    error = null,
    isInitialState = false 
}: ContractorTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    // Pagination logic
    const totalPages = Math.ceil(contractors.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedContractors = contractors.slice(startIndex, endIndex);
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'suspended':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getSectorColor = (sector: string) => {
        switch (sector.toLowerCase()) {
            case 'works':
                return 'bg-blue-100 text-blue-800';
            case 'supplies':
                return 'bg-purple-100 text-purple-800';
            case 'services':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getGradeBadge = (grade: string) => {
        const gradeColors: Record<string, string> = {
            'A': 'bg-theme-green text-white',
            'B': 'bg-blue-600 text-white',
            'C': 'bg-gray-600 text-white',
        };
        return gradeColors[grade] || 'bg-gray-500 text-white';
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl">Search Results</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{contractors.length} contractors found</p>
                    </div>
                    <Button 
                        variant="outline" 
                        onClick={onExportCSV}
                        className="cursor-pointer active:scale-95 transition-transform duration-300"
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
                ) : isInitialState ? (
                    /* Initial Empty State */
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <FaSearch className="text-3xl text-blue-600" />
                        </div>
                        <p className="text-gray-900 font-semibold text-lg mb-2">Start Your Search</p>
                        <p className="text-gray-600 text-center max-w-md">
                            Use the search and filters above to find contractors in the directory
                        </p>
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
                                        <TableHead>Registration ID</TableHead>
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
                                        <TableRow key={contractor.id}>
                                            <TableCell className="font-medium text-gray-600">{startIndex + index + 1}</TableCell>
                                            <TableCell className="font-medium">{contractor.name}</TableCell>
                                            <TableCell className="font-mono text-sm">{contractor.rcbnNumber}</TableCell>
                                            <TableCell className="font-mono text-sm">{contractor.registrationId}</TableCell>
                                            <TableCell>
                                                <Badge className={`${getSectorColor(contractor.sector)} text-xs uppercase`}>
                                                    {contractor.sector}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getGradeBadge(contractor.grade)} font-bold text-sm`}>
                                                    {contractor.grade}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm">{contractor.lga}</TableCell>
                                            <TableCell>
                                                <Badge className={`${getStatusColor(contractor.status)} flex items-center gap-1 w-fit`}>
                                                    <FaCheckCircle className="text-xs" />
                                                    {contractor.status.charAt(0).toUpperCase() + contractor.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">{contractor.expiryDate}</TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    className="cursor-pointer active:scale-95 transition-transform duration-300"
                                                >
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                <p className="text-sm text-gray-600">
                                    Showing {startIndex + 1} to {Math.min(endIndex, contractors.length)} of {contractors.length} results
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="cursor-pointer active:scale-95 transition-transform duration-300"
                                    >
                                        Previous
                                    </Button>
                                    <div className="flex gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                            <Button
                                                key={page}
                                                variant={currentPage === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-9 cursor-pointer active:scale-95 transition-transform duration-300 ${
                                                    currentPage === page ? 'bg-theme-green hover:bg-theme-green/90' : ''
                                                }`}
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
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
