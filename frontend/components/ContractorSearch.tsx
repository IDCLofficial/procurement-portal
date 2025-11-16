'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaSearch } from 'react-icons/fa';

interface ContractorSearchProps {
    onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
    query: string;
    sector: string;
    grade: string;
    lga: string;
    status: string;
}

export default function ContractorSearch({ onSearch }: ContractorSearchProps) {
    const [filters, setFilters] = useState<SearchFilters>({
        query: '',
        sector: 'all',
        grade: 'all',
        lga: 'all',
        status: 'active',
    });

    const handleFilterChange = (key: keyof SearchFilters, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onSearch(newFilters);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Search Contractors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search by contractor name, RC/BN number, or registration ID..."
                        value={filters.query}
                        onChange={(e) => handleFilterChange('query', e.target.value)}
                        className="pl-10 h-12"
                    />
                </div>

                {/* Filter Dropdowns */}
                <div className="flex gap-4 flex-wrap">
                    {/* Sector */}
                    <div className="space-y-2 flex-1 min-w-64">
                        <label className="text-sm font-medium text-gray-700">Sector</label>
                        <Select value={filters.sector} onValueChange={(value) => handleFilterChange('sector', value)}>
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All Sectors" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sectors</SelectItem>
                                <SelectItem value="works">Works</SelectItem>
                                <SelectItem value="supplies">Supplies</SelectItem>
                                <SelectItem value="services">Services</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Grade */}
                    <div className="space-y-2 flex-1 min-w-64">
                        <label className="text-sm font-medium text-gray-700">Grade</label>
                        <Select value={filters.grade} onValueChange={(value) => handleFilterChange('grade', value)}>
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All Grades" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Grades</SelectItem>
                                <SelectItem value="a">Grade A</SelectItem>
                                <SelectItem value="b">Grade B</SelectItem>
                                <SelectItem value="c">Grade C</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* LGA */}
                    <div className="space-y-2 flex-1 min-w-64">
                        <label className="text-sm font-medium text-gray-700">LGA</label>
                        <Select value={filters.lga} onValueChange={(value) => handleFilterChange('lga', value)}>
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All LGAs" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All LGAs</SelectItem>
                                <SelectItem value="owerri-municipal">Owerri Municipal</SelectItem>
                                <SelectItem value="owerri-north">Owerri North</SelectItem>
                                <SelectItem value="owerri-west">Owerri West</SelectItem>
                                <SelectItem value="orlu">Orlu</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="space-y-2 flex-1 min-w-64">
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="Active" />
                            </SelectTrigger>
                            <SelectContent className='w-full'>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
