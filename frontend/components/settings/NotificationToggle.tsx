import { FaEnvelope, FaMobileAlt } from 'react-icons/fa';

interface NotificationToggleProps {
    icon: 'email' | 'sms';
    title: string;
    description: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}

export default function NotificationToggle({
    icon,
    title,
    description,
    enabled,
    onChange,
}: NotificationToggleProps) {
    const IconComponent = icon === 'email' ? FaEnvelope : FaMobileAlt;

    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 text-gray-400">
                    <IconComponent className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={() => onChange(!enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                    enabled ? 'bg-teal-600' : 'bg-gray-200'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );
}
