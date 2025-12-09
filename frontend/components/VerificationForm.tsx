'use client';

import { useState, useTransition, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FaSearch } from 'react-icons/fa';
import { FaQrcode } from 'react-icons/fa6';
import { toast } from 'sonner';
import { getContractorById } from '@/lib/contractors';
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
    // Debounced value for validation after user stops typing
    const debouncedRegistrationId = useDebounce(registrationId, 500);
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<VerificationData | null>(null);

    // Validate registration ID format (e.g., IMO-CONT-AA9A-20FFB6510267)
    const validateFormat = (value: string): boolean => {
        if (!value.trim()) return false;
        // Pattern: IMO-CONT-XXXX-XXXXXXXXXXXX (alphanumeric)
        const pattern = /^[A-Z]{2,4}-[A-Z]{2,4}-[A-Z0-9]{4}-[A-Z0-9]{12}$/i;
        return pattern.test(value.trim());
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRegistrationId(value);
        
        // Clear result when user types
        if (result) {
            setResult(null);
        }
    };

    // Compute validation error using debounced value (after user stops typing)
    const validationError = useMemo(() => {
        if (!debouncedRegistrationId.trim()) {
            return '';
        }
        if (!validateFormat(debouncedRegistrationId)) {
            return 'Invalid format. Use: IMO-CONT-XXXX-XXXXXXXXXXXX';
        }
        return '';
    }, [debouncedRegistrationId]);

    // Check if form is valid
    const isFormValid = debouncedRegistrationId.trim() && validateFormat(debouncedRegistrationId) && !validationError;

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!debouncedRegistrationId.trim()) {
            toast.error('Please enter a registration ID');
            return;
        }
        
        if (!validateFormat(debouncedRegistrationId)) {
            toast.error('Invalid registration ID format');
            return;
        }

        setIsLoading(true);
        
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        startTransition(async () => {
            // Fetch contractor by ID from mock data
            const contractor = await getContractorById(debouncedRegistrationId.trim());
            
            if (!contractor) {
                setIsLoading(false);
                setResult(null);
                toast.error('Certificate Not Found', {
                    description: 'No contractor found with this registration ID',
                    duration: 3000,
                });
                return;
            }
            
            // Map contractor data to verification result
            const verificationResult: VerificationData = {
                contractorName: contractor.name,
                registrationId: contractor.id,
                rcbnNumber: contractor.rcbnNumber,
                grade: `Grade ${contractor.grade}`,
                lga: contractor.lga,
                status: contractor.status.charAt(0).toUpperCase() + contractor.status.slice(1),
                validUntil: contractor.expiryDate,
                category: contractor.category,
            };
            
            setResult(verificationResult);
            setIsLoading(false);
            
            // Show appropriate toast based on status
            if (contractor.status === 'approved') {
                toast.success('Certificate Verified', {
                    description: `${contractor.name} - Registration confirmed`,
                    duration: 3000,
                });
            } else if (contractor.status === 'pending') {
                toast.warning('Pending Verification', {
                    description: `${contractor.name} - Registration pending approval`,
                    duration: 3000,
                });
            } else if (contractor.status === 'suspended') {
                toast.error('Suspended Contractor', {
                    description: `${contractor.name} - Registration suspended`,
                    duration: 3000,
                });
            }
        });
    };

    return (
        <div className="max-w-xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="sm:text-xl text-base">Enter Registration Details</CardTitle>
                    <CardDescription className='sm:text-base text-xs'>
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
                                placeholder="e.g., IMO-CONT-XXXX-XXXXXXXXXXXX"
                                value={registrationId}
                                onChange={handleInputChange}
                                className={`sm:h-14 h-12 ${validationError ? 'border-red-500 focus-visible:ring-red-500 sm:text-base text-xs' : ''}`}
                                autoComplete="off"
                                aria-invalid={!!validationError}
                                aria-describedby="registrationId-error registrationId-help"
                            />
                            {validationError ? (
                                <p id="registrationId-error" className="text-xs text-red-600 font-medium">
                                    {validationError}
                                </p>
                            ) : (
                                <p id="registrationId-help" className="text-xs text-gray-500">
                                    Supported format: <span className="font-mono">IMO-CONT-XXXX-XXXXXXXXXXXX</span>
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={!isFormValid || isLoading || isPending}
                            className="w-full h-12 bg-theme-green hover:bg-theme-green/90 cursor-pointer active:scale-95 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaSearch className="mr-2" />
                            {(isLoading || isPending) ? 'Verifying...' : 'Verify Certificate'}
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
            <div className={`transition-all duration-500 ease-in-out ${
                result ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 h-0 overflow-hidden'
            }`}>
                {result && (
                    <VerificationResult
                        contractorName={result.contractorName}
                        id={result.registrationId}
                        rcbnNumber={result.rcbnNumber}
                        grade={result.grade}
                        lga={result.lga}
                        status={result.status}
                        validUntil={result.validUntil}
                        category={result.category}
                    />
                )}
            </div>

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
