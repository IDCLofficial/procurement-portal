'use client';

import { useState } from 'react';
import type { DocumentRequirement } from '@/types/registration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaUser, FaCheckCircle, FaBuilding, FaUsers, FaUniversity, FaFileAlt, FaMoneyBill, FaCreditCard, FaReceipt } from 'react-icons/fa';
import { toast } from 'sonner';
import Step2CompanyDetails from '@/components/registration-steps/Step2CompanyDetails';
import Step3Directors from '@/components/registration-steps/Step3Directors';
import Step4BankDetails from '@/components/registration-steps/Step4BankDetails';
import Step5Documents from '@/components/registration-steps/Step5Documents';
import Step6CategoryGrade from '@/components/registration-steps/Step6CategoryGrade';
import Step7PaymentSummary from '@/components/registration-steps/Step7PaymentSummary';
import Step8ConfirmPayment from '@/components/registration-steps/Step8ConfirmPayment';
import Step9Receipt from '@/components/registration-steps/Step9Receipt';
import StepPlaceholder from '@/components/registration-steps/StepPlaceholder';
import { FaTag } from 'react-icons/fa6';

const steps = [
    { id: 1, name: 'Create Account', icon: FaUser, description: 'Verify Contact', completed: true },
    { id: 2, name: 'Company Details', icon: FaBuilding, description: 'Company Details', completed: false },
    { id: 3, name: 'Directors', icon: FaUsers, description: 'Directors', completed: false },
    { id: 4, name: 'Bank Details', icon: FaUniversity, description: 'Bank Details', completed: false },
    { id: 5, name: 'Documents', icon: FaFileAlt, description: 'Documents', completed: false },
    { id: 6, name: 'Category & Grade', icon: FaTag, description: 'Category & Grade', completed: false },
    { id: 7, name: 'Payment Summary', icon: FaMoneyBill, description: 'Payment Summary', completed: false },
    { id: 8, name: 'Confirm Payment', icon: FaCreditCard, description: 'Confirm Payment', completed: false },
    { id: 9, name: 'Receipt', icon: FaReceipt, description: 'Receipt', completed: false },
];


