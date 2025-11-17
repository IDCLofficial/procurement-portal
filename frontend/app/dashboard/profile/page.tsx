'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '@/components/DashboardHeader';
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

export default function EditProfilePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('company-info');

    // Form state
    const [formData, setFormData] = useState({
        legalCompanyName: 'ABC Construction Limited',
        companyType: 'Limited Liability Company (Ltd)',
        yearEstablished: '2015',
        cacNumber: 'RC1234567',
        rcbnNumber: 'RC1234567',
        tin: 'TIN-12345678',
        businessAddress: '123 Construction Avenue, GRA Phase 2, Owerri',
        localGovernmentArea: 'Owerri Municipal',
        state: 'Imo State',
        primaryEmail: 'info@abcconstruction.com',
        primaryPhone: '+234 803 123 4567',
        companyWebsite: 'www.abcconstruction.com',
        bankName: 'Guaranty Trust Bank',
        accountNumber: '0123456789',
        accountName: 'ABC Construction Limited',
        companyBvn: '22012345678',
    });

    // Directors state
    const [directors, setDirectors] = useState([
        {
            id: 1,
            fullName: 'Jane Smith',
            nin: '12345678901',
            email: 'jane@abcconstruction.com',
            phone: '+234 803 111 2222',
        },
        {
            id: 2,
            fullName: 'Michael Johnson',
            nin: '98765432109',
            email: 'michael@abcconstruction.com',
            phone: '+234 803 333 4444',
        },
        {
            id: 3,
            fullName: '',
            nin: '',
            email: '',
            phone: '',
        },
    ]);

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

    const companyTypeOptions = [
        { value: 'Limited Liability Company (Ltd)', label: 'Limited Liability Company (Ltd)' },
        { value: 'Public Limited Company (PLC)', label: 'Public Limited Company (PLC)' },
        { value: 'Partnership', label: 'Partnership' },
        { value: 'Sole Proprietorship', label: 'Sole Proprietorship' },
    ];

    const lgaOptions = [
        { value: 'Owerri Municipal', label: 'Owerri Municipal' },
        { value: 'Owerri North', label: 'Owerri North' },
        { value: 'Owerri West', label: 'Owerri West' },
    ];

    const stateOptions = [
        { value: 'Imo State', label: 'Imo State' },
        { value: 'Lagos State', label: 'Lagos State' },
        { value: 'Abuja FCT', label: 'Abuja FCT' },
    ];

    const handleFieldChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleDirectorFieldChange = (directorId: number, field: string, value: string) => {
        setDirectors((prev) =>
            prev.map((director) =>
                director.id === directorId
                    ? { ...director, [field]: value }
                    : director
            )
        );
    };

    const handleSaveChanges = () => {
        console.log('Saving changes:', formData);
        // Handle save logic
    };

    const handleCancel = () => {
        router.back();
    };

    const handleLogout = () => {
        console.log('Logout');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader
                companyName="ABC Construction Ltd"
                subtitle="Back to Dashboard"
                hasBackButton
                onLogout={handleLogout}
            />

            <div className="container mx-auto px-4 py-6">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900">Edit Company Profile</h1>
                    </div>
                </div>

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
                                            value={formData.legalCompanyName}
                                            onChange={(value) => handleFieldChange('legalCompanyName', value)}
                                            disabled
                                        />
                                    </FormRow>
                                    <FormRow columns={2}>
                                        <FormField
                                            label="Company Type"
                                            name="companyType"
                                            type="select"
                                            value={formData.companyType}
                                            options={companyTypeOptions}
                                            onChange={(value) => handleFieldChange('companyType', value)}
                                            disabled
                                        />
                                        <FormField
                                            label="Year Established"
                                            name="yearEstablished"
                                            type="number"
                                            value={formData.yearEstablished}
                                            onChange={(value) => handleFieldChange('yearEstablished', value)}
                                            disabled
                                        />
                                    </FormRow>
                                    <FormRow columns={3}>
                                        <FormField
                                            label="CAC Number"
                                            name="cacNumber"
                                            value={formData.cacNumber}
                                            onChange={(value) => handleFieldChange('cacNumber', value)}
                                            disabled
                                        />
                                        <FormField
                                            label="RC/BN Number"
                                            name="rcbnNumber"
                                            value={formData.rcbnNumber}
                                            onChange={(value) => handleFieldChange('rcbnNumber', value)}
                                            disabled
                                        />
                                        <FormField
                                            label="TIN"
                                            name="tin"
                                            value={formData.tin}
                                            onChange={(value) => handleFieldChange('tin', value)}
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
                                            type="select"
                                            value={formData.state}
                                            options={stateOptions}
                                            onChange={(value) => handleFieldChange('state', value)}
                                        />
                                    </FormRow>
                                    <FormRow columns={2}>
                                        <FormField
                                            label="Primary Email"
                                            name="primaryEmail"
                                            type="email"
                                            value={formData.primaryEmail}
                                            onChange={(value) => handleFieldChange('primaryEmail', value)}
                                        />
                                        <FormField
                                            label="Primary Phone"
                                            name="primaryPhone"
                                            type="tel"
                                            value={formData.primaryPhone}
                                            onChange={(value) => handleFieldChange('primaryPhone', value)}
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
                            {directors.map((director) => (
                                <DirectorCard
                                    key={director.id}
                                    directorNumber={director.id}
                                    fullName={director.fullName}
                                    nin={director.nin}
                                    email={director.email}
                                    phone={director.phone}
                                    onFieldChange={(field, value) =>
                                        handleDirectorFieldChange(director.id, field, value)
                                    }
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
                                        onChange={(value) => handleFieldChange('bankName', value)}
                                    />
                                </FormRow>

                                <FormRow columns={2}>
                                    <FormField
                                        label="Account Number"
                                        name="accountNumber"
                                        value={formData.accountNumber}
                                        onChange={(value) => handleFieldChange('accountNumber', value)}
                                    />
                                    <FormField
                                        label="Account Name"
                                        name="accountName"
                                        value={formData.accountName}
                                        disabled
                                        onChange={(value) => handleFieldChange('accountName', value)}
                                    />
                                </FormRow>

                                <FormRow columns={1}>
                                    <FormField
                                        label="Company BVN"
                                        name="companyBvn"
                                        value={formData.companyBvn}
                                        hint="(Optional)"
                                        onChange={(value) => handleFieldChange('companyBvn', value)}
                                    />
                                </FormRow>

                                {/* Bank Verification Badge */}
                                <BankVerificationBadge
                                    accountName="ABC Construction Limited"
                                    bankName="Guaranty Trust Bank"
                                />
                            </FormSection>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
