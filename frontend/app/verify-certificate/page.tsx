import Header from '@/components/Header';
import VerificationForm from '@/components/VerificationForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaSearch } from 'react-icons/fa';

export default function VerifyCertificatePage({ params }: { params: { locale: string } }) {
    const { locale } = params;
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            <Header
                title={"Certificate Verification" + " " + locale}
                description="Verify contractor registration status"
                hasBackButton

                rightButton={
                    <Link href="/directory">
                        <Button variant="outline" className="cursor-pointer active:scale-95 transition-transform duration-300 active:rotate-2">
                            <FaSearch className="h-4 w-4" />
                            <span>Search Directory</span>
                        </Button>
                    </Link>
                }
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <VerificationForm />
            </div>
        </div>
    );
}
