import React, { useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Monitor, Smartphone, MapPin, Clock, Loader2, AlertCircle, Shield, Loader } from 'lucide-react';
import SettingsSection from '@/components/settings/SettingsSection';
import ComingSoonSection from '@/components/settings/ComingSoonSection';
import { NotificationSettings } from '@/store/api/types';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/public-service/AuthProvider';
import { useDeactivateVendorMutation, useGetLoginHistoryQuery, useUpdateNotificationSettingsMutation } from '@/store/api/vendor.api';
import DangerZone from '@/components/settings/DangerZone';
import { useDebounce } from '@/hooks/useDebounce';
import { toValidJSDate } from '@/lib';
import { formatDate } from 'date-fns';


interface SecurityTabProps {
    notifications: NotificationSettings;
}

export default function SecurityTab({ notifications }: SecurityTabProps) {
    const [isLoginHistoryOpen, setIsLoginHistoryOpen] = React.useState(false);
    const { logout } = useAuth();
    const [deactivateVendor, { isLoading: isDeactivating }] = useDeactivateVendorMutation();
    const [updateNotificationSettings, { isLoading: isUpdatingSettings, isSuccess }] = useUpdateNotificationSettingsMutation();
    const { data: loginHistory, isLoading: isLoginHistoryLoading, isError: isLoginHistoryError, refetch: refetchLoginHistory, isFetching: isLoginHistoryFetching } = useGetLoginHistoryQuery();

    // Security preferences state
    const [loginAlerts, setLoginAlerts] = React.useState(notifications.notificationPreferences.loginAlerts);

    // Debounce the login alerts state
    const debouncedLoginAlerts = useDebounce(loginAlerts, 500);

    const skipUpdate = useRef<boolean>(true);
    const isInitialMount = useRef(true);

    // Update API whenever debounced login alerts change
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
            await updateNotificationSettings({
                notificationPreferences: {
                    ...notifications.notificationPreferences,
                    loginAlerts: debouncedLoginAlerts,
                },
                notificationChannels: notifications.notificationChannels
            });
        };

        updateSettings();
    }, [debouncedLoginAlerts, updateNotificationSettings, notifications, skipUpdate]);

    // Show success toast when update completes
    useEffect(() => {
        if (isSuccess) {
            skipUpdate.current = true;
            toast.success('Login Alerts updated successfully');
        }
    }, [isSuccess]);

    const handleLoginAlertsToggle = useCallback(() => {
        skipUpdate.current = false;
        setLoginAlerts(prev => !prev);
    }, []);

    const handleViewLoginHistory = () => {
        setIsLoginHistoryOpen(true);
        refetchLoginHistory();
    };

    const handleDeactivateAccount = async () => {
        try {
            toast.loading('Deactivating your account...', { id: 'deactivate-account' });
            const response = await deactivateVendor();

            if ('error' in response) {
                throw new Error('Failed to deactivate account');
            }

            toast.dismiss('deactivate-account');
            toast.success('Account deactivated successfully');

            logout();
        } catch (error) {
            console.error('Deactivation error:', error);
            toast.dismiss('deactivate-account');
            toast.error('Failed to deactivate account. Please try again.');
        }
    };

    const handleRetryLoginHistory = () => {
        refetchLoginHistory();
    };

    const renderLoginHistoryContent = () => {
        // Loading State
        if (isLoginHistoryLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
                    <p className="mt-4 text-sm font-medium text-gray-900">Loading login history...</p>
                    <p className="mt-1 text-xs text-gray-500">Please wait while we fetch your activity</p>
                </div>
            );
        }

        // Error State
        if (isLoginHistoryError) {
            return (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                    <div className="rounded-full bg-red-100 p-3">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-gray-900">Failed to load login history</p>
                    <p className="mt-1 text-xs text-gray-500 text-center max-w-sm">
                        We couldn&apos;t retrieve your login history. Please check your connection and try again.
                    </p>
                    <Button
                        onClick={handleRetryLoginHistory}
                        className="mt-6"
                    >
                        Try Again
                    </Button>
                </div>
            );
        }

        // Empty State
        if (!loginHistory || loginHistory.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                    <div className="rounded-full bg-gray-100 p-3">
                        <Shield className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-gray-900">No login history found</p>
                    <p className="mt-1 text-xs text-gray-500 text-center max-w-sm">
                        There are no recorded login attempts for your account yet.
                    </p>
                </div>
            );
        }

        // Success State with Data
        return (
            <>
                <div className="space-y-3 mt-4">
                    {isLoginHistoryFetching && <div className="flex justify-center items-center">
                        <span className='animate-pulse'>Updating login history...</span>
                        <Loader className="ml-2 h-4 w-4 animate-spin" />
                    </div>}
                    {loginHistory.map((login) => (
                        <div
                            key={login.id}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    {login.deviceType.toLowerCase().includes('mobile') ? (
                                        <Smartphone className="h-5 w-5 text-gray-600" />
                                    ) : (
                                        <Monitor className="h-5 w-5 text-gray-600" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="font-medium text-gray-900">{login.device}</p>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {login.location}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    {formatDate(toValidJSDate(login.timestamp), 'HH:mm:ss')}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full whitespace-nowrap">
                                            Success
                                        </span>
                                    </div>

                                    <div className="mt-2 text-xs text-gray-400">
                                        <p>{formatDate(toValidJSDate(login.date), 'dd MMM yyyy')}</p>
                                        <p>IP Address: {login.ip}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                        If you notice any suspicious activity, please change your password immediately
                    </p>
                </div>
            </>
        );
    };

    return (
        <div className="grid gap-6 max-w-4xl mx-auto p-6">
            {/* Loading indicator */}
            {isUpdatingSettings && (
                <div className="bg-linear-to-b from-transparent to-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-blue-700">Saving security preferences...</span>
                </div>
            )}

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
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Security Preferences</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage your account security settings</p>
                    </div>

                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium text-gray-900">Login Alerts</p>
                            <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                        </div>
                        <button
                            onClick={handleLoginAlertsToggle}
                            className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${loginAlerts ? 'bg-theme-green' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${loginAlerts ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* View Login History */}
                    {loginAlerts && <div className="pt-4 border-t border-gray-100">
                        <Button
                            onClick={handleViewLoginHistory}
                            variant="outline"
                            className="w-full cursor-pointer"
                        >
                            View Login History
                        </Button>
                    </div>}
                </div>
            </div>

            {/* Danger Zone */}
            <DangerZone
                isLoading={isDeactivating}
                onDeactivate={handleDeactivateAccount}
            />

            {/* Login History Dialog */}
            <Dialog open={isLoginHistoryOpen} onOpenChange={setIsLoginHistoryOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Login History</DialogTitle>
                        <DialogDescription>
                            Review your recent account login activity
                        </DialogDescription>
                    </DialogHeader>

                    {renderLoginHistoryContent()}
                </DialogContent>
            </Dialog>
        </div>
    );
}