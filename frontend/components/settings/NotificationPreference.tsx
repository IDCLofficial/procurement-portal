interface NotificationPreferenceProps {
    title: string;
    description: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}

export default function NotificationPreference({
    title,
    description,
    enabled,
    onChange,
}: NotificationPreferenceProps) {
    return (
        <div className="flex items-center justify-between py-3.5">
            <div>
                <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{description}</p>
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
