'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import TabNavigation from '@/components/profile/TabNavigation';
import SettingsSection from '@/components/settings/SettingsSection';
import SettingsField from '@/components/settings/SettingsField';
import VerifiedBadge from '@/components/settings/VerifiedBadge';
import NotificationToggle from '@/components/settings/NotificationToggle';
import NotificationPreference from '@/components/settings/NotificationPreference';
// import TwoFactorStatus from '@/components/settings/TwoFactorStatus';
import SecurityPreference from '@/components/settings/SecurityPreference';
import DangerZone from '@/components/settings/DangerZone';
import ComingSoonSection from '@/components/settings/ComingSoonSection';
import SubHeader from '@/components/SubHeader';
import { useAuth } from '@/components/providers/public-service/AuthProvider';
import { FaUser, FaBell, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AccountSettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Notification preferences state
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        smsNotifications: false,
        documentExpiry: true,
        renewalReminders: true,
        applicationUpdates: true,
        paymentConfirmations: true,
        systemUpdates: false,
        reminderFrequency: '7days',
    });

    // Security preferences state
    const [security, setSecurity] = useState({
        twoFactorEnabled: false,
        loginAlerts: true,
        sessionTimeout: '30min',
    });

    // Form state
    const [formData, setFormData] = useState({
        fullName: user?.fullname || '',
        email: user?.email || '',
        phone: user?.phoneNo || '',
        accountRole: 'Company Administrator',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const tabs = [
        {
            id: 'account',
            label: 'Account',
            icon: <FaUser />,
        },
        {
            id: 'notifications',
            label: 'Notifications',
            icon: <FaBell />,
        },
        {
            id: 'security',
            label: 'Security',
            icon: <FaShieldAlt />,
        },
    ];

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

    const handleNotificationToggle = (field: string, value: boolean) => {
        setNotifications((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleReminderFrequencyChange = (value: string) => {
        setNotifications((prev) => ({
            ...prev,
            reminderFrequency: value,
        }));
    };

    const handleSecurityToggle = (field: string, value: boolean) => {
        setSecurity((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSessionTimeoutChange = (value: string) => {
        setSecurity((prev) => ({
            ...prev,
            sessionTimeout: value,
        }));
    };

    const handleEnable2FA = () => {
        console.log('Enabling 2FA...');
        // Handle 2FA setup logic
        setSecurity((prev) => ({
            ...prev,
            twoFactorEnabled: true,
        }));
    };

    const handleDeactivateAccount = () => {
        console.log('Deactivating account...');
        // Handle account deactivation logic
    };

    const handleViewLoginHistory = () => {
        console.log('Viewing login history...');
        // Handle view login history logic
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <SubHeader
                title='Account Settings'
                hasBackButton
            />

            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Tab Navigation */}
                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {/* Form Content */}
                <div>
                    {activeTab === 'account' && (
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
                                            onChange={(value: string) => handleFieldChange('email', value)}
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
                                            className="bg-teal-700 hover:bg-teal-800 text-white"
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
                    )}

                    {activeTab === 'notifications' && (
                        <div className='grid gap-6'>
                            {/* Notification Channels */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <SettingsSection
                                    title="Notification Channels"
                                    description="Choose how you want to receive notifications"
                                >
                                    <div className="space-y-1">
                                        <NotificationToggle
                                            icon="email"
                                            title="Email Notifications"
                                            description="Receive notifications via email"
                                            enabled={notifications.emailNotifications}
                                            onChange={(value) => handleNotificationToggle('emailNotifications', value)}
                                        />
                                        <NotificationToggle
                                            icon="sms"
                                            title="SMS Notifications"
                                            description="Receive critical alerts via SMS"
                                            enabled={notifications.smsNotifications}
                                            onChange={(value) => handleNotificationToggle('smsNotifications', value)}
                                        />
                                    </div>
                                </SettingsSection>
                            </div>

                            {/* Notification Preferences */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <SettingsSection
                                    title="Notification Preferences"
                                    description="Customize what notifications you receive"
                                >
                                    <div className="space-y-1">
                                        <NotificationPreference
                                            title="Document Expiry Alerts"
                                            description="Get notified when documents are about to expire"
                                            enabled={notifications.documentExpiry}
                                            onChange={(value) => handleNotificationToggle('documentExpiry', value)}
                                        />
                                        <NotificationPreference
                                            title="Renewal Reminders"
                                            description="Reminders for annual registration renewal"
                                            enabled={notifications.renewalReminders}
                                            onChange={(value) => handleNotificationToggle('renewalReminders', value)}
                                        />
                                        <NotificationPreference
                                            title="Application Updates"
                                            description="Status updates on your applications"
                                            enabled={notifications.applicationUpdates}
                                            onChange={(value) => handleNotificationToggle('applicationUpdates', value)}
                                        />
                                        <NotificationPreference
                                            title="Payment Confirmations"
                                            description="Receipts and payment confirmations"
                                            enabled={notifications.paymentConfirmations}
                                            onChange={(value) => handleNotificationToggle('paymentConfirmations', value)}
                                        />
                                        <NotificationPreference
                                            title="System Updates"
                                            description="Platform maintenance and new features"
                                            enabled={notifications.systemUpdates}
                                            onChange={(value) => handleNotificationToggle('systemUpdates', value)}
                                        />
                                    </div>

                                    {/* Reminder Frequency */}
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Reminder Frequency
                                        </label>
                                        <select
                                            value={notifications.reminderFrequency}
                                            onChange={(e) => handleReminderFrequencyChange(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                        >
                                            <option value="7days">7 days before expiry</option>
                                            <option value="14days">14 days before expiry</option>
                                            <option value="30days">30 days before expiry</option>
                                            <option value="60days">60 days before expiry</option>
                                        </select>
                                        <p className="mt-1.5 text-xs text-gray-500">
                                            When to send first reminder for document expiry
                                        </p>
                                    </div>
                                </SettingsSection>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className='grid gap-6'>
                            {/* Two-Factor Authentication */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <SettingsSection
                                    title="Two-Factor Authentication"
                                    description="Add an extra layer of security to your account"
                                >
                                    <ComingSoonSection
                                        title="Two-Factor Authentication"
                                        description="Enhanced security with 2FA will be available soon. You'll be able to secure your account with SMS or email verification codes."
                                    />
                                </SettingsSection>
                            </div>

                            {/* Security Preferences */}
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <SettingsSection
                                    title="Security Preferences"
                                    description="Manage your account security settings"
                                >
                                    <div className="space-y-1">
                                        <SecurityPreference
                                            title="Login Alerts"
                                            description="Get notified of new login attempts"
                                            enabled={security.loginAlerts}
                                            onChange={(value) => handleSecurityToggle('loginAlerts', value)}
                                        />
                                    </div>

                                    {/* Session Timeout */}
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            Session Timeout
                                        </label>
                                        <select
                                            value={security.sessionTimeout}
                                            onChange={(e) => handleSessionTimeoutChange(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                        >
                                            <option value="15min">15 minutes</option>
                                            <option value="30min">30 minutes</option>
                                            <option value="1hour">1 hour</option>
                                            <option value="2hours">2 hours</option>
                                        </select>
                                        <p className="mt-1.5 text-xs text-gray-500">
                                            Automatically log out after period of inactivity
                                        </p>
                                    </div>

                                    {/* View Login History */}
                                    <div className="mt-6 pt-6 border-t border-gray-100">
                                        <Button
                                            onClick={handleViewLoginHistory}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            View Login History
                                        </Button>
                                    </div>
                                </SettingsSection>
                            </div>

                            {/* Danger Zone */}
                            <DangerZone onDeactivate={handleDeactivateAccount} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
