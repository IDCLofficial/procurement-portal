import Header from '@/components/Header';
import DirectoryClient from '@/components/DirectoryClient';
import { Contractor } from '@/components/ContractorTable';
import { FaQrcode } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock data
const mockContractors: Contractor[] = [
    {
        id: '1',
        name: 'ABC Construction Ltd',
        rcbnNumber: 'RC1234567',
        registrationId: 'IMO-CONT-2024-001',
        sector: 'WORKS',
        grade: 'A',
        lga: 'Owerri Municipal',
        status: 'approved',
        expiryDate: '31 Dec 2025',
    },
    {
        id: '2',
        name: 'XYZ Supplies Nigeria',
        rcbnNumber: 'RC7654321',
        registrationId: 'IMO-CONT-2024-002',
        sector: 'SUPPLIES',
        grade: 'B',
        lga: 'Orlu',
        status: 'approved',
        expiryDate: '30 Nov 2025',
    },
    {
        id: '3',
        name: 'Prime Services International',
        rcbnNumber: 'RC3456789',
        registrationId: 'IMO-CONT-2024-003',
        sector: 'SERVICES',
        grade: 'A',
        lga: 'Owerri North',
        status: 'approved',
        expiryDate: '15 Oct 2025',
    },
];

// Fetch contractors data (Server Component)
async function getContractors(): Promise<Contractor[]> {
    // In production, this would be an API call
    // For now, return mock data
    return mockContractors;
}

export default async function DirectoryPage() {
    // Fetch data on the server
    const contractors = await getContractors();

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            <Header
                title="Public Contractor Directory"
                description="Search and verify approved contractors"
                hasBackButton
                rightButton={
                    <Link href="/verify-certificate">
                        <Button variant="outline" className="cursor-pointer active:scale-95 transition-transform duration-300 active:rotate-2">
                            <FaQrcode className="h-4 w-4" />
                            <span>Verify Certificate</span>
                        </Button>
                    </Link>
                }
            />

            <DirectoryClient initialContractors={contractors} />
        </div>
    );
}
