import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Monitor, Smartphone, MapPin, Clock } from 'lucide-react';
import SettingsSection from '@/components/settings/SettingsSection';
import ComingSoonSection from '@/components/settings/ComingSoonSection';
import { LoginHistory } from '@/store/api/types';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/public-service/AuthProvider';
import { useDeactivateVendorMutation } from '@/store/api/vendor.api';
import DangerZone from '@/components/settings/DangerZone';

// Dummy login history data
const loginHistoryData: LoginHistory[] = [
    {
        id: 1,
        device: 'Chrome on Windows',
        deviceType: 'desktop',
        location: 'Lagos, Nigeria',
        ip: '197.210.xxx.xxx',
        timestamp: '2 hours ago',
        date: 'Dec 22, 2025 at 2:30 PM',
        status: 'success',
    },
    {
        id: 2,
        device: 'Safari on iPhone',
        deviceType: 'mobile',
        location: 'Lagos, Nigeria',
        ip: '197.210.xxx.xxx',
        timestamp: '1 day ago',
        date: 'Dec 21, 2025 at 9:15 AM',
        status: 'success',
    },
    {
        id: 3,
        device: 'Chrome on MacOS',
        deviceType: 'desktop',
        location: 'Abuja, Nigeria',
        ip: '105.112.xxx.xxx',
        timestamp: '3 days ago',
        date: 'Dec 19, 2025 at 4:45 PM',
        status: 'success',
    },
    {
        id: 4,
        device: 'Firefox on Windows',
        deviceType: 'desktop',
        location: 'Port Harcourt, Nigeria',
        ip: '102.89.xxx.xxx',
        timestamp: '5 days ago',
        date: 'Dec 17, 2025 at 11:20 AM',
        status: 'success',
    },
    {
        id: 5,
        device: 'Chrome on Android',
        deviceType: 'mobile',
        location: 'Lagos, Nigeria',
        ip: '197.210.xxx.xxx',
        timestamp: '1 week ago',
        date: 'Dec 15, 2025 at 6:30 PM',
        status: 'success',
    },
];

export default function SecurityTab() {
    const [isLoginHistoryOpen, setIsLoginHistoryOpen] = React.useState(false);
    const { logout } = useAuth();
    const [deactivateVendor, { isLoading: isDeactivating }] = useDeactivateVendorMutation();

    // Security preferences state
    const [security, setSecurity] = React.useState({
        twoFactorEnabled: false,
        loginAlerts: true,
    });

    const handleSecurityToggle = (field: string, value: boolean) => {
        setSecurity((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleViewLoginHistory = () => {
        setIsLoginHistoryOpen(true);
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

    return (
        <div className="grid gap-6 max-w-4xl mx-auto p-6">
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
                            onClick={() => handleSecurityToggle('loginAlerts', !security.loginAlerts)}
                            className={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${security.loginAlerts ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${security.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* View Login History */}
                    <div className="pt-4 border-t border-gray-100">
                        <Button
                            onClick={handleViewLoginHistory}
                            variant="outline"
                            className="w-full cursor-pointer"
                        >
                            View Login History
                        </Button>
                    </div>
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

                    <div className="space-y-3 mt-4">
                        {loginHistoryData.map((login) => (
                            <div
                                key={login.id}
                                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        {login.deviceType === 'desktop' ? (
                                            <Monitor className="h-5 w-5 text-gray-600" />
                                        ) : (
                                            <Smartphone className="h-5 w-5 text-gray-600" />
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
                                                        {login.timestamp}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full whitespace-nowrap">
                                                Success
                                            </span>
                                        </div>

                                        <div className="mt-2 text-xs text-gray-400">
                                            <p>{login.date}</p>
                                            <p>IP: {login.ip}</p>
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
                </DialogContent>
            </Dialog>
        </div>
    );
}