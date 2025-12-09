'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaCheckCircle, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

interface VerificationModalProps {
    contractor: {
        name: string;
        status: 'approved' | 'pending' | 'suspended';
        id: string;
        expiryDate: string;
        sector: string;
        grade: string;
    };
    isOpen: boolean;
    onClose: () => void;
}

export default function VerificationModal({ contractor, isOpen, onClose }: VerificationModalProps) {
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (!isOpen) return;

        // Auto-close after 5 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        // Progress bar animation
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 2;
            });
        }, 100);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'approved':
                return {
                    icon: <FaCheckCircle className="h-16 w-16 text-green-600" />,
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-900',
                    badgeClass: 'bg-green-100 text-green-800 border-green-200',
                    title: 'Verified Contractor',
                    message: 'This contractor is registered and approved by the Imo State Bureau of Public Private Partnerships & Investments (BPPPI).',
                };
            case 'pending':
                return {
                    icon: <FaExclamationTriangle className="h-16 w-16 text-yellow-600" />,
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-900',
                    badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    title: 'Pending Verification',
                    message: 'This contractor registration is currently pending approval.',
                };
            case 'suspended':
                return {
                    icon: <FaTimes className="h-16 w-16 text-red-600" />,
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-900',
                    badgeClass: 'bg-red-100 text-red-800 border-red-200',
                    title: 'Suspended Contractor',
                    message: 'This contractor has been suspended. Please contact BPPPI for more information.',
                };
            default:
                return {
                    icon: <FaExclamationTriangle className="h-16 w-16 text-gray-600" />,
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    textColor: 'text-gray-900',
                    badgeClass: 'bg-gray-100 text-gray-800 border-gray-200',
                    title: 'Unknown Status',
                    message: 'Unable to verify contractor status.',
                };
        }
    };

    const config = getStatusConfig(contractor.status);

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
            />
            
            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <Card className="w-full max-w-md pointer-events-auto animate-in zoom-in-95 fade-in duration-300 shadow-2xl relative">
                    <CardContent className="pt-6 pb-4">
                        {/* Close Button */}
                        <Button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors bg-white"
                            aria-label="Close"
                        >
                            <FaTimes className="h-4 w-4 text-gray-500" />
                        </Button>

                        {/* Content */}
                        <div className="text-center space-y-4">
                            {/* Icon */}
                            <div className="flex justify-center">
                                <div className={`w-24 h-24 rounded-full ${config.bgColor} border-4 ${config.borderColor} flex items-center justify-center`}>
                                    {config.icon}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <h2 className={`text-2xl font-bold ${config.textColor} mb-2`}>
                                    {config.title}
                                </h2>
                                <p className="text-gray-600 text-sm">
                                    {config.message}
                                </p>
                            </div>

                            {/* Contractor Details */}
                            <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 space-y-3`}>
                                <div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {contractor.name}
                                    </p>
                                </div>
                                
                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                    <Badge className={config.badgeClass}>
                                        <FaCheckCircle className="h-3 w-3" />
                                        <span className="capitalize">{contractor.status}</span>
                                    </Badge>
                                    <Badge variant="outline">{contractor.sector}</Badge>
                                    <Badge variant="outline">Grade {contractor.grade}</Badge>
                                </div>

                                <div className="space-y-1 text-sm">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Registration ID:</span>{' '}
                                        <span className="font-mono">{contractor.id}</span>
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Valid Until:</span>{' '}
                                        {contractor.expiryDate}
                                    </p>
                                </div>
                            </div>

                            {/* Action Button */}
                            <Button
                                onClick={onClose}
                                className="w-full bg-theme-green hover:bg-theme-green/90"
                            >
                                View Full Details
                            </Button>

                            {/* Progress Bar */}
                            <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                    className="absolute inset-y-0 left-0 bg-theme-green transition-all duration-100 ease-linear"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                Auto-closing in {Math.ceil(progress / 20)} seconds
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
