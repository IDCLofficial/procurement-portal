'use client';

import ContractorSearch from '@/components/ContractorSearch';
import ContractorTable from '@/components/ContractorTable';

export default function DirectoryClient() {
    return (
        <>
            <div className="container mx-auto max-sm:px-3 px-4">
                <div className="fixed top-0 right-0 w-full h-full pointer-events-none">
                    <div className="blob absolute -right-64 -bottom-64 pointer-events-none scale-x-[-1] opacity-25" />
                    <div className="blob absolute -left-96 -top-96 pointer-events-none scale-x-[-1] opacity-5" />
                </div>
                <div className="relative z-10 max-sm:py-4 py-8 space-y-4 sm:space-y-6">
                    <ContractorSearch />
                    <ContractorTable />
                </div>
            </div>
        </>
    );
}
