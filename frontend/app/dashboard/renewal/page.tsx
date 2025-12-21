'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import StepIndicator from '@/components/renewal/StepIndicator';
import Step1ReviewInformation from '@/components/renewal/Step1ReviewInformation';
import Step2UpdateDocuments from '@/components/renewal/Step2UpdateDocuments';
import Step3Payment from '@/components/renewal/Step3Payment';
import DocumentsRequiringUpdateSection, { DocumentRenewal } from '@/components/renewal/DocumentsRequiringUpdateSection';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { FaCreditCard } from 'react-icons/fa6';
import SubHeader from '@/components/SubHeader';
import { useAuth } from '@/components/providers/public-service/AuthProvider';
import { formatDate } from 'date-fns';
import CertificateStillValid from '@/components/renewal/CertificateStillValid';
import AllDocumentsUpToDate from '@/components/renewal/AllDocumentsUpToDate';
import { PaymentType } from '@/store/api/enum';
import { toast } from 'sonner';
import { useInitPaymentMutation } from '@/store/api/vendor.api';
import { return_url_key } from '@/lib/constants';
import { Loader2 } from 'lucide-react';

export default function RegistrationRenewalPage() {
    const { company, user, application, documents, categories: categoriesPreset, certificate } = useAuth();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [initPayment, { isLoading: isInitPaymentLoading }] = useInitPaymentMutation()

    const missingDocuments: DocumentRenewal[] = useMemo(() => {
        if (!documents || documents.length === 0) return [];

        const uploadedDocTypes = new Set(
            (company?.documents || []).map(doc => doc.documentType.toLowerCase().trim())
        );

        return documents
            .filter(preset => preset.isRequired)
            .filter(preset => !uploadedDocTypes.has(preset.documentName.toLowerCase().trim()))
            .map(preset => ({
                id: `missing-${preset.documentName}`,
                documentName: preset.documentName,
                isRequired: preset.isRequired,
                hasExpiry: preset.hasExpiry,
                renewalFrequency: preset.renewalFrequency,
                currentExpiry: "",
                status: 'missing',
            }));
    }, [documents, company?.documents]);

    if (!company || !user || !application || !documents || !certificate) return null;

    const getStepStatus = (stepNumber: number): 'completed' | 'active' | 'pending' => {
        if (stepNumber < currentStep) return 'completed';
        if (stepNumber === currentStep) return 'active';
        return 'pending';
    };

    const steps = [
        {
            number: 1,
            title: 'Review Information',
            subtitle: 'Current status',
            status: getStepStatus(1),
        },
        {
            number: 2,
            title: 'Update Documents',
            subtitle: 'Upload renewed certificate',
            status: getStepStatus(2),
        },
        {
            number: 3,
            title: 'Payment',
            subtitle: 'Process renewal fee',
            status: getStepStatus(3),
        },
    ];

    const categories = company.category;
    const grade = company.grade.toUpperCase();
    const renewalFee = categoriesPreset?.grades.find((i) => String(i.grade.toLowerCase().trim()) === grade.toLowerCase().trim())?.renewalFee?.toString() || "";

    const verificationItems = [
        { label: 'CAC Number', value: company.cacNumber },
        { label: 'TIN', value: company.tin },
    ];

    const documentsRequiringUpdate: DocumentRenewal[] = company.documents
        ? company.documents
            .filter((doc) => {
                if (!doc.hasValidityPeriod) return false;

                const exp_date = new Date(doc.validTo!);
                const today = new Date();
                const diff = exp_date.getTime() - today.getTime();
                const daysUntilExpiry = Math.floor(diff / (1000 * 60 * 60 * 24));

                // Only include if expiring within 30 days or already expired
                return daysUntilExpiry <= 30;
            })
            .map((doc) => {
                const exp_date = new Date(doc.validTo!);
                const today = new Date();
                const diff = exp_date.getTime() - today.getTime();
                const daysUntilExpiry = Math.floor(diff / (1000 * 60 * 60 * 24));

                return {
                    currentExpiry: doc.validTo,
                    status: daysUntilExpiry >= 0 && daysUntilExpiry <= 30
                        ? "expiring_soon"
                        : "expired",
                    id: doc._id,
                    documentName: doc.documentType,
                    isRequired: true,
                    hasExpiry: "yes",
                    renewalFrequency: "annual",
                };
            })
        : [];

    const requiredUploads = [...documentsRequiringUpdate, ...missingDocuments]

    const handleUpdateCompanyInfo = () => {
        router.push('/dashboard/profile');
    };

    const handleContinue = () => {
        if (documentsRequiringUpdate.length === 0) {
            setCurrentStep(3);
            return;
        };
        setCurrentStep(2);
    };

    const handlePayment = async () => {
        if (!company) return;

        const payload = {
            amount: Number(renewalFee),
            type: PaymentType.RENEWAL,
            description: `${company.companyName}'s registration fee`,
        }

        try {
            toast.loading('Initializing payment...', { id: "payment" });
            const response = await initPayment(payload);
            toast.dismiss("payment");
            localStorage.setItem(return_url_key, "/dashboard");
            if (response.data) {
                router.push(response.data.authorization_url);
            }
        } catch (error) {
            toast.dismiss("payment");
            console.error(error);
            toast.error((error as Error).message || 'Failed to initialize payment');
            throw new Error((error as Error).message || 'Failed to initialize payment');
        }
    };

    const summaryItems = [
        {
            label: 'Current Expiry',
            value: `${formatDate(certificate.validUntil, 'dd MMMM yyyy')}`
        },
        {
            label: 'Renewal Period',
            value: `${formatDate((new Date(certificate.validUntil).setFullYear(new Date(certificate.validUntil).getFullYear() + 1)), 'dd MMMM yyyy')}`
        },
        { label: 'Documents Updated', value: `${documentsRequiringUpdate.length} of ${documents.length || 0}` },
        { label: 'Processing Time', value: '3-5 business days' },
    ];

    const timeLeft = Math.floor((new Date(certificate.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    function renderContent() {
        if (!company || !user || !application || !documents || !certificate) return null;

        if (timeLeft > 30 || application.status !== "Approved") {
            return <CertificateStillValid status={application.status} validUntil={certificate?.validUntil || ""} />
        }
        return (
            <>
                <StepIndicator steps={steps} />

                <div className="container mx-auto px-4 py-6 max-w-4xl">
                    {/* Step 1: Review Information */}
                    {currentStep === 1 && (
                        <>
                            <Step1ReviewInformation
                                registrationId={user.certificateId}
                                companyName={company.companyName}
                                currentExpiryDate={formatDate(certificate.validUntil, 'dd MMMM yyyy')}
                                newExpiryDate={formatDate((new Date(certificate.validUntil).setFullYear(new Date(certificate.validUntil).getFullYear() + 1)), 'dd MMMM yyyy')}
                                categories={categories}
                                grade={grade}
                                verificationItems={verificationItems}
                                onUpdateCompanyInfo={handleUpdateCompanyInfo}
                            />

                            {/* Documents Requiring Update */}
                            {!!requiredUploads.length && <div className="mt-6">
                                <DocumentsRequiringUpdateSection documents={requiredUploads} />
                            </div>}

                            {/* Continue Button */}
                            <div className="flex justify-end mt-6">
                                <Button
                                    className="bg-teal-700 hover:bg-teal-800 text-white px-8"
                                    onClick={handleContinue}
                                >
                                    Continue to Update Documents
                                    <FaArrowRight className="ml-2 text-sm" />
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Step 2: Update Documents */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            {requiredUploads.length > 0 ? (
                                <Step2UpdateDocuments setCurrentStep={setCurrentStep} documents={requiredUploads} />
                            ) : (
                                <>
                                    <AllDocumentsUpToDate />
                                    <div className="flex justify-between mt-6">
                                        <Button
                                            variant="outline"
                                            className='cursor-pointer'
                                            onClick={() => setCurrentStep(1)}
                                        >
                                            <FaArrowLeft className="mr-2 text-sm" />
                                            Previous
                                        </Button>
                                        {<Button
                                            className="bg-teal-700 hover:bg-teal-800 text-white px-8"
                                            onClick={() => setCurrentStep(3)}
                                        >
                                            Continue to Payment
                                            <FaArrowRight className="ml-2 text-sm" />
                                        </Button>}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Step 3: Payment */}
                    {currentStep === 3 && (
                        <>
                            <Step3Payment
                                amount={renewalFee}
                                categories={[categories, grade]}
                                summaryItems={summaryItems}
                                onPayment={handlePayment}
                            />

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-6">
                                <Button
                                    variant="outline"
                                    className='cursor-pointer'
                                    onClick={() => setCurrentStep(2)}
                                >
                                    <FaArrowLeft className="mr-2 text-sm" />
                                    Previous
                                </Button>
                                <Button
                                    className="bg-teal-700 hover:bg-teal-800 text-white px-8"
                                    onClick={handlePayment}
                                    disabled={isInitPaymentLoading}
                                >
                                    {isInitPaymentLoading ? (
                                        <>
                                            <Loader2 className="mr-2 text-sm animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FaCreditCard className="mr-2 text-sm" />
                                            Pay ₦{renewalFee}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <SubHeader
                title='Registration Renewal'
                hasBackButton
            />

            {renderContent()}
        </div>
    );
}


const Loader = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <SubHeader
                title='Registration Renewal'
                hasBackButton
            />
            <div className="flex justify-center items-center h-full">
                <Loader />
            </div>
        </div>
    );
}