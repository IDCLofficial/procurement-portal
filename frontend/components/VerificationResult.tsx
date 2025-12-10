'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaCheckCircle, FaExclamationCircle, FaFileAlt } from 'react-icons/fa';
import Link from 'next/link';
import { getStatusConfig } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface VerificationResultProps {
    contractorName: string;
    id: string;
    rcbnNumber: string;
    grade: string;
    lga: string;
    status: string;
    validUntil: string;
    category: string;
}

export default function VerificationResult({
    contractorName,
    id,
    rcbnNumber,
    grade,
    lga,
    status,
    validUntil,
    category,
}: VerificationResultProps) {
    return (
        <Card className="shadow-lg mt-6 bg-green-50 border-green-200">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-200/80 border border-gray-100 rounded-full flex items-center justify-center">
                        <FaCheckCircle className="text-white text-xl" color='047857' />
                    </div>
                    <div>
                        <CardTitle className="text-xl text-theme-green">Certificate Verified</CardTitle>
                        <CardDescription className="text-green-700">
                            This contractor is registered with BPPPI
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-600 mb-1">Contractor Name</p>
                        <p className="font-semibold text-gray-900">{contractorName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 mb-1">Registration ID</p>
                        <p className="font-semibold text-gray-900">{id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 mb-1">RC/BN Number</p>
                        <p className="font-semibold text-gray-900">{rcbnNumber}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 mb-1">Grade</p>
                        <p className={`font-semibold text-gray-900`}>{grade}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 mb-1">LGA</p>
                        <p className="font-semibold text-gray-900">{lga}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 mb-1">Status</p>
                        <Badge className={getStatusConfig(status.toLowerCase()).badgeClass}>
                            {status === "approved" ? <FaCheckCircle className="mr-1" /> : <FaExclamationCircle className="mr-1" />}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 mb-1">Valid Until</p>
                        <p className={cn(
                            "font-semibold text-gray-900",
                            new Date(validUntil) < new Date() ? "text-red-600" : ""
                        )}>{new Date(validUntil).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-600 mb-1">Sector</p>
                        <p className="font-semibold text-gray-900">{category}</p>
                    </div>
                </div>

                <hr />

                <Link href={`/contractor/${id}`}>
                    <Button variant="outline" className="w-full cursor-pointer active:scale-95 transition-transform duration-300">
                        <FaFileAlt className="mr-2" />
                        View Full Profile
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
