'use client';

import { FaCheckCircle } from 'react-icons/fa';

interface SuccessAlertProps {
    title: string;
    message: string;
    linkText?: string;
    onLinkClick?: () => void;
}

export default function SuccessAlert({ title, message, linkText, onLinkClick }: SuccessAlertProps) {
    return (
        <div className="bg-linear-to-b from-white to-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
                <FaCheckCircle className="text-green-600 text-lg mt-0.5 shrink-0" />
                <div className="flex-1">
                    <h4 className="text-sm font-semibold text-green-900 mb-1">{title}</h4>
                    <p className="text-sm text-green-800">
                        {message}
                        {linkText && onLinkClick && (
                            <>
                                {' '}
                                <button
                                    onClick={onLinkClick}
                                    className="text-teal-600 hover:text-teal-700 font-medium underline"
                                >
                                    {linkText}
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
