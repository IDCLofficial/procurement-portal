import Header from '@/components/Header';
import VerificationForm from '@/components/VerificationForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaSearch } from 'react-icons/fa';

export default function VerifyCertificatePage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            <Header
                title={"Certificate Verification"}
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
            <div className="fixed top-0 right-0 w-full h-full pointer-events-none">
                <div className="blob absolute -right-64 -bottom-64 pointer-events-none scale-x-[-1] opacity-25" />
                <div className="blob absolute -left-96 -top-96 pointer-events-none scale-x-[-1] opacity-5" />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 relative z-10">
                <VerificationForm />
            </div>
        </div>
    );
}
