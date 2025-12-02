interface SettingsSectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export default function SettingsSection({ title, description, children }: SettingsSectionProps) {
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-base font-semibold text-gray-900 mb-1">
                    {title}
                </h2>
                <p className="text-sm text-gray-500">
                    {description}
                </p>
            </div>
            {children}
        </div>
    );
}
