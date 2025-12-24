'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import QRCodePopover from '@/components/QRCodePopover';
import VerificationModal from '@/components/VerificationModal';
import { FaCheckCircle, FaDownload, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'sonner';
import { FaQrcode } from 'react-icons/fa6';
import { getGradeConfig, getStatusConfig } from '@/lib/constants';
import { copyToClipboard } from '@/lib';

interface ContractorDetailsProps {
    contractor: {
        id: string;
        name: string;
        rcbnNumber: string;
        tinNumber: string;
        sector: string;
        companyName: string;
        category: string;
        grade: string;
        lga: string;
        status: 'approved' | 'pending' | 'suspended';
        expiryDate: string;
        address: string;
        phone: string;
        email: string;
        website: string;
    };
}

export default function ContractorDetails({ contractor }: ContractorDetailsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    // Check if accessed via QR code scan
    const isFromQR = useMemo(() => {
        return searchParams.get('verify') === 'true' ||
            searchParams.get('qr') === 'true' ||
            searchParams.get('scan') === 'true' ||
            searchParams.get('v') === '1';
    }, [searchParams]);

    const [showModal, setShowModal] = useState(isFromQR);


    const handleDownloadCertificate = () => {
        toast.success('Certificate downloaded successfully', {
            description: `Certificate for ${contractor.name}`,
            duration: 3000,
        });
    };

    const handleOnClose = () => {
        setShowModal(false);
        // Remove search params from URL
        router.replace(`/contractor/${contractor.id}`, { scroll: false });
    };

    // Generate the verification URL for QR code with verify parameter
    const verificationUrl = typeof window !== 'undefined'
        ? `https://procurement-portal-mu.vercel.app/contractor/${contractor.id}?scan=true`
        : `https://procurement-portal-mu.vercel.app/contractor/${contractor.id}?scan=true`;

    return (
        <>
            <VerificationModal
                contractor={contractor}
                isOpen={showModal}
                onClose={handleOnClose}
            />
            <div className="container mx-auto px-4 py-8 space-y-6">
                {/* Header Section */}
                <Card>
                    <CardContent className="pt-0">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-semibold text-gray-900">
                                        {contractor.name}
                                    </h1>
                                    <Badge className={getStatusConfig(contractor.status).badgeClass}>
                                        <FaCheckCircle className="h-3 w-3" />
                                        <span className="capitalize">{contractor.status}</span>
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 group">
                                    <p className="text-sm text-gray-600">
                                        Registration ID: <span className='font-semibold'>{contractor.id}</span>
                                    </p>
                                    <button
                                        onClick={() => copyToClipboard(contractor.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded cursor-pointer"
                                        title="Copy Registration ID"
                                    >
                                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <QRCodePopover
                                    url={verificationUrl}
                                    label="Show QR"
                                    buttonVariant="outline"
                                />
                                <Button
                                    onClick={handleDownloadCertificate}
                                    className="bg-theme-green hover:bg-theme-green/90 cursor-pointer active:scale-95 transition-transform duration-300"
                                >
                                    <FaDownload className="h-4 w-4" />
                                    <span>Download Certificate</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Company Information */}
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="pt-0">
                            <div className="flex items-center gap-2 mb-5">
                                <h2 className="text-xl font-medium text-gray-900/50">Company Information</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="group">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Company Name</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg font-semibold text-gray-900">{contractor.companyName}</p>
                                    </div>
                                </div>
                                <div className="h-px bg-gray-100"></div>
                                <div className="group">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">CAC Number</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-base font-semibold text-gray-900">{contractor.rcbnNumber}</p>
                                        <button
                                            onClick={() => copyToClipboard(contractor.rcbnNumber)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded cursor-pointer"
                                            title="Copy CAC Number"
                                        >
                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="h-px bg-gray-100"></div>
                                <div className="group">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">TIN</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-base font-semibold text-gray-900">{contractor.tinNumber}</p>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(contractor.tinNumber);
                                                toast.success('TIN copied to clipboard');
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded cursor-pointer"
                                            title="Copy TIN"
                                        >
                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="pt-0">
                            <div className="flex items-center gap-2 mb-5">
                                <h2 className="text-xl font-medium text-gray-900/50">Contact Information</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 group">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-theme-green/10 transition-colors">
                                        <FaMapMarkerAlt className="h-3.5 w-3.5 text-gray-600 group-hover:text-theme-green transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Address</p>
                                        <p className="text-sm font-medium text-gray-900 leading-relaxed">{contractor.address}</p>
                                        <p className="text-xs text-gray-600 mt-1">LGA: {contractor.lga}</p>
                                    </div>
                                </div>
                                <div className="h-px bg-gray-100"></div>
                                <div className="flex items-start gap-3 group">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-theme-green/10 transition-colors">
                                        <FaPhone className="h-3.5 w-3.5 text-gray-600 group-hover:text-theme-green transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                                        <a href={`tel:${contractor.phone}`} className="text-sm font-medium text-gray-900 hover:text-theme-green transition-colors">
                                            {contractor.phone}
                                        </a>

                                        <button
                                            onClick={() => copyToClipboard(contractor.phone)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded cursor-pointer"
                                            title="Copy Company Phone"
                                        >
                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="h-px bg-gray-100"></div>
                                <div className="flex items-start gap-3 group">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-theme-green/10 transition-colors">
                                        <FaEnvelope className="h-3.5 w-3.5 text-gray-600 group-hover:text-theme-green transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</p>
                                        <a href={`mailto:${contractor.email}`} className="text-sm font-medium text-gray-900 hover:text-theme-green transition-colors break-all">
                                            {contractor.email}
                                        </a>
                                        <button
                                            onClick={() => copyToClipboard(contractor.email)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded cursor-pointer"
                                            title="Copy Company Email"
                                        >
                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                {contractor.website && (<>
                                    <div className="h-px bg-gray-100"></div>
                                    <div className="flex items-start gap-3 group">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-theme-green/10 transition-colors">
                                            <FaGlobe className="h-3.5 w-3.5 text-gray-600 group-hover:text-theme-green transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Website</p>
                                            <div className="inline-flex gap-2 items-center">
                                                {contractor.website && <a
                                                    href={`${contractor.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-theme-green hover:underline break-all inline-flex items-center gap-1"
                                                >
                                                    {contractor.website}
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>}
                                                {!contractor.website && <p className="text-sm font-medium text-gray-900">Not Available</p>}
                                                <button
                                                    onClick={() => copyToClipboard(contractor.website)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded cursor-pointer"
                                                    title="Copy Company Website"
                                                >
                                                    <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sector & Classification */}
                    <Card>
                        <CardContent className="pt-0">
                            <h2 className="text-xl font-medium mb-4 opacity-50">Sector & Classification</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Associated <abbr title="Ministries, Departments, and Agencies (government bodies)">MDA/MDAs</abbr></p>
                                    <div className="flex flex-wrap gap-2 text-lg capitalize font-medium">
                                        {/* <pre>{JSON.stringify(contractor, null, 2)}</pre> */}
                                        {/* {contractor.approvedSectors.map((sector) => (
                                        <Badge 
                                            key={sector} 
                                            className={getSectorConfig(sector).badgeClass}
                                        >
                                            {sector}
                                        </Badge>
                                    ))} */}
                                        {contractor.sector}
                                    </div>
                                </div>
                                <div className="h-px bg-gray-100"></div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Category</p>
                                    <p className="text-base font-medium">{contractor.category}</p>
                                </div>
                                <div className="h-px bg-gray-100"></div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Grade</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold ${getGradeConfig(contractor.grade).badgeClass}`}>
                                            {contractor.grade.toUpperCase()}
                                        </div>
                                        <span className="text-base font-medium">Grade {contractor.grade.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Registration Status */}
                    <Card>
                        <CardContent className="pt-0">
                            <h2 className="text-xl font-medium mb-4 opacity-50">Registration Status</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Current Status</p>
                                    <Badge className={getStatusConfig(contractor.status).badgeClass}>
                                        <FaCheckCircle className="h-3 w-3" />
                                        <span className="capitalize">{contractor.status}</span>
                                    </Badge>
                                </div>
                                <div className="h-px bg-gray-100"></div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Registration ID</p>
                                    <div className="flex items-center gap-2 group">
                                        <p className="text-base font-medium font-mono">{contractor.id}</p>
                                        <button
                                            onClick={() => copyToClipboard(contractor.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded cursor-pointer"
                                            title="Copy Registration ID"
                                        >
                                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="h-px bg-gray-100"></div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Valid Until</p>
                                    <p className="text-base font-medium">{contractor.expiryDate}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Verification Notice */}
                <Card className={
                    contractor.status === 'approved'
                        ? 'bg-green-50 border-green-200'
                        : contractor.status === 'pending'
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-red-50 border-red-200'
                }>
                    <CardContent className="pt-0">
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 aspect-square border border-gray-100 rounded-full flex items-center justify-center ${contractor.status === 'approved'
                                    ? 'bg-green-200/80'
                                    : contractor.status === 'pending'
                                        ? 'bg-yellow-200/80'
                                        : 'bg-red-200/80'
                                }`}>
                                <FaQrcode className="text-white text-xl" color={
                                    contractor.status === 'approved'
                                        ? '047857'
                                        : contractor.status === 'pending'
                                            ? 'ca8a04'
                                            : 'dc2626'
                                } />
                            </div>
                            <div className="space-y-2">
                                <p className={`font-semibold text-base ${contractor.status === 'approved'
                                        ? 'text-green-900'
                                        : contractor.status === 'pending'
                                            ? 'text-yellow-900'
                                            : 'text-red-900'
                                    }`}>
                                    {contractor.status === 'approved' && 'Verified Contractor'}
                                    {contractor.status === 'pending' && 'Pending Verification'}
                                    {contractor.status === 'suspended' && 'Suspended Contractor'}
                                </p>
                                <p className={`text-sm leading-relaxed ${contractor.status === 'approved'
                                        ? 'text-green-800'
                                        : contractor.status === 'pending'
                                            ? 'text-yellow-800'
                                            : 'text-red-800'
                                    }`}>
                                    {contractor.status === 'approved' &&
                                        'This contractor is registered with the Imo State Bureau of Public Private Partnerships & Investments (BPPPI) and has met all compliance requirements. The information displayed is accurate as of the last verification date.'
                                    }
                                    {contractor.status === 'pending' &&
                                        'This contractor registration is currently pending approval by the Imo State Bureau of Public Private Partnerships & Investments (BPPPI). Please check back later for updated status.'
                                    }
                                    {contractor.status === 'suspended' &&
                                        'This contractor has been suspended by the Imo State Bureau of Public Private Partnerships & Investments (BPPPI). Please contact BPPPI for more information before engaging with this contractor.'
                                    }
                                </p>
                                <div className="pt-2">
                                    <p className={`text-sm font-semibold ${contractor.status === 'approved'
                                            ? 'text-green-800'
                                            : contractor.status === 'pending'
                                                ? 'text-yellow-800'
                                                : 'text-red-800'
                                        }`}>Note:</p>
                                    <p className={`text-sm ${contractor.status === 'approved'
                                            ? 'text-green-800'
                                            : contractor.status === 'pending'
                                                ? 'text-yellow-800'
                                                : 'text-red-800'
                                        }`}>
                                        Always verify the registration status before engaging in any contract. For additional verification, scan the QR code on the contractor&apos;s certificate.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
