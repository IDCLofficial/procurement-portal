import SettingsSection from "@/components/settings/SettingsSection";
import NotificationToggle from "@/components/settings/NotificationToggle";
import NotificationPreference from "@/components/settings/NotificationPreference";
import { useState } from "react";

export default function NotificationTab() {
    // Notification preferences state
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        documentExpiry: true,
        renewalReminders: true,
        applicationUpdates: true,
        paymentConfirmations: true,
        systemUpdates: false,
        reminderFrequency: '7days',
    });

    const handleNotificationToggle = (field: string, value: boolean) => {
        setNotifications((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // const handleReminderFrequencyChange = (value: string) => {
    //     setNotifications((prev) => ({
    //         ...prev,
    //         reminderFrequency: value,
    //     }));
    // };

    return (
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
                    {/* <div className="mt-6 pt-6 border-t border-gray-100">
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
                    </div> */}
                </SettingsSection>
            </div>
        </div>
    )
}
