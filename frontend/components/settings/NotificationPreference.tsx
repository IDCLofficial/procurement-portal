import { IconType } from "react-icons";

interface NotificationPreferenceProps {
    title: string;
    description: string;
    Icon: IconType;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}

export default function NotificationPreference({
    title,
    Icon,
    description,
    enabled,
    onChange,
}: NotificationPreferenceProps) {
    return (
        <div className="flex items-center justify-between py-3.5">
            <div className="flex items-start gap-2">
                <Icon className="w-5 h-5 mt-0.5 opacity-50"/>
                <div>
                    <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                </div>
            </div>
            <button
                type="button"
                onClick={() => onChange(!enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                    enabled ? 'bg-theme-green' : 'bg-gray-200'
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
