import SettingsSection from "@/components/settings/SettingsSection";
import NotificationToggle from "@/components/settings/NotificationToggle";
import NotificationPreference from "@/components/settings/NotificationPreference";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUpdateNotificationSettingsMutation } from "@/store/api/vendor.api";
import { NotificationSettings } from "@/store/api/types";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { FaCheck, FaMoneyBillWave } from "react-icons/fa6";
import { FaFileAlt, FaSync, FaSyncAlt } from "react-icons/fa";

export default function NotificationTab({ notifications: initialNotifications }: { notifications: NotificationSettings }) {
    const [notifications, setNotifications] = useState(initialNotifications);

    // Debounce the notifications state
    const debouncedNotifications = useDebounce(notifications, 500);

    const [updateNotificationSettings, { isLoading: isUpdatingNotificationSettings, isSuccess }] = useUpdateNotificationSettingsMutation();
    const isInitialMount = useRef(true);
    const lastChangedField = useRef<string>('');
    const skipUpdate = useRef<boolean>(true);

    // Update API whenever debounced notifications change
    useEffect(() => {
        // Skip API call on initial mount
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (skipUpdate.current) {
            return;
        }

        const updateSettings = async () => {
            await updateNotificationSettings(debouncedNotifications);
        };

        updateSettings();
    }, [debouncedNotifications, updateNotificationSettings, skipUpdate]);

    // Show success toast when update completes
    useEffect(() => {
        if (isSuccess && lastChangedField.current) {
            const fieldLabels: Record<string, string> = {
                email: 'Email Notifications',
                documentExpiryAlerts: 'Document Expiry Alerts',
                renewalReminders: 'Renewal Reminders',
                applicationUpdates: 'Application Updates',
                paymentConfirmations: 'Payment Confirmations',
                systemUpdates: 'System Updates',
                loginAlerts: 'Login Alerts',
            };
            skipUpdate.current = true;

            const fieldLabel = fieldLabels[lastChangedField.current] || 'Notification settings';
            toast.success(`${fieldLabel} updated successfully`);
        }
    }, [isSuccess]);

    const handleNotificationToggle = useCallback((field: string, value: boolean) => {
        lastChangedField.current = field;
        skipUpdate.current = false;
        setNotifications(prev => {
            // Handle nested structure for notificationChannels and notificationPreferences
            if (field === 'email') {
                return {
                    ...prev,
                    notificationChannels: {
                        ...prev.notificationChannels,
                        email: value
                    }
                };
            } else {
                return {
                    ...prev,
                    notificationPreferences: {
                        ...prev.notificationPreferences,
                        [field]: value
                    }
                };
            }
        });
    }, []);

    return (
        <div className='grid gap-6'>
            {/* Loading indicator */}
            {isUpdatingNotificationSettings && (
                <div className="bg-linear-to-b from-transparent to-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-blue-700">Saving notification preferences...</span>
                </div>
            )}

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
                            enabled={notifications.notificationChannels.email}
                            onChange={(value) => handleNotificationToggle('email', value)}
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
                            Icon={FaFileAlt}
                            description="Get notified when documents are about to expire"
                            enabled={notifications.notificationPreferences.documentExpiryAlerts}
                            onChange={(value) => handleNotificationToggle('documentExpiryAlerts', value)}
                        />
                        <NotificationPreference
                            title="Renewal Reminders"
                            Icon={FaSync}
                            description="Reminders for annual registration renewal"
                            enabled={notifications.notificationPreferences.renewalReminders}
                            onChange={(value) => handleNotificationToggle('renewalReminders', value)}
                        />
                        <NotificationPreference
                            title="Application Updates"
                            Icon={FaMoneyBillWave}
                            description="Status updates on your applications"
                            enabled={notifications.notificationPreferences.applicationUpdates}
                            onChange={(value) => handleNotificationToggle('applicationUpdates', value)}
                        />
                        <NotificationPreference
                            title="Payment Confirmations"
                            Icon={FaCheck}
                            description="Receipts and payment confirmations"
                            enabled={notifications.notificationPreferences.paymentConfirmations}
                            onChange={(value) => handleNotificationToggle('paymentConfirmations', value)}
                        />
                        <NotificationPreference
                            title="System Updates"
                            Icon={FaSyncAlt}
                            description="Platform maintenance and new features"
                            enabled={notifications.notificationPreferences.systemUpdates}
                            onChange={(value) => handleNotificationToggle('systemUpdates', value)}
                        />
                    </div>
                </SettingsSection>
            </div>
        </div>
    )
}