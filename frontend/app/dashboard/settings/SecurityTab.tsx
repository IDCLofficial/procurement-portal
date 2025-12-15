import { useAuth } from '@/components/providers/public-service/AuthProvider';
import ComingSoonSection from '@/components/settings/ComingSoonSection';
import DangerZone from '@/components/settings/DangerZone';
import SecurityPreference from '@/components/settings/SecurityPreference';
import SettingsSection from '@/components/settings/SettingsSection';
import { Button } from '@/components/ui/button';
import { useDeactivateVendorMutation } from '@/store/api/vendor.api';
import React from 'react'
import { toast } from 'sonner';

export default function SecurityTab() {
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

    const handleViewLoginHistory = () => {
        console.log('Viewing login history...');
        // Handle view login history logic
    };
    return (
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
            <DangerZone
                isLoading={isDeactivating}
                onDeactivate={handleDeactivateAccount}
            />
        </div>
    )
}