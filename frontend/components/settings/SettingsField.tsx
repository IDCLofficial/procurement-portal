interface SettingsFieldProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    helperText?: string;
    badge?: React.ReactNode;
    icon?: React.ReactNode;
}

export default function SettingsField({
    label,
    name,
    type = 'text',
    value,
    onChange,
    placeholder,
    disabled = false,
    helperText,
    badge,
    icon,
}: SettingsFieldProps) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-900 mb-2">
                {label}
            </label>
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                        disabled ? 'cursor-not-allowed opacity-60' : ''
                    } ${icon ? 'pr-10' : ''} ${badge ? 'pr-20' : ''}`}
                />
                {icon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {icon}
                    </div>
                )}
                {badge && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {badge}
                    </div>
                )}
            </div>
            {helperText && (
                <p className="mt-1.5 text-xs text-gray-500">
                    {helperText}
                </p>
            )}
        </div>
    );
}
