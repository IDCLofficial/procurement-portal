import { FaExclamationCircle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

interface TwoFactorStatusProps {
    enabled: boolean;
    onEnable: () => void;
}

export default function TwoFactorStatus({ enabled, onEnable }: TwoFactorStatusProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${
                        enabled 
                            ? 'bg-green-50 text-green-700' 
                            : 'bg-yellow-50 text-yellow-700'
                    }`}>
                        {!enabled && <FaExclamationCircle className="w-3 h-3" />}
                        <span>{enabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                        Enable 2FA for better security
                    </span>
                </div>
                {!enabled && (
                    <Button
                        onClick={onEnable}
                        className="bg-teal-700 hover:bg-teal-800 text-white"
                    >
                        Enable 2FA
                    </Button>
                )}
            </div>

            {!enabled && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900 font-medium mb-1">
                        How 2FA works:
                    </p>
                    <p className="text-sm text-blue-700">
                        After enabling, you&apos;ll receive a verification code via SMS or email each time you log in.
                    </p>
                </div>
            )}
        </div>
    );
}
