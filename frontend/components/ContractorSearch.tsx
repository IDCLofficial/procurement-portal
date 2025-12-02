'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaSearch } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCategoriesData } from '@/store/slices/categoriesSlice';
import { setSearchQuery, setSectorFilter, setGradeFilter, setLgaFilter, setStatusFilter, setCurrentPage } from '@/store/slices/publicSlice';
import { lgaObject } from '@/lib/constants.const';

export interface SearchFilters {
    query: string;
    sector: string;
    grade: string;
    lga: string;
    status: string;
}

export default function ContractorSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectCategoriesData);
    
    // Get Redux state for currentPage
    const { currentPage } = useAppSelector((state) => state.public);
    
    const [filters, setFilters] = useState<SearchFilters>({
        query: '',
        sector: 'all',
        grade: 'all',
        lga: 'all',
        status: 'all',
    });

    // Initialize Redux state from URL params on mount
    useEffect(() => {
        const query = searchParams.get('q') || '';
        const sector = searchParams.get('sector') || '';
        const grade = searchParams.get('grade') || '';
        const lga = searchParams.get('lga') || '';
        const status = searchParams.get('status') || '';
        const page = Number(searchParams.get('page')) || 1;

        if (query) dispatch(setSearchQuery(query));
        if (sector) dispatch(setSectorFilter(sector));
        if (grade) dispatch(setGradeFilter(grade));
        if (lga) dispatch(setLgaFilter(lga));
        if (status) dispatch(setStatusFilter(status));
        if (page !== currentPage) dispatch(setCurrentPage(page));
        
        // Update local state to match URL params
        setFilters({
            query: query,
            sector: sector || 'all',
            grade: grade || 'all',
            lga: lga || 'all',
            status: status || 'all',
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilterChange = (key: keyof SearchFilters, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        
        // Update Redux state
        if (key === 'query') dispatch(setSearchQuery(value));
        
        if (key === 'sector') {
            if (value !== 'all') dispatch(setSectorFilter(value));
            else dispatch(setSectorFilter(''));
        }
        
        if (key === 'grade') {
            if (value !== 'all') dispatch(setGradeFilter(value));
            else dispatch(setGradeFilter(''));
        }
        
        if (key === 'lga') {
            if (value !== 'all') dispatch(setLgaFilter(value));
            else dispatch(setLgaFilter(''));
        }
        
        if (key === 'status') {
            if (value !== 'all') dispatch(setStatusFilter(value));
            else dispatch(setStatusFilter(''));
        }
        
        // Update URL params
        const params = new URLSearchParams();
        if (newFilters.query) params.set('q', newFilters.query);
        if (newFilters.sector !== 'all') params.set('sector', newFilters.sector);
        if (newFilters.grade !== 'all') params.set('grade', newFilters.grade);
        if (newFilters.lga !== 'all') params.set('lga', newFilters.lga);
        if (newFilters.status !== 'all') params.set('status', newFilters.status);

        router.push(`/directory?${params.toString()}`, { scroll: false });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="sm:text-xl text-base">Search Contractors</CardTitle>
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
                    {categories && categories.categories && <div className="space-y-2 flex-1 min-w-64">
                        <label className="text-sm font-medium text-gray-700">Sector</label>
                        <Select value={filters.sector} onValueChange={(value) => handleFilterChange('sector', value)}>
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All Sectors" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sectors</SelectItem>
                                {categories.categories.map((category) => (
                                    <SelectItem className='capitalize' key={category._id} value={category.sector}>
                                        {category.sector}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>}

                    {/* Grade */}
                    {categories && categories.grades && <div className="space-y-2 flex-1 min-w-64">
                        <label className="text-sm font-medium text-gray-700">Grade</label>
                        <Select value={filters.grade} onValueChange={(value) => handleFilterChange('grade', value)}>
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All Grades" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Grades</SelectItem>
                                {categories.grades.map((grade) => (
                                    <SelectItem className='capitalize' key={grade._id} value={grade.grade}>
                                        Grade {grade.grade}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>}

                    {/* LGA */}
                    <div className="space-y-2 flex-1 min-w-64">
                        <label className="text-sm font-medium text-gray-700">LGA</label>
                        <Select value={filters.lga} onValueChange={(value) => handleFilterChange('lga', value)}>
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All LGAs" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All LGAs</SelectItem>
                                {lgaObject.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div className="space-y-2 flex-1 min-w-64">
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent className='w-full'>
                                <SelectItem value="all">All Status</SelectItem>
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
