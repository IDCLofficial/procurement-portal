'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaSearch } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCategoriesData } from '@/store/slices/categoriesSlice';
import { setSearchQuery, setSectorFilter, setGradeFilter, setStatusFilter, setCurrentPage, setMDAsFilter } from '@/store/slices/publicSlice';
import { useGetMDAQuery } from '@/store/api/helper.api';
import { Mda } from '@/app/admin/types/api';

export interface SearchFilters {
    query: string;
    sector: string;
    grade: string;
    mda: string;
    status: string;
}

export default function ContractorSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectCategoriesData);
    const viewFromMDA = searchParams.get('mda_sqiik');
    
    const { data: mdas } = useGetMDAQuery();

    const isValidMDAID: { valid: true; found: Mda } | { valid: false } = useMemo(() => {
        const idMaps = JSON.parse(process.env.NEXT_PUBLIC_ID_MAPS || '{}');
        if (!mdas) {
            return { valid: false };
        }
        if (!mdas.mdas || !Array.isArray(mdas.mdas)) {
            return { valid: false };
        }
        
        if (!viewFromMDA || !idMaps || typeof idMaps !== 'object') {
            return { valid: false };
        }
        

        if (!idMaps.hasOwnProperty(viewFromMDA)) {
            return { valid: false };
        }

        const mdaId = idMaps[viewFromMDA];
        const foundMDA = mdas.mdas.find((m) => m._id.toLowerCase() === mdaId.toLowerCase());

        if (!foundMDA) {
            return { valid: false };
        }


        return { valid: true, found: foundMDA };
    }, [viewFromMDA, mdas]);
    
    
    // Get Redux state for currentPage
    const { currentPage } = useAppSelector((state) => state.public);
    
    const [filters, setFilters] = useState<SearchFilters>({
        query: '',
        sector: 'all',
        grade: 'all',
        mda: 'all',
        status: 'all',
    });

    // Initialize Redux state from URL params on mount
    useEffect(() => {
        const query = searchParams.get('q') || '';
        const sector = searchParams.get('sector') || '';
        const grade = searchParams.get('grade') || '';
        const mda = isValidMDAID.valid ? isValidMDAID.found.name : (searchParams.get('mda') || '');
        const status = searchParams.get('status') || '';
        const page = Number(searchParams.get('page')) || 1;

        if (query) dispatch(setSearchQuery(query));
        if (sector) dispatch(setSectorFilter(sector));
        if (grade) dispatch(setGradeFilter(grade));
        if (mda) dispatch(setMDAsFilter(mda));
        if (status) dispatch(setStatusFilter(status));
        if (page !== currentPage) dispatch(setCurrentPage(page));
        
        // Update local state to match URL params
        setFilters({
            query: query,
            sector: sector || 'all',
            grade: grade || 'all',
            mda: isValidMDAID.valid ? isValidMDAID.found.name || 'all' : (mda || 'all'),
            status: status || 'all',
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isValidMDAID, isValidMDAID]);

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
        
        if (key === 'mda') {
            if (value !== 'all') dispatch(setMDAsFilter(value));
            else dispatch(setMDAsFilter(''));
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
        if (newFilters.mda !== 'all') params.set('mda', newFilters.mda);
        if (newFilters.status !== 'all') params.set('status', newFilters.status);

        router.push(`/directory?${params.toString()}`, { scroll: false });
    };

    return (
        <Card className='bg-white/90'>
            <CardHeader className="max-sm:p-4">
                <CardTitle className="sm:text-xl text-base">Search Contractors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 max-sm:p-4">
                {/* Search Input */}
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 max-sm:text-sm" />
                    <Input
                        type="text"
                        placeholder="Search by contractor name, CAC number..."
                        value={filters.query}
                        onChange={(e) => handleFilterChange('query', e.target.value)}
                        className="pl-10 max-sm:h-10 h-12 max-sm:text-sm"
                    />
                </div>

                {/* Filter Dropdowns */}
                <div className="grid max-sm:grid-cols-1 sm:flex gap-3 sm:gap-4 flex-wrap">
                    {/* Sector */}
                    {categories && categories.categories && <div className="space-y-2 flex-1 sm:min-w-64">
                        <label className="text-sm font-medium text-gray-700 max-sm:text-xs">Sector</label>
                        <Select value={filters.sector} onValueChange={(value) => handleFilterChange('sector', value)}>
                            <SelectTrigger className="max-sm:h-10 h-10 w-full max-sm:text-sm">
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
                    {categories && categories.grades && <div className="space-y-2 flex-1 sm:min-w-64">
                        <label className="text-sm font-medium text-gray-700 max-sm:text-xs">Grade</label>
                        <Select value={filters.grade} onValueChange={(value) => handleFilterChange('grade', value)}>
                            <SelectTrigger className="max-sm:h-10 h-10 w-full max-sm:text-sm">
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
                    {mdas && mdas.mdas && <div className="space-y-2 flex-1 sm:min-w-64">
                        <label className="text-sm font-medium text-gray-700 max-sm:text-xs"><abbr title="Ministries, Departments, and Agencies (government bodies)">MDA/MDAs</abbr></label>
                        <Select value={filters.mda} defaultValue={isValidMDAID.valid ? isValidMDAID.found.name : ''} onValueChange={(value) => handleFilterChange('mda', value)}>
                            <SelectTrigger className="max-sm:h-10 h-10 w-full max-sm:text-sm">
                                <SelectValue placeholder="All MDA/MDAs" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All MDA/MDAs</SelectItem>
                                {mdas.mdas.map((option) => (
                                    <SelectItem key={option._id} value={option.name}>
                                        {option.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>}

                    {/* Status */}
                    <div className="space-y-2 flex-1 sm:min-w-64">
                        <label className="text-sm font-medium text-gray-700 max-sm:text-xs">Status</label>
                        <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                            <SelectTrigger className="max-sm:h-10 h-10 w-full max-sm:text-sm">
                                <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent className='w-full'>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="approved">Active</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                                <SelectItem value="revoked">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
