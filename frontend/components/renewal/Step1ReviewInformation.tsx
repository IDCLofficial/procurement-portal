'use client';

import InfoItem from './InfoItem';
import CategoryBadge from './CategoryBadge';
import VerificationItem from './VerificationItem';
import SuccessAlert from './SuccessAlert';
import { FaBuilding } from 'react-icons/fa6';

interface Category {
    category: string;
    grade: string;
}

interface VerificationItem {
    label: string;
    value: string;
}

interface Step1ReviewInformationProps {
    registrationId: string;
    companyName: string;
    currentExpiryDate: string;
    newExpiryDate: string;
    categories: Category[];
    verificationItems: VerificationItem[];
    onUpdateCompanyInfo: () => void;
}

export default function Step1ReviewInformation({
    registrationId,
    companyName,
    currentExpiryDate,
    newExpiryDate,
    categories,
    verificationItems,
    onUpdateCompanyInfo,
}: Step1ReviewInformationProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-3 mb-6">
                <div>
                    <h2 className="text-base font-semibold text-gray-900 mb-1 flex items-end gap-2">
                        <FaBuilding className="text-gray-600 text-xl mt-1" />
                        Current Registration Details
                    </h2>
                    <p className="text-sm text-gray-500">
                        Review your existing registration information
                    </p>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-linear-to-b from-white to-blue-50 border border-blue-200 rounded-xl">
                <InfoItem label="Registration ID" value={registrationId} />
                <InfoItem label="Company Name" value={companyName} />
                <InfoItem
                    label="Current Expiry Date"
                    value={currentExpiryDate}
                    valueColor="red"
                />
                <InfoItem
                    label="New Expiry Date"
                    value={newExpiryDate}
                    valueColor="green"
                />
            </div>

            {/* Registration Categories */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Registration Categories
                </h3>
                <div className="bg-gray-50 rounded-lg border border-gray-200">
                    {categories.map((item, index) => (
                        <CategoryBadge
                            key={index}
                            category={item.category}
                            grade={item.grade}
                        />
                    ))}
                </div>
            </div>

            {/* Company Verification */}
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Company Verification
                </h3>
                <div className="bg-gray-50 rounded-lg border border-gray-200">
                    {verificationItems.map((item, index) => (
                        <VerificationItem
                            key={index}
                            label={item.label}
                            value={item.value}
                        />
                    ))}
                </div>
            </div>

            {/* Success Alert */}
            <div className="mt-6">
                <SuccessAlert
                    title="Renewal keeps all your current information"
                    message="Your sectors, grade, and company details remain the same. Only expired documents need to be updated."
                    linkText="Click here"
                    onLinkClick={onUpdateCompanyInfo}
                />
            </div>
        </div>
    );
}
