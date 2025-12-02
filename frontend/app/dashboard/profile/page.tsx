'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ProfileUpdateGuidelines from '@/components/profile/ProfileUpdateGuidelines';
import TabNavigation from '@/components/profile/TabNavigation';
import FormSection from '@/components/profile/FormSection';
import FormField from '@/components/profile/FormField';
import FormRow from '@/components/profile/FormRow';
import DirectorCard from '@/components/profile/DirectorCard';
import PrivacyNote from '@/components/profile/PrivacyNote';
import BankVerificationBadge from '@/components/profile/BankVerificationBadge';
import InfoBanner from '@/components/profile/InfoBanner';
import { FaBuilding, FaUsers, FaUniversity } from 'react-icons/fa';
import SubHeader from '@/components/SubHeader';
import { useAuth } from '@/components/providers/public-service/AuthProvider';

export default function EditProfilePage() {
    const router = useRouter();
    const { company } = useAuth();
    const [activeTab, setActiveTab] = useState('company-info');

    // Form state
    const [formData, setFormData] = useState({
        businessAddress: company?.address || '',
        localGovernmentArea: company?.lga || '',
        companyWebsite: company?.website || '',
        bankName: company?.bankName || '',
        accountNumber: company?.accountNumber || '',
        accountName: company?.accountName || '',
    });

    const guidelines = [
        { text: 'Changes to CAC Number, TIN, and company legal name may require additional verification.' },
        { text: 'Updates will be reviewed by BPPPI staff and reflected within 1-2 business days.' },
        { text: 'Ensure all information matches your official company documents.' },
    ];

    const tabs = [
        {
            id: 'company-info',
            label: 'Company Information',
            icon: <FaBuilding />,
        },
        {
            id: 'directors',
            label: 'Directors & Officers',
            icon: <FaUsers />,
        },
        {
            id: 'bank-details',
            label: 'Bank Details',
            icon: <FaUniversity />,
        },
    ];

    const lgaOptions = [
        { value: 'Aboh Mbaise', label: 'Aboh Mbaise' },
        { value: 'Ahiazu Mbaise', label: 'Ahiazu Mbaise' },
        { value: 'Ehime Mbano', label: 'Ehime Mbano' },
        { value: 'Ezinihitte', label: 'Ezinihitte' },
        { value: 'Ideato North', label: 'Ideato North' },
        { value: 'Ideato South', label: 'Ideato South' },
        { value: 'Ihedioha/Igbo Etiti', label: 'Ihedioha/Igbo Etiti' },
        { value: 'Ihitte/Uboma', label: 'Ihitte/Uboma' },
        { value: 'Ikeduru', label: 'Ikeduru' },
        { value: 'Isiala Mbano', label: 'Isiala Mbano' },
        { value: 'Isu', label: 'Isu' },
        { value: 'Mbaitoli', label: 'Mbaitoli' },
        { value: 'Ngor Okpala', label: 'Ngor Okpala' },
        { value: 'Njaba', label: 'Njaba' },
        { value: 'Nkwerre', label: 'Nkwerre' },
        { value: 'Nwangele', label: 'Nwangele' },
        { value: 'Obowo', label: 'Obowo' },
        { value: 'Oguta', label: 'Oguta' },
        { value: 'Ohaji/Egbema', label: 'Ohaji/Egbema' },
        { value: 'Okigwe', label: 'Okigwe' },
        { value: 'Orlu', label: 'Orlu' },
        { value: 'Orsu', label: 'Orsu' },
        { value: 'Oru East', label: 'Oru East' },
        { value: 'Oru West', label: 'Oru West' },
        { value: 'Owerri Municipal', label: 'Owerri Municipal' },
        { value: 'Owerri North', label: 'Owerri North' },
        { value: 'Owerri West', label: 'Owerri West' },
    ];

    const handleFieldChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveChanges = () => {
        console.log('Saving changes:', formData);
        // Handle save logic
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <SubHeader
                title='Edit Company Profile'
                hasBackButton
            />

            <div className="container mx-auto px-4 py-6">
                {/* Guidelines */}
                <ProfileUpdateGuidelines guidelines={guidelines} />

                {/* Tab Navigation */}
                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {/* Form Content */}
                <div>
                    {activeTab === 'company-info' && (
                        <div className='grid gap-3'>
                            {/* Legal & Registration Details - Read Only */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <FormSection
                                    title="Legal & Registration Details"
                                    description="Official company information as registered with CAC"
                                >
                                    <FormRow columns={1}>
                                        <FormField
                                            label="Legal Company Name"
                                            name="legalCompanyName"
                                            value={company?.companyName || ""}
                                            onChange={() => {}}
                                            disabled
                                        />
                                    </FormRow>
                                    <FormRow columns={2}>
                                        <FormField
                                            label="CAC Number"
                                            name="cacNumber"
                                            value={company?.cacNumber || ""}
                                            onChange={() => {}}
                                            disabled
                                        />
                                        <FormField
                                            label="TIN"
                                            name="tin"
                                            value={company?.tin || ""}
                                            onChange={() => {}}
                                            disabled
                                        />
                                    </FormRow>
                                </FormSection>
                            </div>

                            {/* Contact & Location */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <FormSection
                                    title="Contact & Location"
                                    description="Business address and contact information"
                                >
                                    <FormRow columns={1}>
                                        <FormField
                                            label="Business Address"
                                            name="businessAddress"
                                            value={formData.businessAddress}
                                            onChange={(value) => handleFieldChange('businessAddress', value)}
                                        />
                                    </FormRow>
                                    <FormRow columns={2}>
                                        <FormField
                                            label="Local Government Area"
                                            name="localGovernmentArea"
                                            type="select"
                                            value={formData.localGovernmentArea}
                                            options={lgaOptions}
                                            onChange={(value) => handleFieldChange('localGovernmentArea', value)}
                                        />
                                        <FormField
                                            label="State"
                                            name="state"
                                            value={'Imo state'}
                                            onChange={()=>{}}
                                            disabled
                                        />
                                    </FormRow>
                                    <FormRow columns={1}>
                                        <FormField
                                            label="Company Website (Optional)"
                                            name="companyWebsite"
                                            value={formData.companyWebsite}
                                            placeholder="www.yourcompany.com"
                                            onChange={(value) => handleFieldChange('companyWebsite', value)}
                                        />
                                    </FormRow>
                                </FormSection>

                                {/* Action Buttons - Only on Contact & Location */}
                                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="bg-teal-700 hover:bg-teal-800 text-white"
                                        onClick={handleSaveChanges}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Save All Changes
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'directors' && (
                        <div className="space-y-4 bg-white rounded-xl border border-gray-200 p-6">
                            {/* Section Header */}
                            <div className="mb-6">
                                <h2 className="text-base font-semibold text-gray-900 mb-1">
                                    Company Directors & Officers
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Add all directors and key officers of the company
                                </p>
                            </div>

                            {/* Director Cards */}
                            {company?.directors && company?.directors.map((director) => (
                                <DirectorCard
                                    key={director.id}
                                    directorNumber={Number(director.phone)}
                                    fullName={director.name}
                                    nin={director.id}
                                    email={director.email}
                                    phone={director.phone}
                                />
                            ))}

                            {/* Privacy Note */}
                            <PrivacyNote message="NIN will not be displayed publicly. It's used only for internal verification and KYC purposes." />
                        </div>
                    )}

                    {activeTab === 'bank-details' && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <FormSection
                                title="Banking Information"
                                description="Bank account details for payment processing"
                            >
                                {/* Info Banner */}
                                <InfoBanner message="Bank details will be useful for Phase 2 when contract payments and disbursements are processed through the platform. Ensure the account name matches your registered company name." />

                                <FormRow columns={1}>
                                    <FormField
                                        label="Bank Name"
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={() => {}}
                                        disabled
                                    />
                                </FormRow>

                                <FormRow columns={2}>
                                    <FormField
                                        label="Account Number"
                                        name="accountNumber"
                                        value={String(formData.accountNumber)}
                                        onChange={() => {}}
                                        disabled
                                    />
                                    <FormField
                                        label="Account Name"
                                        name="accountName"
                                        value={formData.accountName}
                                        onChange={() => {}}
                                        disabled
                                    />
                                </FormRow>

                                {/* Bank Verification Badge */}
                                <BankVerificationBadge
                                    accountName={formData.accountName}
                                    bankName={formData.bankName}
                                />
                            </FormSection>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