export default function RegistrationContinuation() {
    const [currentStep, setCurrentStep] = useState(2); // Start from step 2
    const [formData, setFormData] = useState({
        // Step 2: Company Details
        companyName: '',
        cacNumber: '',
        tinNumber: '',
        address: '',
        lga: '',
        website: '',
    });

    // Step 3: Directors
    const [directors, setDirectors] = useState([
        {
            id: '1',
            fullName: '',
            phone: '',
            email: '',
            documentType: '',
            documentValue: '',
        }
    ]);

    // Step 4: Bank Details (Optional)
    const [bankDetails, setBankDetails] = useState({
        bankName: '',
        accountNumber: '',
        accountName: '',
    });

    // Step 6: Category & Grade
    const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
    const [selectedGrade, setSelectedGrade] = useState<string>('');

    // Step 5: Documents (Mock data - will come from API)
    const [documents, setDocuments] = useState<DocumentRequirement[]>([
        {
            id: 'cac',
            name: 'CAC Incorporation Certificate',
            required: true,
            hasValidityPeriod: false,
            uploaded: false,
            validFrom: '',
            validTo: '',
        },
        {
            id: 'tcc',
            name: 'Tax Clearance Certificate (TCC)',
            required: true,
            validFor: '1 year',
            hasValidityPeriod: true,
            uploaded: false,
            validFrom: '',
            validTo: '',
        },
        {
            id: 'pencom',
            name: 'PENCOM Compliance Certificate',
            required: true,
            validFor: '1 year',
            hasValidityPeriod: true,
            uploaded: false,
            validFrom: '',
            validTo: '',
        },
        {
            id: 'itf',
            name: 'ITF Certificate',
            required: true,
            validFor: '1 year',
            hasValidityPeriod: true,
            uploaded: false,
            validFrom: '',
            validTo: '',
        },
        {
            id: 'nsitf',
            name: 'NSITF Certificate',
            required: true,
            validFor: '1 year',
            hasValidityPeriod: true,
            uploaded: false,
            validFrom: '',
            validTo: '',
        },
        {
            id: 'sworn-affidavit',
            name: 'Sworn Affidavit of Authenticity',
            required: true,
            hasValidityPeriod: false,
            uploaded: false,
            validFrom: '',
            validTo: '',
        },
        {
            id: 'bank-reference',
            name: 'Bank Reference Letter',
            required: false,
            hasValidityPeriod: false,
            uploaded: false,
            validFrom: '',
            validTo: '',
        },
        {
            id: 'past-projects',
            name: 'Past Project References',
            required: false,
            hasValidityPeriod: false,
            uploaded: false,
            validFrom: '',
            validTo: '',
        },
    ]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleBankDetailsChange = (field: string, value: string) => {
        setBankDetails(prev => ({ ...prev, [field]: value }));
    };

    // Get registration fee based on selected grade
    const getRegistrationFee = () => {
        const fees: Record<string, number> = {
            a: 150000,
            b: 100000,
            c: 70000,
            d: 40000,
        };
        return fees[selectedGrade] || 0;
    };

    // Auto-fill helper for simulation mode
    const autoFillCurrentStep = () => {
        if (currentStep === 2) {
            setFormData({
                companyName: 'ABC Construction Limited',
                cacNumber: 'RC123456',
                tinNumber: '12345678-0001',
                address: '123 Main Street, Victoria Island',
                lga: 'Lagos Island',
                website: 'https://www.abcconstruction.com',
            });
            toast.success('Step 2 auto-filled');
        } else if (currentStep === 3) {
            setDirectors([
                {
                    id: '1',
                    fullName: 'John Doe',
                    phone: '08012345678',
                    email: 'john.doe@example.com',
                    documentType: 'NIN',
                    documentValue: '12345678901',
                },
                {
                    id: '2',
                    fullName: 'Jane Smith',
                    phone: '08087654321',
                    email: 'jane.smith@example.com',
                    documentType: 'BVN',
                    documentValue: '22334455667',
                },
            ]);
            toast.success('Step 3 auto-filled');
        } else if (currentStep === 4) {
            setBankDetails({
                bankName: 'First Bank of Nigeria',
                accountNumber: '1234567890',
                accountName: 'ABC Construction Limited',
            });
            toast.success('Step 4 auto-filled');
        } else if (currentStep === 5) {
            // Mark all documents as uploaded
            const autoFilledDocs = documents.map(doc => ({
                ...doc,
                uploaded: true,
                fileName: `${doc.id}_sample.pdf`,
                fileSize: '245.67 KB',
                uploadedDate: new Date().toISOString().split('T')[0],
                fileType: 'application/pdf',
                validFrom: doc.hasValidityPeriod ? '2024-01-01' : '',
                validTo: doc.hasValidityPeriod ? '2025-01-01' : '',
            }));
            setDocuments(autoFilledDocs);
            toast.success('Step 5 auto-filled - All documents marked as uploaded');
        } else if (currentStep === 6) {
            setSelectedSectors(['services', 'supplies']);
            setSelectedGrade('b');
            toast.success('Step 6 auto-filled');
        } else {
            toast.info('No auto-fill available for this step');
        }
    };

    const handleContinue = async () => {
        // Validate current step
        if (currentStep === 2) {
            if (!formData.companyName || !formData.cacNumber || !formData.tinNumber || !formData.address || !formData.lga) {
                toast.error('Please fill in all required fields');
                return;
            }
        }

        if (currentStep === 3) {
            // Validate all directors have required fields
            const hasEmptyFields = directors.some(
                d => !d.fullName || !d.phone || !d.email || !d.documentType || !d.documentValue
            );
            if (hasEmptyFields) {
                toast.error('Please fill in all director information');
                return;
            }
        }

        if (currentStep === 5) {
            // Validate all required documents are uploaded
            const requiredDocs = documents.filter(d => d.required);
            const missingDocs = requiredDocs.filter(d => !d.uploaded);
            if (missingDocs.length > 0) {
                toast.error('Please upload all required documents');
                return;
            }
            
            // Validate validity periods for uploaded documents
            const docsWithValidity = documents.filter(d => d.uploaded && d.hasValidityPeriod);
            const missingValidity = docsWithValidity.filter(d => !d.validFrom || !d.validTo);
            if (missingValidity.length > 0) {
                toast.error('Please provide validity dates for all applicable documents');
                return;
            }
        }

        if (currentStep === 6) {
            // Validate sectors and grade selection
            if (selectedSectors.length === 0) {
                toast.error('Please select at least one sector');
                return;
            }
            if (!selectedGrade) {
                toast.error('Please select a grade');
                return;
            }
        }

        // For other steps, just move to next step
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
            toast.success('Progress saved');
        } else {
            toast.success('Registration completed!');
            // TODO: Submit final registration
        }
    };

    const handleBack = () => {
        if (currentStep > 2) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 2:
                return (
                    <Step2CompanyDetails
                        formData={{
                            companyName: formData.companyName,
                            cacNumber: formData.cacNumber,
                            tinNumber: formData.tinNumber,
                            address: formData.address,
                            lga: formData.lga,
                            website: formData.website,
                        }}
                        onInputChange={handleInputChange}
                    />
                );
            
            case 3:
                return (
                    <Step3Directors
                        directors={directors}
                        onDirectorsChange={setDirectors}
                    />
                );
            
            case 4:
                return (
                    <Step4BankDetails
                        formData={bankDetails}
                        onInputChange={handleBankDetailsChange}
                    />
                );
            
            case 5:
                return (
                    <Step5Documents
                        documents={documents}
                        onDocumentsChange={setDocuments}
                    />
                );
            
            case 6:
                return (
                    <Step6CategoryGrade
                        selectedSectors={selectedSectors}
                        selectedGrade={selectedGrade}
                        onSectorsChange={setSelectedSectors}
                        onGradeChange={setSelectedGrade}
                    />
                );
            
            case 7:
                return (
                    <Step7PaymentSummary
                        companyName={formData.companyName}
                        cacNumber={formData.cacNumber}
                        selectedSectors={selectedSectors}
                        selectedGrade={selectedGrade}
                        registrationFee={getRegistrationFee()}
                    />
                );
            
            case 8:
                return (
                    <Step8ConfirmPayment
                        companyName={formData.companyName}
                        email={directors[0]?.email || ''}
                        phone={directors[0]?.phone || ''}
                        totalAmount={getRegistrationFee() + 5000 + 2500}
                    />
                );
            
            case 9:
                return (
                    <Step9Receipt
                        transactionRef="TXN-1763132230729-YAR1NN5L9"
                        dateTime={new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        paymentMethod="Paystack"
                        companyName={formData.companyName}
                        cacNumber={formData.cacNumber}
                        contactPerson={directors[0]?.fullName || ''}
                        email={directors[0]?.email || ''}
                        registrationFee={getRegistrationFee()}
                        processingFee={5000}
                        certificateFee={2500}
                        selectedGrade={selectedGrade}
                    />
                );
            
            default:
                return (
                    <StepPlaceholder 
                        stepNumber={currentStep} 
                        stepName={steps[currentStep - 1].name}
                    />
                );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Progress Steps */}
                <div className="mb-8">
                    {/* Desktop/Tablet View - Horizontal Steps */}
                    <div className="hidden md:block">
                        <div className="relative">
                            {/* Background Line */}
                            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200" style={{ zIndex: 0 }} />
                            
                            {/* Progress Line */}
                            <div 
                                className="absolute top-6 left-0 h-0.5 bg-theme-green transition-all duration-500" 
                                style={{ 
                                    width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                                    zIndex: 1 
                                }} 
                            />

                            {/* Steps */}
                            <div className="relative flex justify-between w-[102%] left-[-1.5%]" style={{ zIndex: 2 }}>
                                {steps.map((step) => (
                                    <div key={step.id} className="flex flex-col items-center">
                                        <div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-4 ${
                                                currentStep > step.id
                                                    ? 'border-theme-green bg-theme-green'
                                                    : currentStep === step.id
                                                    ? 'border-theme-green shadow-lg shadow-green-200 bg-white'
                                                    : 'border-gray-300 bg-gray-50'
                                            }`}
                                        >
                                            {currentStep > step.id ? (
                                                <FaCheckCircle className="text-white text-xl" />
                                            ) : (
                                                <step.icon className={`text-lg ${
                                                    currentStep === step.id ? 'text-theme-green' : 'text-gray-400'
                                                }`} />
                                            )}
                                        </div>
                                        <p className={`text-xs mt-3 text-center font-medium max-w-[90px] leading-tight ${
                                            currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
                                        }`}>
                                            {step.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile View - Compact Progress */}
                    <div className="md:hidden">
                        {/* Current Step Card */}
                        <div className="bg-white border-2 border-theme-green rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-theme-green flex items-center justify-center shrink-0 shadow-lg">
                                    {(() => {
                                        const StepIcon = steps[currentStep - 1].icon;
                                        return <StepIcon className="text-white text-2xl" />;
                                    })()}
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-600 font-medium">Step {currentStep} of {steps.length}</p>
                                    <h3 className="text-lg font-bold text-gray-900">{steps[currentStep - 1].name}</h3>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative">
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-theme-green h-2 rounded-full transition-all duration-500 relative"
                                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                                >
                                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30 animate-pulse" />
                                </div>
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-xs text-gray-600 font-medium">{currentStep}/{steps.length} Complete</span>
                                <span className="text-xs text-theme-green font-semibold">{Math.round((currentStep / steps.length) * 100)}%</span>
                            </div>
                        </div>

                        {/* Mini Steps Preview */}
                        <div className="flex gap-1 mt-4 overflow-x-auto pb-2">
                            {steps.map((step) => (
                                <div
                                    key={step.id}
                                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                        currentStep > step.id
                                            ? 'bg-theme-green text-white'
                                            : currentStep === step.id
                                            ? 'bg-theme-green text-white ring-2 ring-green-200'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                                >
                                    {currentStep > step.id ? '✓' : step.id}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            {steps[currentStep - 1].name}
                        </CardTitle>
                        <CardDescription>
                            {currentStep === 2
                                ? 'Provide your company registration details'
                                : currentStep === 3
                                ? 'Add information for all company directors'
                                : currentStep === 4
                                ? 'Add bank information for future transactions'
                                : currentStep === 5
                                ? 'Upload all required certificates and documents (PDF, PNG, or JPEG format)'
                                : currentStep === 6
                                ? 'Choose your sectors and classification grade'
                                : currentStep === 7
                                ? 'Review your registration details and fees'
                                : currentStep === 8
                                ? 'Please review and confirm your payment details'
                                : currentStep === 9
                                ? 'Your payment receipt and next steps'
                                : `Complete step ${currentStep} of your registration`
                            }
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Auto-fill Helper (Simulation Mode Only) */}
                        {process.env.NEXT_PUBLIC_ENV === 'sim' && currentStep >= 2 && currentStep <= 6 && (
                            <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-600 text-lg">⚡</span>
                                        <div>
                                            <p className="text-sm font-semibold text-yellow-900">
                                                Simulation Mode - Quick Fill
                                            </p>
                                            <p className="text-xs text-yellow-700">
                                                Auto-fill this step with sample data
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={autoFillCurrentStep}
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                        size="sm"
                                    >
                                        Fill Step {currentStep}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {renderStepContent()}

                        {/* Navigation Buttons - Hide on receipt page */}
                        {currentStep !== 9 && (
                        <div className="flex justify-between mt-8 pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 2}
                                className="min-w-[100px]"
                            >
                                {currentStep === 8 ? 'Back to Summary' : 'Back'}
                            </Button>
                            <Button
                                onClick={handleContinue}
                                className="bg-theme-green hover:bg-theme-green/90 min-w-[100px]"
                            >
                                {currentStep === steps.length 
                                    ? 'Complete' 
                                    : currentStep === 8
                                    ? 'Confirm & Pay Now'
                                    : currentStep === 7 
                                    ? 'Continue to Confirm' 
                                    : 'Continue'}
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Button>
                        </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
