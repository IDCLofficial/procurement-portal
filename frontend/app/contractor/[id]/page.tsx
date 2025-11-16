import Header from '@/components/Header';
import ContractorDetails from '@/components/ContractorDetails';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaSearch } from 'react-icons/fa';
import { getContractorById, getAllContractorIds } from '@/lib/contractors';
import type { Metadata } from 'next';
import { FaQrcode } from 'react-icons/fa6';

// Generate static params for all contractors at build time
export async function generateStaticParams() {
    const ids = await getAllContractorIds();
    return ids.map((id) => ({ id }));
}

// Generate metadata for each contractor page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const contractor = await getContractorById(id);
    
    if (!contractor) {
        return {
            title: 'Contractor Not Found',
            description: 'The requested contractor could not be found',
        };
    }
    
    return {
        title: `${contractor.name} - Imo State Contractor Directory`,
        description: `View details for ${contractor.name}, a registered contractor in ${contractor.sector} sector with grade ${contractor.grade}. Registration ID: ${contractor.id}`,
        openGraph: {
            title: contractor.name,
            description: `${contractor.sector} contractor - Grade ${contractor.grade}`,
        },
    };
}

export default async function ContractorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // Fetch contractor data on the server
    const contractor = await getContractorById(id);

    if (!contractor) {
        return (
            <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
                <Header
                    title="Contractor Not Found"
                    description="The requested contractor could not be found"
                    hasBackButton
                />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">The contractor you are looking for does not exist.</p>
                        <Link href="/directory">
                            <Button>
                                <FaSearch className="h-4 w-4" />
                                <span>Back to Directory</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            <Header
                title="Public Contractor Directory"
                description="Search and verify approved contractors"
                hasBackButton
                rightButton={
                    <Link href="/verify-certificate">
                        <Button variant="outline" className="cursor-pointer active:scale-95 transition-transform duration-300">
                            <FaQrcode className="h-4 w-4" />
                            <span>Verify Certificate</span>
                        </Button>
                    </Link>
                }
            />

            <ContractorDetails contractor={contractor} />
        </div>
    );
}
