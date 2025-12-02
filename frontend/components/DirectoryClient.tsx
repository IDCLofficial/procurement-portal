'use client';

import ContractorSearch from '@/components/ContractorSearch';
import ContractorTable from '@/components/ContractorTable';

export default function DirectoryClient() {
    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            <ContractorSearch />
            <ContractorTable />
        </div>
    );
}
