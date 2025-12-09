'use client';

import { FaCheck } from 'react-icons/fa';

interface Step {
    number: number;
    title: string;
    subtitle: string;
    status: 'completed' | 'active' | 'pending';
}

interface StepIndicatorProps {
    steps: Step[];
}

export default function StepIndicator({ steps }: StepIndicatorProps) {
    const completedSteps = steps.filter((step) => step.status === 'completed').length;
    const activeStepIndex = steps.findIndex((step) => step.status === 'active');
    const progressPercentage = activeStepIndex >= 0 
        ? ((completedSteps + 0.5) / steps.length) * 100 
        : (completedSteps / steps.length) * 100;

    return (
        <div className="bg-white border-b border-gray-200 py-6">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between max-w-4xl mb-5 mx-auto">
                    {steps.map((step) => (
                        <div key={step.number} className="flex items-center">
                            <div className="flex flex-row items-center flex-1 gap-2">
                                {/* Step Circle */}
                                <div
                                    className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold ${
                                        step.status === 'completed'
                                            ? 'bg-teal-600 text-white'
                                            : step.status === 'active'
                                            ? 'bg-theme-green text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                                >
                                    {step.status === 'completed' ? (
                                        <FaCheck className="text-sm" />
                                    ) : (
                                        step.number
                                    )}
                                </div>

                                {/* Step Text */}
                                <div className="text-left">
                                    <p
                                        className={`text-base md:whitespace-nowrap font-medium ${
                                            step.status === 'completed'
                                                ? 'text-gray-900'
                                                : step.status === 'active'
                                                ? 'text-theme-green'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-gray-400 md:whitespace-nowrap">{step.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='h-2 w-full bg-gray-300 max-w-4xl mx-auto rounded-3xl relative'>
                    <div 
                        className='h-full bg-theme-green rounded-3xl transition-all duration-300 ease-in-out'
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
