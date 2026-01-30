'use client';

import { useState, useMemo, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { FaQrcode } from 'react-icons/fa6';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { setRegistrationId as setReduxRegistrationId } from '@/store/slices/verificationSlice';
import { useLazyGetContractorByIdQuery } from '@/store/api/public.api';
import VerificationResult from './VerificationResult';


export default function VerificationForm() {
    const dispatch = useAppDispatch();
    const [registrationId, setRegistrationId] = useState('');
    const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
    // Debounced value for validation after user stops typing
    const debouncedRegistrationId = useDebounce(registrationId, 500);
    
    // RTK Query lazy query
    const [getContractor, { data: contractorData, isLoading, isFetching, error }] = useLazyGetContractorByIdQuery();

    // Validate registration ID format (e.g., IMO-CONT-AA9A-20FFB6510267)
    const validateFormat = (value: string): boolean => {
        if (!value.trim()) return false;
        // Pattern: IMO-CONT-YYYY-XXXXXX (alphanumeric)
        const pattern = /^IMO-CONT-(\d{4}|[A-Z]{3})-\w{6}$/i;
        return pattern.test(value.trim());
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRegistrationId(value);
        dispatch(setReduxRegistrationId(value));
    };

    // Compute validation error using debounced value (after user stops typing)
    const validationError = useMemo(() => {
        if (!debouncedRegistrationId.trim()) {
            return '';
        }
        if (!validateFormat(debouncedRegistrationId)) {
            return 'Invalid format. Use: IMO-CONT-YYYY-XXXXXX';
        }
        return '';
    }, [debouncedRegistrationId]);

    // Check if form is valid
    const isFormValid = debouncedRegistrationId.trim() && validateFormat(debouncedRegistrationId) && !validationError;

    // Derive verification result - only show if data matches current request
    const verificationResult = useMemo(() => {
        if (!contractorData || !currentRequestId || contractorData.certificateId !== currentRequestId) {
            return null;
        }
        
        return {
            contractorName: contractorData.contractorName,
            registrationId: contractorData.certificateId,
            rcbnNumber: contractorData.rcBnNumber,
            grade: `Grade ${contractorData.grade.toUpperCase()}`,
            lga: contractorData.lga,
            status: contractorData.status.charAt(0).toUpperCase() + contractorData.status.slice(1),
            validUntil: new Date(contractorData.validUntil).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            category: contractorData.category || 'N/A',
        };
    }, [contractorData, currentRequestId]);

    // Show toast notifications based on API response
    useEffect(() => {
        if (contractorData && contractorData.certificateId === currentRequestId) {
            const status = contractorData.status.toLowerCase();
            if (status === 'approved') {
                toast.success('Certificate Verified', {
                    description: `${contractorData.contractorName} - Registration confirmed`,
                    duration: 3000,
                });
            } else if (status === 'pending') {
                toast.warning('Pending Verification', {
                    description: `${contractorData.contractorName} - Registration pending approval`,
                    duration: 3000,
                });
            } else if (status === 'suspended' || status === 'revoked') {
                toast.error('Suspended Contractor', {
                    description: `${contractorData.contractorName} - Registration suspended`,
                    duration: 3000,
                });
            }
        }
    }, [contractorData, currentRequestId]);
    
    // Handle API error
    useEffect(() => {
        if (error) {
            toast.error('Certificate Not Found', {
                description: 'No contractor found with this registration ID',
                duration: 3000,
            });
        }
    }, [error]);

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

        // Set current request ID - this will clear old results immediately
        setCurrentRequestId(debouncedRegistrationId.trim());
        
        // Trigger the API query
        getContractor(debouncedRegistrationId.trim());
    };

    return (
        <div className="max-w-xl mx-auto">
            <Card className="shadow-lg" gradient="bg-linear-to-r from-white/95 to-white/75">
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
                                placeholder="e.g., IMO-CONT-YYYY-XXXXXX"
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
                                    Supported format: <span className="font-mono">IMO-CONT-YYYY-XXXXXX</span>
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={!isFormValid || isLoading || isFetching}
                            className="w-full h-12 bg-theme-green hover:bg-theme-green/90 cursor-pointer active:scale-95 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {(isLoading || isFetching) ? (
                                <>
                                    <FaSpinner className="mr-2 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <FaSearch className="mr-2" />
                                    Verify Certificate
                                </>
                            )}
                        </Button>

                        {/* Info Alert */}
                        <Alert className="bg-linear-to-b from-transparent to-blue-50 border-blue-200">
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
                verificationResult ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 h-0 overflow-hidden'
            }`}>
                {verificationResult && (
                    <VerificationResult
                        contractorName={verificationResult.contractorName}
                        id={verificationResult.registrationId}
                        rcbnNumber={verificationResult.rcbnNumber}
                        grade={verificationResult.grade}
                        lga={verificationResult.lga}
                        status={verificationResult.status}
                        validUntil={verificationResult.validUntil}
                        category={verificationResult.category}
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
