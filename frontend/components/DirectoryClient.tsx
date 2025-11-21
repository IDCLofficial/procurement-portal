'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ContractorSearch, { SearchFilters } from '@/components/ContractorSearch';
import ContractorTable, { Contractor } from '@/components/ContractorTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface DirectoryClientProps {
    initialContractors: Contractor[];
}

export default function DirectoryClient({ initialContractors }: DirectoryClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isInitialState, setIsInitialState] = useState(false);

    // Check if in simulation mode
    const isSim = process.env.NEXT_PUBLIC_ENV === 'sim';

    // Derive filtered contractors from URL params using useMemo
    const filteredContractors = useMemo(() => {
        const query = searchParams.get('q') || '';
        const sector = searchParams.get('sector') || 'all';
        const grade = searchParams.get('grade') || 'all';
        const lga = searchParams.get('lga') || 'all';
        const status = searchParams.get('status') || 'active';

        let results = [...initialContractors];

        // Filter by search query
        if (query.trim()) {
            const queryLower = query.toLowerCase();
            results = results.filter(
                (c) =>
                    c.name.toLowerCase().includes(queryLower) ||
                    c.rcbnNumber.toLowerCase().includes(queryLower) ||
                    c.id.toLowerCase().includes(queryLower)
            );
        }

        // Filter by sector
        if (sector !== 'all') {
            results = results.filter((c) => c.sector.toLowerCase() === sector);
        }

        // Filter by grade
        if (grade !== 'all') {
            results = results.filter((c) => c.grade.toLowerCase() === grade);
        }

        // Filter by LGA
        if (lga !== 'all') {
            results = results.filter((c) => c.lga.toLowerCase().includes(lga.replace('-', ' ')));
        }

        // Filter by status
        if (status !== 'active') {
            results = results.filter((c) => c.status === status);
        }

        return results;
    }, [searchParams, initialContractors]);

    const handleSearch = (filters: SearchFilters) => {
        // Clear initial state when user searches
        if (isInitialState) {
            setIsInitialState(false);
        }

        // Update URL params
        const params = new URLSearchParams();
        if (filters.query) params.set('q', filters.query);
        if (filters.sector !== 'all') params.set('sector', filters.sector);
        if (filters.grade !== 'all') params.set('grade', filters.grade);
        if (filters.lga !== 'all') params.set('lga', filters.lga);
        if (filters.status !== 'active') params.set('status', filters.status);

        router.push(`/directory?${params.toString()}`, { scroll: false });
    };

    const handleExportCSV = () => {
        // Mock CSV export
        const csv = [
            ['S/N', 'Contractor Name', 'RC/BN Number', 'Registration ID', 'Sector', 'Grade', 'LGA', 'Status', 'Expiry Date'],
            ...filteredContractors.map((c, i) => [
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
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contractors.csv';
        a.click();
        window.URL.revokeObjectURL(url);

        toast.success('CSV exported successfully', {
            description: `${filteredContractors.length} contractors exported`,
            duration: 3000,
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* State Simulation Controls - Only in sim mode */}
            {isSim && (
                <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="pt-6">
                        <p className="text-sm font-semibold text-yellow-900 mb-3">🎭 State Simulation Controls</p>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setIsLoading(true);
                                    setError(null);
                                    setIsInitialState(false);
                                    setTimeout(() => setIsLoading(false), 3000);
                                }}
                                className="cursor-pointer active:scale-95 transition-transform duration-300"
                            >
                                Simulate Loading (3s)
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setIsLoading(false);
                                    setError('Failed to fetch contractors. Network connection error.');
                                    setIsInitialState(false);
                                }}
                                className="cursor-pointer active:scale-95 transition-transform duration-300"
                            >
                                Simulate Error
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setIsLoading(false);
                                    setError(null);
                                    setIsInitialState(true);
                                }}
                                className="cursor-pointer active:scale-95 transition-transform duration-300"
                            >
                                Simulate Initial Empty
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setIsLoading(false);
                                    setError(null);
                                    setIsInitialState(false);
                                    // Clear URL params to show no results
                                    router.push('/directory?q=XXXXXXXXX_NO_MATCH', { scroll: false });
                                }}
                                className="cursor-pointer active:scale-95 transition-transform duration-300"
                            >
                                Simulate Not Found
                            </Button>
                            <Button
                                size="sm"
                                variant="default"
                                onClick={() => {
                                    setIsLoading(false);
                                    setError(null);
                                    setIsInitialState(false);
                                    // Clear URL params to reset
                                    router.push('/directory', { scroll: false });
                                }}
                                className="bg-theme-green hover:bg-theme-green/90 cursor-pointer active:scale-95 transition-transform duration-300"
                            >
                                Reset to Normal
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <ContractorSearch onSearch={handleSearch} />
            <ContractorTable 
                contractors={filteredContractors} 
                onExportCSV={handleExportCSV}
                isLoading={isLoading}
                error={error}
                isInitialState={isInitialState}
            />
        </div>
    );
}
