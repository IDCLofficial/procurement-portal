'use client';

import { FaInfoCircle } from 'react-icons/fa';

interface Guideline {
    text: string;
}

interface ProfileUpdateGuidelinesProps {
    guidelines: Guideline[];
}

export default function ProfileUpdateGuidelines({ guidelines }: ProfileUpdateGuidelinesProps) {
    return (
        <div className="bg-linear-to-b from-transparent to-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <FaInfoCircle className="text-blue-600 text-xs" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">Profile Update Guidelines:</h3>
                    <ul className="space-y-1">
                        {guidelines.map((guideline, index) => (
                            <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                                <span className="text-blue-600 mt-0.5">•</span>
                                <span className="flex-1">{guideline.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
