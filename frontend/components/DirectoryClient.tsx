'use client';

import ContractorSearch from '@/components/ContractorSearch';
import ContractorTable from '@/components/ContractorTable';

export default function DirectoryClient() {
    return (
        <div className="container mx-auto max-sm:px-3 px-4 max-sm:py-4 py-8 space-y-4 sm:space-y-6">
            <ContractorSearch />
            <ContractorTable />
        </div>
    );
}
