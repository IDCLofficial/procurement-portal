'use client';

interface FormSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export default function FormSection({ title, description, children }: FormSectionProps) {
    return (
        <div className="mb-8">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-900 mb-1">{title}</h2>
                {description && (
                    <p className="text-sm text-gray-500">{description}</p>
                )}
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}
