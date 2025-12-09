'use client';

interface StepPlaceholderProps {
    stepNumber: number;
    stepName: string;
}

export default function StepPlaceholder({ stepNumber, stepName }: StepPlaceholderProps) {
    return (
        <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-gray-400">{stepNumber}</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{stepName}</h3>
            <p className="text-gray-600">This step is coming soon...</p>
        </div>
    );
}
