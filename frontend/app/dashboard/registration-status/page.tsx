'use client';

import { FaSync, FaExclamationCircle } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SubHeader from '@/components/SubHeader';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import StatusBanner from '@/components/registration-status/StatusBanner';
import DocumentVerificationCard from '@/components/registration-status/DocumentVerificationCard';
import ApplicationTimeline from '@/components/registration-status/ApplicationTimeline';
import ApplicationDetailsCard from '@/components/registration-status/ApplicationDetailsCard';
import { WhatHappensNextCard, NeedHelpCard } from '@/components/registration-status/HelpCards';
import { useAuth } from '@/components/providers/public-service/AuthProvider';
import { useGetApplicationTimelineQuery } from '@/store/api/vendor.api';

export default function RegistrationStatusPage() {
    const { user: profile, company, application, isLoading, refresh } = useAuth();
    const { data: timelineData, isLoading: timelineLoading, refetch } = useGetApplicationTimelineQuery()

    const handleRefresh = () => {
        refresh();
        refetch();
    };

    if (isLoading || timelineLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <SubHeader title='Registration Status' hasBackButton />
                <div className="container mx-auto px-4 py-6 flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                        <p className="text-gray-600">Loading registration status...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isLoading && (!profile || !company)) {
        return (
            <div className="min-h-screen bg-gray-50">
                <SubHeader title='Registration Status' hasBackButton />
                <div className="container mx-auto px-4 py-6">
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-6 text-center">
                            <FaExclamationCircle className="text-red-600 text-4xl mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Data</h3>
                            <p className="text-sm text-red-700">Please try refreshing the page.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    const submittedDate = company?.createdAt ? format(new Date(company.createdAt), 'dd MMMM yyyy') : 'N/A';
    const documents = company?.documents || [];

    // Calculate progress based on documents and application status
    const calculateProgress = () => {
        if (!documents.length) return 0;
        
        const approvedDocs = documents.filter(doc => (doc.status.status).toLowerCase() === 'approved').length;
        const totalDocs = documents.length;
        const docProgress = (approvedDocs / totalDocs) * 80; // Documents account for 80% of progress
        
        // If all documents are approved and application is approved, 100%
        if (approvedDocs === totalDocs && application?.status === 'Approved') {
            return 100;
        }
        
        // Add application status weight (20%)
        const statusWeight = application?.status === 'Approved' ? 20 : 
                           application?.status === 'Forwarded to Registrar' ? 15 :
                           application?.status === 'Pending Desk Review' ? 10 : 0;
        
        return Math.min(Math.round(docProgress + statusWeight), 95); // Cap at 95% until fully approved
    };

    const reviewProgress = calculateProgress();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <SubHeader
                title='Registration Status'
                hasBackButton
                rightButton={
                    <Button variant="outline" className='group' size="sm" onClick={handleRefresh}>
                        <FaSync className="mr-2 group-active:rotate-90 transition-transform duration-300 origin-center" />
                        Refresh Status
                    </Button>
                }
            />

            <div className="container mx-auto px-4 py-6">
                <StatusBanner 
                    submittedDate={submittedDate} 
                    reviewProgress={reviewProgress}
                    applicationStatus={(application?.status)?.includes("pending") ? "Pending" : application?.status || 'Pending'}
                />

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <DocumentVerificationCard documents={documents} />
                        <ApplicationTimeline timeline={timelineData || []} />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <ApplicationDetailsCard 
                            companyName={company?.companyName || ""}
                            submittedDate={submittedDate}
                            status={(application?.status)?.includes("pending") ? "Pending" : application?.status || 'Pending'}
                        />
                        <WhatHappensNextCard />
                        <NeedHelpCard />
                    </div>
                </div>
            </div>
        </div>
    );
}
