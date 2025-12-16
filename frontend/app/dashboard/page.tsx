'use client';

import DashboardHeader from '@/components/DashboardHeader';
import RegistrationStatusCard from '@/components/dashboard/RegistrationStatusCard';
import QuickActionsCard from '@/components/dashboard/QuickActionsCard';
import RenewalReminderCard from '@/components/dashboard/RenewalReminderCard';
import ComplianceDocumentsCard from '@/components/dashboard/ComplianceDocumentsCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/public-service/AuthProvider';
import { format, differenceInDays } from 'date-fns';
import { Loader2 } from 'lucide-react';
import PendingPaymentCard from '@/components/dashboard/PendingPaymentCard';
import { toast } from 'sonner';

export default function DashboardPage() {
    const { user, company, application, isLoading, categories } = useAuth();

    const router = useRouter();

    const handleDownloadCertificate = () => {
        console.log('Download certificate');
    };

    const handleUpdateProfile = () => {
        console.log('Update profile');
    };

    const handleStartRenewal = () => {
        router.push('/dashboard/renewal');
    };

    const handleReapply = () => {
        console.log('Reapply for registration');
        router.push('/dashboard/register');
    };

    const handleContactSupport = () => {
        console.log('Contact support');
        // Add support contact logic
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <DashboardHeader
                    companyName={company?.companyName || user?.fullname || 'Loading...'}
                    subtitle={"Vendor Portal"}
                />
                <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                        <p className="text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Transform company documents to compliance documents format
    const complianceDocuments = (company?.documents || []).map((doc) => {
        const docValidUntil = doc.validTo ? format(new Date(doc.validTo), 'dd MMM yyyy') : undefined;
        const daysUntilExpiry = doc.validTo ? differenceInDays(new Date(doc.validTo), new Date()) : null;
        const expiresText = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0 ? 'Expires soon' : undefined;

        return {
            id: doc._id,
            name: doc.documentType,
            validUntil: docValidUntil,
            expiresText,
            status: (doc.status.status).toLowerCase() === 'approved' ? 'verified' as const : 
                    (doc.status.status).toLowerCase() === 'rejected' ? 'expired' as const :  
                    doc.status.status,
        };
    });

    // Calculate registration details
    const registrationId = user?.certificateId || user?.certificateId || 'N/A';
    const validUntil = company?.createdAt ? format(new Date(new Date(company.createdAt).setFullYear(new Date(company.createdAt).getFullYear() + 1)), 'dd MMMM yyyy') : 'N/A';
    const daysRemaining = company?.createdAt ? differenceInDays(new Date(new Date(company.createdAt).setFullYear(new Date(company.createdAt).getFullYear() + 1)), new Date()) : 0;
    
    // Map application status to registration status
    const getRegistrationStatus = (): 'approved' | 'declined' | 'expired' | 'suspended' | 'pending' | 'verified' => {
        switch (application?.status) {
            case 'Approved':
                return 'approved';
            case 'Rejected':
                return 'declined';
            case 'SLA Breach':
                return 'suspended';
            case 'Verified':
                return 'verified';
            default:
                return 'pending';
        }
    };
    
    const registrationStatus = getRegistrationStatus();
    
    // Get decline/suspension reason from application notes if available
    const statusReason = application?.notes || undefined;

    const handlePayment = async () => {
        try {
            // TODO: Implement actual payment processing
            // This is a mock implementation
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success("Payment processed successfully!");
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Failed to process payment. Please try again.");
        }
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader
                companyName={company?.companyName || user?.fullname}
                subtitle={"Vendor Portal"}
            />

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Pending Payment */}
                        {categories && registrationStatus === 'approved' && <PendingPaymentCard
                            amount={categories?.grades.find((grade) => grade.grade.toLowerCase() === company?.grade.toLowerCase())?.registrationCost || 0} // Set your amount here
                            description="Registration Fee for Contractor Registration"
                            onPay={handlePayment}
                        />}
                        {/* Registration Status */}
                        {registrationStatus !== 'approved' && <RegistrationStatusCard
                            registrationId={registrationId}
                            validUntil={registrationStatus !== 'declined' ? validUntil : undefined}
                            daysRemaining={registrationStatus === 'verified' ? daysRemaining : undefined}
                            status={registrationStatus}
                            declineReason={registrationStatus === 'declined' ? statusReason : undefined}
                            suspensionReason={registrationStatus === 'suspended' ? statusReason : undefined}
                            onDownloadCertificate={registrationStatus === 'verified' ? handleDownloadCertificate : undefined}
                            onUpdateProfile={handleUpdateProfile}
                            onReapply={registrationStatus === 'declined' || registrationStatus === 'expired' ? handleReapply : undefined}
                            onContactSupport={registrationStatus === 'declined' || registrationStatus === 'suspended' ? handleContactSupport : undefined}
                        />}

                        {/* Renewal Reminder - Only show when approved and days remaining <= 30 */}
                        {registrationStatus === 'verified' && daysRemaining <= 30 && daysRemaining > 0 && (
                            <RenewalReminderCard
                                daysRemaining={daysRemaining}
                                onStartRenewal={handleStartRenewal}
                            />
                        )}

                        {/* Compliance Documents - Only show for approved, expired, and suspended */}
                        {(registrationStatus === 'pending' || registrationStatus === 'expired' || registrationStatus === 'suspended') && (
                            <ComplianceDocumentsCard
                                documents={complianceDocuments}
                            />
                        )}

                        {/* Recent Activity */}
                        <RecentActivityCard />
                    </div>

                    {/* Right Column - Quick Actions */}
                    <div className="lg:col-span-1">
                        <QuickActionsCard />
                    </div>
                </div>
            </div>
        </div>
    );
}
