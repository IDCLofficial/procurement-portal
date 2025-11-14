'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FaSearch } from 'react-icons/fa';
import { FaQrcode } from 'react-icons/fa6';
import { toast } from 'sonner';
import VerificationResult from './VerificationResult';

interface VerificationData {
    contractorName: string;
    registrationId: string;
    rcbnNumber: string;
    grade: string;
    lga: string;
    status: string;
    validUntil: string;
    category: string;
}

export default function VerificationForm() {
    const [registrationId, setRegistrationId] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState<VerificationData | null>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!registrationId.trim()) {
            toast.error('Please enter a registration ID');
            return;
        }

        setIsVerifying(true);
        
        // Simulate API call
        setTimeout(() => {
            // Mock successful verification
            const mockResult: VerificationData = {
                contractorName: 'ABC Construction Ltd',
                registrationId: registrationId,
                rcbnNumber: 'RC1234567',
                grade: 'Grade A',
                lga: 'Owerri Municipal',
                status: 'Approved',
                validUntil: '31 December 2025',
                category: 'Building Construction',
            };
            
            setResult(mockResult);
            setIsVerifying(false);
            toast.success('Certificate verified successfully!');
        }, 1500);
    };

    return (
        <div className="max-w-xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl">Enter Registration Details</CardTitle>
                    <CardDescription>
                        Enter the registration ID found on the contractor&apos;s certificate
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="grid gap-y-2">
                            <label htmlFor="registrationId" className="text-sm font-medium text-gray-700">
                                Registration ID
                            </label>
                            <Input
                                id="registrationId"
                                type="text"
                                placeholder="e.g., IMO-CONT-2024-001"
                                value={registrationId}
                                onChange={(e) => setRegistrationId(e.target.value)}
                                className="h-12"
                            />
                            <p className="text-xs text-gray-500">
                                Enter the registration ID found on the contractor&apos;s certificate
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={isVerifying}
                            className="w-full h-12 bg-theme-green hover:bg-theme-green/90 cursor-pointer active:scale-95 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaSearch className="mr-2" />
                            {isVerifying ? 'Verifying...' : 'Verify Certificate'}
                        </Button>

                        {/* Info Alert */}
                        <Alert className="bg-blue-50 border-blue-200">
                            <FaQrcode color='#1c398e' />
                            <AlertDescription className="text-sm text-blue-900">
                                <span>
                                    <span className='font-semibold'>Tip:</span> Scan the QR code on the certificate for instant verification.
                                    The QR code contains the registration ID and links directly to the verification result.
                                </span>
                            </AlertDescription>
                        </Alert>
                    </form>
                </CardContent>
            </Card>

            {/* Verification Result */}
            {result && (
                <VerificationResult
                    contractorName={result.contractorName}
                    registrationId={result.registrationId}
                    rcbnNumber={result.rcbnNumber}
                    grade={result.grade}
                    lga={result.lga}
                    status={result.status}
                    validUntil={result.validUntil}
                    category={result.category}
                />
            )}

            {/* Additional Information */}
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 mb-2">
                    For additional assistance or to report suspicious certificates,
                </p>
                <p className="text-sm">
                    contact BPPPI at{' '}
                    <a
                        href="mailto:info@bpppi.imo.gov.ng"
                        className="text-theme-green hover:underline font-medium"
                    >
                        info@bpppi.imo.gov.ng
                    </a>
                </p>
            </div>
        </div>
    );
}
