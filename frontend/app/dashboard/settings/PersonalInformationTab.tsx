import { useAuth } from "@/components/providers/public-service/AuthProvider";
import SettingsField from "@/components/settings/SettingsField";
import SettingsSection from "@/components/settings/SettingsSection";
import VerifiedBadge from "@/components/settings/VerifiedBadge";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { copyToClipboard } from "@/lib";
import { useChangePasswordMutation, useUpdateVendorProfileMutation } from "@/store/api/vendor.api";
import { AnimatePresence, motion } from "framer-motion";
import { Loader, UserPen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FaEye, FaEyeSlash, FaKey, FaLock } from "react-icons/fa6";
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
    const [showPasswordStrength, setShowPasswordStrength] = useState(false);
    const debouncedNewPassword = useDebounce(formData.newPassword, 500);

    const [updateProfileMutation, { isLoading: isUpdatingProfile, isSuccess, isError }] = useUpdateVendorProfileMutation();
    const [updatePasswordMutation, { isLoading: isUpdatingPassword, isSuccess: isPasswordSuccess, isError: isPasswordError }] = useChangePasswordMutation();
    useEffect(() => {
        if (isSuccess) {
            toast.success('Profile updated successfully');
        }
        if (isError) {
            toast.error('Failed to update profile');
        }

        setTimeout(() => {
            setFormData((prev) => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));
        }, 10);
    }, [isSuccess, isError]);

    useEffect(() => {
        if (isPasswordSuccess) {
            toast.success('Password updated successfully');
        }
        if (isPasswordError) {
            toast.error('Failed to update password');
        }
        setTimeout(() => {
            setFormData((prev) => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));
        }, 10);
    }, [isPasswordSuccess, isPasswordError]);


    const handleFieldChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleChangePassword = () => {
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) return;
        if (isUpdatingPassword) return;
        updatePasswordMutation({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
        });
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


    // Add this function inside the component
    const getPasswordStrength = (password: string) => {
        if (!password) {
            return { score: 0, label: '', color: '', bgColor: '', message: '' };
        }

        let score = 0;
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };

        if (checks.length) score += 20;
        if (checks.uppercase) score += 20;
        if (checks.lowercase) score += 20;
        if (checks.number) score += 20;
        if (checks.special) score += 20;

        if (score < 40) {
            return {
                score,
                label: 'Weak',
                color: 'text-red-700',
                bgColor: 'bg-red-500',
                message: 'Add more character types'
            };
        } else if (score < 80) {
            return {
                score,
                label: 'Fair',
                color: 'text-orange-700',
                bgColor: 'bg-orange-500',
                message: 'Almost there, keep going'
            };
        } else if (score < 100) {
            return {
                score,
                label: 'Good',
                color: 'text-blue-700',
                bgColor: 'bg-blue-500',
                message: 'Strong password!'
            };
        } else {
            return {
                score,
                label: 'Excellent',
                color: 'text-green-700',
                bgColor: 'bg-theme-green',
                message: 'Very secure password!'
            };
        }
    };

    const passwordStrength = useMemo(() =>
        getPasswordStrength(formData.newPassword),
        [formData.newPassword]
    );

    // Add this function for password generation
    const generatePassword = () => {
        const length = 16;
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const allChars = uppercase + lowercase + numbers + special;

        let password = '';
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += special[Math.floor(Math.random() * special.length)];

        for (let i = password.length; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        password = password.split('').sort(() => Math.random() - 0.5).join('');

        handleFieldChange('newPassword', password);
        handleFieldChange('confirmPassword', password);
        copyToClipboard(password, 'Password copied to clipboard');
        setShowNewPassword(true);
        setShowConfirmPassword(true);
    };

    // Password match validation
    const passwordMatchError = useMemo(() => {
        if (!formData.confirmPassword) return '';
        if (!formData.currentPassword) return 'Current password is required';
        return debouncedNewPassword !== formData.confirmPassword ? 'Passwords do not match' : '';
    }, [debouncedNewPassword, formData.confirmPassword, formData.currentPassword]);

    const passwordsMatch = useMemo(() => {
        if (!debouncedNewPassword || !formData.confirmPassword) return true;
        return debouncedNewPassword === formData.confirmPassword;
    }, [debouncedNewPassword, formData.confirmPassword]);

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
                        disabled={isUpdatingProfile || isUpdatingPassword}
                    >
                        {(isUpdatingProfile || isUpdatingPassword) ? <span className='flex items-center gap-2'>
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
                            onChange={(value: string) => {
                                handleFieldChange('newPassword', value);
                                setShowPasswordStrength(value.length > 0);
                            }}
                            placeholder="Enter new password"
                            icon={
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            }
                            helperComponent={
                                <button
                                    type="button"
                                    onClick={generatePassword}
                                    className="text-theme-green cursor-pointer font-semibold text-sm flex items-center gap-1 py-2 capitalize"
                                    title="Generate strong password"
                                >
                                    <span>generate</span>
                                    <FaKey className="w-3 h-3" />
                                </button>
                            }
                        />

                        {/* Add this right after the new password field */}
                        {showPasswordStrength && formData.newPassword && (
                            <div className="mt-2 space-y-2 pl-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-700">Password Strength:</span>
                                    <span className={`text-xs font-semibold ${passwordStrength.color}`}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.bgColor}`}
                                        style={{ width: `${passwordStrength.score}%` }}
                                    />
                                </div>

                                <ul className="text-xs space-y-1 mt-2">
                                    <AnimatePresence mode="popLayout">
                                        {formData.newPassword.length > 0 && formData.newPassword.length < 8 && (
                                            <motion.li
                                                key="length"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="text-gray-400">○</span>
                                                <span className="text-gray-500">At least 8 characters</span>
                                            </motion.li>
                                        )}

                                        {formData.newPassword.length > 0 && !/[A-Z]/.test(formData.newPassword) && (
                                            <motion.li
                                                key="uppercase"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="text-gray-400">○</span>
                                                <span className="text-gray-500">One uppercase letter</span>
                                            </motion.li>
                                        )}

                                        {formData.newPassword.length > 0 && !/[a-z]/.test(formData.newPassword) && (
                                            <motion.li
                                                key="lowercase"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="text-gray-400">○</span>
                                                <span className="text-gray-500">One lowercase letter</span>
                                            </motion.li>
                                        )}

                                        {formData.newPassword.length > 0 && !/[0-9]/.test(formData.newPassword) && (
                                            <motion.li
                                                key="number"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="text-gray-400">○</span>
                                                <span className="text-gray-500">One number</span>
                                            </motion.li>
                                        )}

                                        {formData.newPassword.length > 0 && !/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) && (
                                            <motion.li
                                                key="special"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="text-gray-400">○</span>
                                                <span className="text-gray-500">One special character (!@#$%^&*)</span>
                                            </motion.li>
                                        )}
                                    </AnimatePresence>
                                </ul>
                            </div>
                        )}

                        <div className="relative">
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
                            {passwordMatchError && (
                                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                    <FaTimesCircle /> {passwordMatchError}
                                </p>
                            )}
                            {!passwordMatchError && formData.confirmPassword && passwordsMatch && (
                                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                    <FaCheckCircle /> Passwords match
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Change Password Button */}
                    <div className="mt-6">
                        <Button
                            className="bg-teal-700 hover:bg-teal-800 text-white cursor-pointer"
                            disabled={isUpdatingProfile || isUpdatingPassword || !passwordsMatch || !!passwordMatchError || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                            onClick={handleChangePassword}
                        >
                            {(isUpdatingProfile || isUpdatingPassword) ? <Loader className="mr-1 animate-spin" /> : <FaLock className="mr-1" />} Change Password
                        </Button>
                    </div>
                </SettingsSection>
            </div>
        </div>
    )
}
