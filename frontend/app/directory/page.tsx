import Header from '@/components/Header';
import DirectoryClient from '@/components/DirectoryClient';
import { FaQrcode } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Public Contractor Directory - Imo State',
    description: 'Search and verify approved contractors registered with the Imo State Bureau of Public Private Partnerships & Investments (BPPPI)',
    openGraph: {
        title: 'Public Contractor Directory',
        description: 'Search and verify approved contractors in Imo State',
    },
};

export default async function DirectoryPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            <Header
                title="Public Contractor Directory"
                description="Search and verify approved contractors"
                hasBackButton
                rightButton={
                    <Link href="/verify-certificate">
                        <Button variant="outline" className="cursor-pointer active:scale-95 transition-transform duration-300 active:rotate-2 max-sm:text-xs max-sm:px-3 max-sm:h-9">
                            <FaQrcode className="max-sm:h-3 max-sm:w-3 h-4 w-4" />
                            <span className="max-sm:hidden">Verify Certificate</span>
                            <span className="sm:hidden">Verify</span>
                        </Button>
                    </Link>
                }
            />

            <DirectoryClient />
        </div>
    );
}
