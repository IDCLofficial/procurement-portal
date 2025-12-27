'use client';

import { Fragment, useMemo, useState } from 'react';
import { DocumentStatus, type DocumentRequirement } from '@/types/registration';
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
import { useAuth } from './providers/public-service/AuthProvider';
import sirvClient from '@/lib/sirv.class';
import { PaymentType, VendorSteps } from '@/store/api/enum';
import { useCompleteVendorRegistrationMutation, useInitPaymentMutation } from '@/store/api/vendor.api';
import { Loader2 } from 'lucide-react';
import { CompleteVendorRegistrationRequest, ResponseError } from '@/store/api/types';
import { deepEqual, formatCurrency } from '@/lib';
import { useRouter } from 'next/navigation';
import { processingFee, return_url_key } from '@/lib/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { isUrl } from '@/lib/utils';

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
    const { user, company: companyData, documents: presets, categories: categoriesData, mdas } = useAuth();
    const [isUploadingDocuments, setIsUploadingDocuments] = useState(false);
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [paymentInitiated, setPaymentInitiated] = useState(false);

    const setStartPoint = useMemo(() => {
        if (!user) return 2;

        const companyForm = user.companyForm.toLowerCase();
        switch(companyForm){
            case VendorSteps.COMPANY:
                return 2;
            case VendorSteps.DIRECTORS:
                return 3;
            case VendorSteps.BANK_DETAILS.toLowerCase():
                return 4;
            case VendorSteps.DOCUMENTS:
                return 5;
            case VendorSteps.CATEGORIES_AND_GRADE.toLowerCase():
                return 6;
            case VendorSteps.PAYMENT:
                return 7;
            case VendorSteps.CONFIRM_PAYMENT:
                return 8;
            case VendorSteps.COMPLETE:
                return 9;
            default:
                return 2;
        }
    }, [user]);
    const [currentStep, setCurrentStep] = useState(setStartPoint); // Start from step 2
    const [formData, setFormData] = useState({
        // Step 2: Company Details
        companyName: companyData?.companyName?.trimEnd() || '',
        cacNumber: companyData?.cacNumber?.trimEnd() || '',
        tinNumber: companyData?.tin?.trimEnd() || '',
        address: companyData?.address?.trimEnd() || '',
        lga: companyData?.lga?.trimEnd() || '',
        website: companyData?.website?.trimEnd() || '',
    });

    // Step 3: Directors
    const [directors, setDirectors] = useState(companyData?.directors ? (companyData.directors).map((director) => ({
        id: director.id,
        fullName: director.name,
        phone: String(director.phone),
        email: director.email,
        documentType: director.idType,
        documentValue: director.id,
    })) : [
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
        bankName: companyData?.bankName?.trimEnd() || '',
        accountNumber: String(companyData?.accountNumber || "") || '',
        accountName: companyData?.accountName?.trimEnd() || '',
    });

    // Step 6: Category & Grade
    const [selectedSector, setSelectedSector] = useState<string>(companyData?.category || '');
    const [selectedGrade, setSelectedGrade] = useState<string>(companyData?.grade || '');
    const [selectedMDA, setSelectedMDA] = useState<string>(companyData?.mda || '');

    // Step 5: Documents
    const [documents, setDocuments] = useState<DocumentRequirement[]>(() => {
        if (!presets) return [];

        const docsFromPresets = presets.map((preset) => ({
            id: preset.documentName.toLowerCase().replace(/\s+/g, '-'),
            name: preset.documentName,
            required: preset.isRequired,
            validFor: preset.hasExpiry === 'yes' ? '1 year' : undefined,
            hasValidityPeriod: preset.hasExpiry === 'yes',
            uploaded: false,
            status: DocumentStatus.IDLE,
            validFrom: '',
            validTo: '',
            fileUrl: '',
            fileName: '',
            fileSize: '',
            fileType: '',
            uploadedDate: '',
            changed: false,
        }));

        // Prefill from companyData if available
        if (companyData?.documents) {
            companyData.documents.forEach(uploadedDoc => {
                const matchingDoc = docsFromPresets.find(doc => {
                    const match = doc.id === uploadedDoc._id || doc.name === uploadedDoc.documentType;
                    return match;
                });
                if (matchingDoc) {
                    matchingDoc.uploaded = true;
                    matchingDoc.status = DocumentStatus.SAVED;
                    matchingDoc.fileUrl = uploadedDoc.fileUrl;
                    matchingDoc.fileName = uploadedDoc.fileName;
                    matchingDoc.fileSize = uploadedDoc.fileSize;
                    matchingDoc.fileType = uploadedDoc.fileType;
                    matchingDoc.uploadedDate = uploadedDoc.uploadedDate;
                    matchingDoc.validFrom = uploadedDoc.validFrom || '';
                    matchingDoc.validTo = uploadedDoc.validTo || '';
                    matchingDoc.changed = false;
                }
            });
        }

        return docsFromPresets;
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleBankDetailsChange = (field: string, value: string) => {
        setBankDetails(prev => ({ ...prev, [field]: value }));
    };

    const [completeVendorRegistration, { isLoading }] = useCompleteVendorRegistrationMutation();

    const [initPayment, { isLoading: isInitPaymentLoading }] = useInitPaymentMutation();

    const handleConfirmPayment = async () => {
        if (!formData) return;

        const payload = {
            amount: processingFee,
            type: PaymentType.PROCESSINGFEE,
            description: `${formData.companyName}'s registration fee`,
        }

        try {
            toast.loading('Initializing payment...', { id: "payment" });
            const response = await initPayment(payload);
            toast.dismiss("payment");
            localStorage.setItem(return_url_key, "/dashboard/complete-registration");
            if (response.data) {
                setPaymentInitiated(true);
                router.push(response.data.authorization_url);
            }
        } catch (error) {
            toast.dismiss("payment");
            console.error(error);
            toast.error((error as Error).message || 'Failed to initialize payment');
            throw new Error((error as Error).message || 'Failed to initialize payment');
        }
    };

    const handleContinue = async () => {
        if(!presets) return;
        if (isInitPaymentLoading) return;
        if (isUploadingDocuments) return;
        if (isLoading) return;

        // Validate current step
        if (currentStep === 2) {
            if (!formData.companyName || !formData.cacNumber || !formData.tinNumber || !formData.address || !formData.lga) {
                toast.error('Please fill in all required fields');
                return;
            }

            if (formData.website && !isUrl(formData.website)) {
                toast.error('Please enter a valid website URL');
                return;
            }

            const hasWebsite = formData.website.trim().length > 0;
            const generatedWebsite = (formData.website.startsWith('http://') || formData.website.startsWith('https://')) ? formData.website : `https://${formData.website}`;
            const websiteValue = hasWebsite ? generatedWebsite : "";

            const payload = {
                [VendorSteps.COMPANY]: {
                    companyName: formData.companyName,
                    cacNumber: formData.cacNumber,
                    tin: formData.tinNumber,
                    businessAddres: formData.address,
                    lga: formData.lga,
                    website: websiteValue,
                }
            }

            const madeAnUpdate = !deepEqual(payload, {
                [VendorSteps.COMPANY]: {
                    companyName: companyData?.companyName,
                    cacNumber: companyData?.cacNumber,
                    tin: companyData?.tin,
                    businessAddres: companyData?.address,
                    lga: companyData?.lga,
                    website: companyData?.website,
                }
            });

            if (madeAnUpdate) {
                try {
                    toast.loading('Saving your company details...', { id: "company" });
                    const response = await completeVendorRegistration(payload);
    
                    if (response.error) {
                        throw new Error((response.error as ResponseError["error"]).data.message);
                    }
                    toast.dismiss("company");
                    toast.success('Company details saved successfully');
                    setCurrentStep(currentStep + 1);
                } catch (error) {
                    toast.dismiss("company");
                    console.error('Error saving company details:', error);
                    toast.error((error as Error).message || 'Failed to save your company details');
                }
            } else {
                setCurrentStep(currentStep + 1);
            }
            return;
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

            const payload = {
                [VendorSteps.DIRECTORS]: directors.map((director) => ({
                    name: director.fullName,
                    idType: director.documentType,
                    id: director.documentValue,
                    phone: director.phone,
                    email: director.email,
                }))
            }

            const madeAnUpdate = !deepEqual(payload, {
                [VendorSteps.DIRECTORS]: companyData?.directors?.map((director) => ({
                    name: director.name,
                    idType: director.idType,
                    id: director.id,
                    phone: director.phone,
                    email: director.email,
                }))
            })

            if (!madeAnUpdate) {
                setCurrentStep(currentStep + 1);
                return;
            }

            try {
                toast.loading('Saving your company directors details...', { id: "directors" });
                const response = await completeVendorRegistration(payload);

                if (response.error) {
                    throw new Error((response.error as ResponseError["error"]).data.message);
                }
                toast.dismiss("directors");
                toast.success('Company directors details saved successfully');
                setCurrentStep(currentStep + 1);
            } catch (error) {
                toast.dismiss("directors");
                console.error('Error saving company directors details:', error);
                toast.error((error as Error).message || 'Failed to save your company details');
            }

            return;
        }

        if (currentStep === 4) {
            const payload: CompleteVendorRegistrationRequest = {
                [VendorSteps.BANK_DETAILS]: {
                    bankName: bankDetails.bankName,
                    accountName: bankDetails.accountName,
                    accountNumber: Number(bankDetails.accountNumber),
                }
            }

            const madeAnUpdate = !deepEqual(payload, {
                [VendorSteps.BANK_DETAILS]: {
                    bankName: companyData?.bankName,
                    accountName: companyData?.accountName,
                    accountNumber: companyData?.accountNumber,
                }
            })

            if (!madeAnUpdate) {
                setCurrentStep(currentStep + 1);
                return;
            }
            try {
                toast.loading('Saving your company bank details...', { id: "bankDetails" });
                const response = await completeVendorRegistration(payload);

                if (response.error) {
                    throw new Error((response.error as ResponseError["error"]).data.message);
                }


                toast.dismiss("bankDetails");
                toast.success('Company bank details saved successfully');
                setCurrentStep(currentStep + 1);
            } catch (error) {
                toast.dismiss("bankDetails");
                console.error('Error saving company bank details:', error);
                toast.error((error as Error).message || 'Failed to save your company details');
            }

            return;
        }

        if (currentStep === 5) {
            // Detect document changes + saved state
            const documentsChanged = documents.some(doc => doc.changed);
            const allDocsAlreadySaved = documents
                .filter(doc => doc.required || doc.fileName)
                .every(doc => doc.status === DocumentStatus.SAVED);


            // Only skip uploads if:
            // 1) Nothing changed
            // 2) All docs are already saved
            if (!documentsChanged && allDocsAlreadySaved) {
                setCurrentStep(currentStep + 1);
                return;
            }

            // Validate required documents
            const requiredDocs = documents.filter(doc => doc.required);
            const missingDocs = requiredDocs.filter(doc => !doc.uploaded);
            if (missingDocs.length > 0) {
                toast.error(
                    `Please upload all required documents: ${missingDocs
                        .map(d => d.name)
                        .join(", ")}`
                );
                return;
            }

            // Validate validity-period documents
            const docsNeedingDates = documents.filter(
                doc => doc.hasValidityPeriod && doc.uploaded
            );
            const invalidDates = docsNeedingDates.filter(
                doc => !doc.validFrom || !doc.validTo
            );
            if (invalidDates.length > 0) {
                toast.error("Please provide validity dates for all applicable documents");
                return;
            }

            // Determine upload queue
            const docsToUpload = documents.filter(
                doc => doc.file && doc.status !== DocumentStatus.SUCCESS
            );

            let updatedDocuments = documents;

            // ------------------------
            // UPLOAD SECTION
            // ------------------------
            if (docsToUpload.length > 0) {
                setIsUploadingDocuments(true);

                // Mark docs as uploading
                setDocuments((prev) =>
                    prev.map((doc) =>
                        docsToUpload.some((d) => d.id === doc.id)
                            ? { ...doc, status: DocumentStatus.UPLOADING }
                            : doc
                    )
                );

                const uploadPromises = docsToUpload.map(async (doc) => {
                    try {
                        const fileUrl = await sirvClient.uploadAttachment(doc.file!);
                        return { docId: doc.id, fileUrl, success: true };
                    } catch (error) {
                        console.error(`Upload failed for ${doc.name}:`, error);
                        return { docId: doc.id, success: false, error: "Upload failed" };
                    }
                });

                const results = await Promise.allSettled(uploadPromises);
                const fileUrls: Record<string, string | undefined> = {};
                const errors: string[] = [];

                results.forEach((result, idx) => {
                    const doc = docsToUpload[idx];
                    if (result.status === "fulfilled") {
                        if (result.value.success) {
                            fileUrls[doc.id] = result.value.fileUrl;
                        } else {
                            errors.push(`${doc.name}: ${result.value.error}`);
                        }
                    } else {
                        errors.push(`${doc.name}: ${result.reason}`);
                    }
                });

                // Apply upload results
                updatedDocuments = documents.map((doc) => {
                    const fileUrl = fileUrls[doc.id];
                    if (fileUrl) {
                        return {
                            ...doc,
                            status: DocumentStatus.SUCCESS,
                            fileUrl,
                            error: undefined,
                            changed: false,
                            uploaded: true,
                        };
                    }

                    if (errors.some((e) => e.startsWith(doc.name))) {
                        return {
                            ...doc,
                            status: DocumentStatus.ERROR,
                            error: errors.find((e) => e.startsWith(doc.name))?.split(": ")[1],
                        };
                    }

                    return doc;
                });

                setDocuments(updatedDocuments);

                if (errors.length > 0) {
                    toast.error(`Some uploads failed. Please retry failed documents.`);
                    return;
                }

                setIsUploadingDocuments(false);
            }

            const allDocsValid = updatedDocuments.filter(doc => doc.fileName).every(
                (doc) =>
                    (!doc.required || doc.uploaded) &&
                    (doc.status === DocumentStatus.SUCCESS || doc.status === DocumentStatus.SAVED) &&
                    !!doc.fileUrl
            );

            if (!allDocsValid) {
                toast.error(
                    "All documents must be successfully uploaded before continuing."
                );
                return;
            }

            const payload = {
                [VendorSteps.DOCUMENTS]: updatedDocuments
                    .filter(doc => doc.fileName)
                    .map(doc => ({
                        id: doc.id,
                        fileUrl: doc.fileUrl ?? "",
                        validFrom: doc.hasValidityPeriod ? doc.validFrom : undefined,
                        validTo: doc.hasValidityPeriod ? doc.validTo : undefined,
                        documentType: doc.name,
                        uploadedDate: doc.uploadedDate ?? "",
                        fileName: doc.fileName ?? "",
                        fileSize: doc.fileSize ?? "",
                        fileType: doc.fileType ?? "",
                        validFor: doc.validFor ?? "",
                        hasValidityPeriod: doc.hasValidityPeriod,
                    })),
            };

            // ------------------------
            // SAVE DOCUMENTS
            // ------------------------
            try {
                toast.loading("Saving your documents...", { id: "documents" });

                const response = await completeVendorRegistration(payload);

                if (response.error) {
                    throw new Error(
                        (response.error as ResponseError["error"]).data.message
                    );
                }

                toast.dismiss("documents");
                toast.success("Documents saved successfully!");

                // Mark docs as fully saved
                setDocuments(prev =>
                    prev.map(doc => ({
                        ...doc,
                        status: DocumentStatus.SAVED,
                        changed: false,
                    }))
                );

                setCurrentStep(6);
            } catch (error) {
                toast.dismiss("documents");
                console.error("Error saving documents:", error);
                toast.error(
                    (error as Error).message || "Failed to save your documents"
                );
            }

            return;
        }

        if (currentStep === 6) {
            // Validate sectors and grade selection
            if (!selectedSector) {
                toast.error('Please select a sector');
                return;
            }
            if (!selectedGrade) {
                toast.error('Please select a grade');
                return;
            }
            if (!selectedMDA) {
                toast.error('Please select an MDA');
                return;
            }

            const madeAnUpdate = !deepEqual({
                category: selectedSector,
                grade: selectedGrade,
                mdas: selectedMDA,
            }, {
                category: companyData?.category,
                grade: companyData?.grade || '',
                mdas: companyData?.mda || '',
            });

            if (!madeAnUpdate) {
                setCurrentStep(7);
                toast.success('Progress saved');
                return;
            }

            const payload = {
                [VendorSteps.CATEGORIES_AND_GRADE]: {
                    category: selectedSector,
                    grade: selectedGrade,
                    mda: selectedMDA,
                },
            };

            try {
                toast.loading('Saving your sectors and grade...', { id: "sectorsAndGrade" });
                // throw new Error('Test error');
                const response = await completeVendorRegistration(payload);

                if (response.error) {
                    throw new Error((response.error as ResponseError["error"]).data.message);
                }
                toast.dismiss("sectorsAndGrade");
                toast.success('Sectors and grade saved successfully!');
                setCurrentStep(7);
            } catch (error) {
                toast.dismiss("sectorsAndGrade");
                console.error('Error saving sectors and grade:', error);
                toast.error((error as Error).message || 'Failed to save your sectors and grade');
            }
            return;
        }

        if (currentStep === 8) {
            setOpen(true)
            return;
        }

        // For other steps, just move to next step
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
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
                const sectors = categoriesData?.categories?.map(category => ({
                    id: category.sector,
                    name: category.sector.toUpperCase(),
                    description: category.description,
                })) || [];
                const grades = categoriesData?.grades
                return (
                    <Step6CategoryGrade
                        selectedSector={selectedSector}
                        selectedGrade={selectedGrade}
                        onSectorChange={setSelectedSector}
                        onGradeChange={setSelectedGrade}
                        sectors={sectors}
                        mdas={mdas || []}
                        selectedMDA={selectedMDA}
                        onMDAChange={setSelectedMDA}
                        grades={grades || []}
                    />
                );
            
            case 7:
                return (
                    <Step7PaymentSummary
                        companyName={formData.companyName}
                        cacNumber={formData.cacNumber}
                        selectedSector={selectedSector}
                        selectedGrade={selectedGrade}
                    />
                );
            
            case 8:
                return (
                    <Step8ConfirmPayment
                        companyName={formData.companyName}
                        email={user?.email || ''}
                        phone={user?.phoneNo || ''}
                        totalAmount={processingFee}
                    />
                );
            
            case 9:
                return (
                    <Step9Receipt
                        transactionRef={user?.reg_payment_ref.toUpperCase() || "N/A"}
                        dateTime={new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        paymentMethod="Paystack"
                        companyName={formData.companyName}
                        cacNumber={formData.cacNumber}
                        contactPerson={directors[0]?.fullName || ''}
                        email={directors[0]?.email || ''}
                        processingFee={processingFee}
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
                        {renderStepContent()}

                        {/* Navigation Buttons - Hide on receipt page */}
                        {currentStep !== 9 && (
                        <div className="flex justify-between mt-8 pt-6 border-t">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 2 || isLoading}
                                className="min-w-[100px]"
                            >
                                {currentStep === 8 ? 'Back to Summary' : 'Back'}
                            </Button>
                            <Button
                                onClick={handleContinue}
                                disabled={isLoading || !presets || isUploadingDocuments || isInitPaymentLoading || paymentInitiated}
                                className="bg-theme-green hover:bg-theme-green/90 min-w-[100px] cursor-pointer"
                            >
                                {isLoading || isUploadingDocuments || isInitPaymentLoading
                                    ?
                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                    :
                                    <Fragment>
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
                                    </Fragment>}
                            </Button>
                        </div>
                        )}
                    </CardContent>
                </Card>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-900">
                                Confirm Payment
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Payment Summary */}
                            <div className="space-y-4">
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-semibold text-gray-900">Total Amount</span>
                                        <span className="text-2xl font-bold text-green-600">
                                            {formatCurrency(processingFee)}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-gray-900">Payment Details:</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Company:</span>
                                            <span className="font-medium">{formData.companyName}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Agreement Checkbox */}
                            <div className="space-y-2">
                                <div className="flex items-start space-x-3">
                                    <Checkbox
                                        id="terms"
                                        checked={agreed}
                                        onCheckedChange={(checked) => setAgreed(checked === true)}
                                    />
                                    <div className="space-y-1">
                                        <Label htmlFor="terms" className="text-sm font-medium leading-none">
                                            I confirm that&nbsp;
                                        </Label>
                                        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                                            <li>I have reviewed all the information provided</li>
                                            <li>This is a non-refundable payment</li>
                                            <li>I agree to the Terms of Service</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4">
                                {!isInitPaymentLoading && <Button
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                    className='cursor-pointer'
                                    type="button"
                                >
                                    Cancel
                                </Button>}
                                <Button
                                    type="button"
                                    onClick={handleConfirmPayment}
                                    disabled={!agreed || isInitPaymentLoading || paymentInitiated}
                                    className="bg-theme-green hover:bg-theme-green/90"
                                >
                                    {isInitPaymentLoading ? 'Processing...' : 'Confirm Payment'}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
