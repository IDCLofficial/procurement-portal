import { useAuth } from "@/components/providers/public-service/AuthProvider";
import SettingsField from "@/components/settings/SettingsField";
import SettingsSection from "@/components/settings/SettingsSection";
import VerifiedBadge from "@/components/settings/VerifiedBadge";
import { Button } from "@/components/ui/button";
import { useUpdateVendorProfileMutation } from "@/store/api/vendor.api";
import { Loader, UserPen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { toast } from "sonner";

export default function PersonalInformation() {
    const { user } = useAuth();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullname || '',
        email: user?.email || '',
        phone: user?.phoneNo || '',
        accountRole: 'Company Administrator',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [updateProfileMutation, { isLoading: isUpdatingProfile, isSuccess, isError }] = useUpdateVendorProfileMutation();
    useEffect(() => {
        if (isSuccess) {
            toast.success('Profile updated successfully');
        }
        if (isError) {
            toast.error('Failed to update profile');
        }
    }, [isSuccess, isError]);


    const handleFieldChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleChangePassword = () => {
        console.log('Changing password...');
        // Handle password change logic
    };


    const isEditted = useMemo(() => ({
        fullname: formData.fullName !== user?.fullname,
        phone: formData.phone !== user?.phoneNo,
    }), [formData, user]);

    const isFormValid = useMemo(() => {
        return formData.fullName.length > 3 && formData.phone.length > 9;
    }, [formData]);

    const handleUpdateProfile = () => {
        if (!isFormValid) return;
        if (isUpdatingProfile) return;
        updateProfileMutation({
            fullname: formData.fullName,
            phoneNo: formData.phone,
        });
    };

    return (
        <div className='grid gap-6'>
            {/* Personal Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <SettingsSection
                    title="Personal Information"
                    description="Update your personal details and contact information"
                >
                    <div className="space-y-4">
                        <SettingsField
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={(value: string) => handleFieldChange('fullName', value)}
                            placeholder="John Doe"
                        />

                        <SettingsField
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={() => { }}
                            disabled
                            placeholder="john.doe@bobconstruction.com"
                            helperText="This email is used for account notifications and login"
                            badge={<VerifiedBadge />}
                        />

                        <SettingsField
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(value: string) => handleFieldChange('phone', value)}
                            placeholder="+234 803 123 4567"
                        />
                    </div>
                </SettingsSection>
                {/* Change Password Button */}
                {isFormValid && (isEditted.fullname || isEditted.phone) && <div className="mt-6">
                    <Button
                        className="bg-teal-700 hover:bg-teal-800 text-white"
                        onClick={handleUpdateProfile}
                        disabled={isUpdatingProfile}
                    >
                        {isUpdatingProfile ? <span className='flex items-center gap-2'>
                            <Loader className='animate-spin' />
                            Updating Profile...
                        </span> : <span className='flex items-center gap-2'>
                            <UserPen />
                            Update Profile
                        </span>}
                    </Button>
                </div>}
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <SettingsSection
                    title="Change Password"
                    description="Update your password to keep your account secure"
                >
                    <div className="space-y-4">
                        <SettingsField
                            label="Current Password"
                            name="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={formData.currentPassword}
                            onChange={(value: string) => handleFieldChange('currentPassword', value)}
                            placeholder="Enter current password"
                            icon={
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            }
                        />

                        <SettingsField
                            label="New Password"
                            name="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={formData.newPassword}
                            onChange={(value: string) => handleFieldChange('newPassword', value)}
                            placeholder="Enter new password"
                            helperText="Must be at least 8 characters with uppercase, lowercase, and numbers"
                            icon={
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            }
                        />

                        <SettingsField
                            label="Confirm New Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(value: string) => handleFieldChange('confirmPassword', value)}
                            placeholder="Re-enter new password"
                            icon={
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            }
                        />
                    </div>

                    {/* Change Password Button */}
                    <div className="mt-6">
                        <Button
                            className="bg-teal-700 hover:bg-teal-800 text-white cursor-pointer"
                            onClick={handleChangePassword}
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            Change Password
                        </Button>
                    </div>
                </SettingsSection>
            </div>
        </div>
    )
}
