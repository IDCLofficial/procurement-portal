'use client';

import { use, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import ContractorDetails from '@/components/ContractorDetails';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { FaQrcode } from 'react-icons/fa6';
import { useGetContractorByIdQuery } from '@/store/api/public.api';

export default function ContractorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const { data: contractor, isLoading, error } = useGetContractorByIdQuery(id);

    // Check if accessed via QR code scan
    const isFromQR = useMemo(() => {
        return searchParams.get('verify') === 'true' || 
               searchParams.get('qr') === 'true' || 
               searchParams.get('scan') === 'true' ||
               searchParams.get('v') === '1';
    }, [searchParams]);

    // Analyze ID format for custom error message
    const analyzeIdFormat = (id: string) => {
        // New format: IMO-CONT-XXXX-XXXXXXXXXXXX (e.g., IMO-CONT-AA9A-20FFB6510267)
        const newFormatPattern = /^[A-Z]{2,4}-[A-Z]{2,4}-[A-Z0-9]{4}-[A-Z0-9]{12}$/i;
        // Old format: IMO-CONT-YYYY-XXX (e.g., IMO-CONT-2024-001)
        const oldFormatPattern = /^[A-Z]{2,4}-[A-Z]{2,4}-\d{4}-\d{3,4}$/i;
        
        if (newFormatPattern.test(id)) {
            return {
                isValid: true,
                message: "The ID format is correct, but this contractor doesn't exist in our records.",
                suggestion: "Double-check the ID or search the directory."
            };
        } else if (oldFormatPattern.test(id)) {
            return {
                isValid: false,
                message: "This looks like an old registration ID format.",
                suggestion: "We've updated our ID system. Please use the new format: IMO-CONT-XXXX-XXXXXXXXXXXX"
            };
        } else if (id.startsWith('IMO-CONT-') || id.startsWith('imo-cont-')) {
            return {
                isValid: false,
                message: "The ID format appears incomplete or incorrect.",
                suggestion: "Registration IDs should follow this format: IMO-CONT-XXXX-XXXXXXXXXXXX"
            };
        } else {
            return {
                isValid: false,
                message: "This doesn't look like a valid registration ID.",
                suggestion: "Registration IDs start with 'IMO-CONT-' followed by alphanumeric characters."
            };
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
                <Header
                    title="Public Contractor Directory"
                    description="Search and verify approved contractors"
                    hasBackButton
                />
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                        <FaSpinner className="w-12 h-12 text-theme-green animate-spin" />
                        {isFromQR ? (
                            <div className="text-center space-y-2">
                                <p className="text-lg font-semibold text-gray-900">Verifying Contractor Certificate...</p>
                                <p className="text-sm text-gray-600">Please wait while we validate the QR code</p>
                            </div>
                        ) : (
                            <p className="text-lg text-gray-600">Loading contractor details...</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !contractor) {
        const idAnalysis = analyzeIdFormat(id);
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
                <Header
                    title="Public Contractor Directory"
                    description="Search and verify approved contractors"
                    hasBackButton
                />
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-2xl mx-auto">
                        {/* 404 Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                            {/* Header Section */}
                            <div className="bg-linear-to-r from-red-50 to-orange-50 px-8 py-12 text-center border-b">
                                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg 
                                        className="w-12 h-12 text-red-600" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                        />
                                    </svg>
                                </div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                    Contractor Not Found
                                </h1>
                                <p className="text-lg text-gray-600">
                                    We couldn&apos;t find a contractor with ID: <span className="font-mono font-semibold text-red-600">{id}</span>
                                </p>
                            </div>

                            {/* Content Section */}
                            <div className="px-8 py-8">
                                <div className="space-y-6">
                                    {/* Format Analysis */}
                                    <div className={`p-4 rounded-lg border ${idAnalysis.isValid ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
                                        <div className="flex gap-3">
                                            <svg className={`w-5 h-5 mt-0.5 shrink-0 ${idAnalysis.isValid ? 'text-blue-600' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <p className={`font-semibold mb-1 ${idAnalysis.isValid ? 'text-blue-900' : 'text-orange-900'}`}>
                                                    {idAnalysis.message}
                                                </p>
                                                <p className={`text-sm ${idAnalysis.isValid ? 'text-blue-700' : 'text-orange-700'}`}>
                                                    {idAnalysis.suggestion}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Possible Reasons - Only show if format is valid */}
                                    {idAnalysis.isValid && (
                                        <>
                                            <div className="border-t border-gray-200"></div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Possible reasons:</h2>
                                                <ul className="space-y-2 text-gray-600 ml-4">
                                                    <li className="list-disc">The contractor may not be registered yet</li>
                                                    <li className="list-disc">The registration may have been removed or suspended</li>
                                                    <li className="list-disc">There may be a typo in the ID</li>
                                                </ul>
                                            </div>
                                        </>
                                    )}

                                    {/* Divider */}
                                    <div className="border-t border-gray-200"></div>

                                    {/* What to do next */}
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            What You Can Do
                                        </h2>
                                        <div className="grid sm:grid-cols-2 gap-3">
                                            <Link href="/directory" className="block">
                                                <div className="p-4 border border-gray-200 rounded-lg hover:border-theme-green hover:bg-green-50 transition-all cursor-pointer group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-theme-green group-hover:scale-110 transition-all">
                                                            <FaSearch className="text-blue-600 group-hover:text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">Browse Directory</p>
                                                            <p className="text-xs text-gray-600">Search all contractors</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                            <Link href="/verify-certificate" className="block">
                                                <div className="p-4 border border-gray-200 rounded-lg hover:border-theme-green hover:bg-green-50 transition-all cursor-pointer group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-theme-green group-hover:scale-110 transition-all">
                                                            <FaQrcode className="text-purple-600 group-hover:text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">Verify Certificate</p>
                                                            <p className="text-xs text-gray-600">Use registration ID</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Contact Support */}
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold text-gray-900">Need help?</span> Contact the Imo State Bureau of Public Private Partnerships & Investments (BPPPI) for assistance with contractor verification.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="px-8 py-6 bg-gray-50 border-t flex flex-wrap gap-3 justify-center">
                                <Link href="/">
                                    <Button variant="outline" className="cursor-pointer active:scale-95 transition-transform">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Go Home
                                    </Button>
                                </Link>
                                <Link href="/directory">
                                    <Button className="bg-theme-green hover:bg-theme-green/90 cursor-pointer active:scale-95 transition-transform">
                                        <FaSearch className="mr-2" />
                                        Search Directory
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            <Header
                title="Public Contractor Directory"
                description="Search and verify approved contractors"
                hasBackButton
                rightButton={
                    <Link href="/verify-certificate">
                        <Button variant="outline" className="cursor-pointer active:scale-95 transition-transform duration-300">
                            <FaQrcode className="h-4 w-4" />
                            <span>Verify Certificate</span>
                        </Button>
                    </Link>
                }
            />

            <ContractorDetails contractor={{
                id: contractor.certificateId,
                name: contractor.contractorName,
                rcbnNumber: contractor.rcBnNumber,
                tinNumber: contractor.tin,
                sector: contractor.approvedSectors[0] || 'N/A',
                category: contractor.categories.join(', ') || 'N/A',
                grade: contractor.grade,
                lga: contractor.lga,
                status: contractor.status as 'approved' | 'pending' | 'suspended',
                expiryDate: new Date(contractor.validUntil).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric' 
                }),
                address: contractor.address,
                phone: contractor.phone,
                email: contractor.email,
                website: contractor.website,
                approvedSectors: contractor.approvedSectors,
            }} />
        </div>
    );
}
