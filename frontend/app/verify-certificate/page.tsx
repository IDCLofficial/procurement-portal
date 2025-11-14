import Header from '@/components/Header';
import VerificationForm from '@/components/VerificationForm';

export default function VerifyCertificatePage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            <Header
                title="Certificate Verification"
                description="Verify contractor registration status"
                hasBackButton
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <VerificationForm />
            </div>
        </div>
    );
}
