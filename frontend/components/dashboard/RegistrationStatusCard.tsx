'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaCheckCircle, FaDownload, FaEdit, FaTimesCircle, FaExclamationCircle, FaBan, FaClock } from 'react-icons/fa';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FaInfo } from 'react-icons/fa6';

interface RegistrationStatusCardProps {
    registrationId: string;
    validUntil?: string;
    daysRemaining?: number;
    status: 'verified' | 'declined' | 'expired' | 'suspended' | 'pending';
    declineReason?: string;
    suspensionReason?: string;
    onDownloadCertificate?: () => void;
    onUpdateProfile?: () => void;
    onReapply?: () => void;
    onRenew?: () => void;
    onContactSupport?: () => void;
}

export default function RegistrationStatusCard({
    registrationId,
    validUntil,
    daysRemaining,
    status = 'verified',
    declineReason,
    suspensionReason,
    onDownloadCertificate,
    onUpdateProfile,
    onReapply,
    onRenew,
    onContactSupport,
}: RegistrationStatusCardProps) {
    // Status badge configuration
    const statusConfig = {
        verified: {
            badge: { bg: 'bg-green-50 border-green-200 bg-linear-to-b from-white to-green-50', text: 'text-green-700', icon: FaCheckCircle, label: 'verified' },
            cardBg: 'bg-white',
        },
        declined: {
            badge: { bg: 'bg-red-50 border-red-200 bg-linear-to-b from-white to-red-50', text: 'text-red-700', icon: FaTimesCircle, label: 'Declined' },
            cardBg: 'bg-white',
        },
        expired: {
            badge: { bg: 'bg-orange-50 border-orange-200 bg-linear-to-b from-white to-orange-50', text: 'text-orange-700', icon: FaExclamationCircle, label: 'Expired' },
            cardBg: 'bg-white',
        },
        suspended: {
            badge: { bg: 'bg-gray-50 border-red-200 bg-linear-to-b from-white to-red-50', text: 'text-gray-700', icon: FaBan, label: 'Suspended' },
            cardBg: 'bg-white',
        },
        pending: {
            badge: { bg: 'bg-yellow-50 border-yellow-200 bg-linear-to-b from-white to-yellow-50', text: 'text-yellow-700', icon: FaClock, label: 'Pending Review' },
            cardBg: 'bg-white',
        },
    };

    const config = statusConfig[status];
    const StatusIcon = config.badge.icon;

    return (
        <Card
            className={cn(
                `border`,
                config.cardBg,
                status === "declined" && "border-red-300",
                status === "suspended" && "border-red-300",
            )}
        >
            <CardContent className="px-6">
                <div className={cn("flex items-start justify-between")}>
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 mb-1">Registration Status</h2>
                        <p className="text-sm text-gray-500">Current status of your contractor registration</p>
                    </div>
                    <span className={`inline-flex border border-black/5 items-center gap-1.5 px-3 py-1 ${config.badge.bg} ${config.badge.text} text-xs font-medium rounded-full`}>
                        <StatusIcon className="text-xs" />
                        {config.badge.label}
                    </span>
                </div>

                <div className={cn("flex flex-wrap gap-4 mb-4 mt-10")}>
                    {/* Registration ID */}
                    <div className={`flex-1 min-w-64 ${status === 'verified' ? 'bg-linear-to-b from-white to-green-50 border-green-200' :
                        status === 'declined' ? 'bg-linear-to-b from-white to-red-50 border-red-200' :
                            status === 'expired' ? 'bg-linear-to-b from-white to-orange-50 border-orange-200' :
                                status === 'suspended' ? 'bg-linear-to-b from-white to-gray-50 border-gray-200' :
                                    'bg-linear-to-b from-white to-yellow-50 border-yellow-200'
                        } border rounded-lg p-4`}>
                        <div className="flex items-start gap-2">
                            <StatusIcon className={`${status === 'verified' ? 'text-green-600' :
                                status === 'declined' ? 'text-red-600' :
                                    status === 'expired' ? 'text-orange-600' :
                                        status === 'suspended' ? 'text-gray-600' :
                                            'text-yellow-600'
                                } text-lg mt-0.5`} />
                            <div className="flex-1">
                                <p className={`text-xs font-medium mb-1 ${status === 'verified' ? 'text-green-700' :
                                    status === 'declined' ? 'text-red-700' :
                                        status === 'expired' ? 'text-orange-700' :
                                            status === 'suspended' ? 'text-gray-700' :
                                                'text-yellow-700'
                                    }`}>Registration ID</p>
                                <p className={`text-sm font-semibold ${status === 'verified' ? 'text-green-900' :
                                    status === 'declined' ? 'text-red-900' :
                                        status === 'expired' ? 'text-orange-900' :
                                            status === 'suspended' ? 'text-gray-900' :
                                                'text-yellow-900'
                                    }`}>{registrationId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Valid Until - Only show for verified/expired/suspended */}
                    {(status === 'verified' || status === 'expired') && validUntil && (
                        <div className={cn(
                            "flex-1 min-w-64 bg-linear-to-b from-white to-blue-50 border border-blue-200 rounded-lg p-4",
                            daysRemaining && daysRemaining <= 30 && 'bg-red-50 border-red-200 to-red-50'
                        )}>
                            <div className="flex items-start gap-2">
                                <svg
                                    className={cn("w-5 h-5 text-blue-600 mt-0.5", daysRemaining && daysRemaining <= 30 && 'text-red-600')}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="flex-1">
                                    <p className={cn("text-xs text-blue-700 font-medium mb-1", daysRemaining && daysRemaining <= 30 && 'text-red-700')}>
                                        {status === 'expired' || daysRemaining && daysRemaining <= 30 ? 'Expired On' : 'Valid Until'}
                                    </p>
                                    <p className={cn("text-sm font-semibold text-blue-900", daysRemaining && daysRemaining <= 30 && 'text-red-900')}>{validUntil}</p>
                                    {daysRemaining !== undefined && status === 'verified' && (
                                        <p className={cn("text-xs text-blue-600 mt-0.5", daysRemaining && daysRemaining <= 30 && 'text-red-600')}>{daysRemaining} days remaining</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Decline/Suspension Reason Alert */}
                {(status === 'declined' && declineReason) && (
                    <div className="bg-linear-to-b from-white to-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 grid place-items-center bg-white rounded-full border border-blue-200">
                                <FaInfo className="text-blue-600 text-md shrink-0" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-red-900 mb-1">Reason for Decline</p>
                                <p className="text-sm text-red-800">{declineReason}</p>
                            </div>
                        </div>
                    </div>
                )}

                {(status === 'suspended' && suspensionReason) && (
                    <div className="bg-linear-to-b from-white to-gray-100 border border-gray-200 rounded-lg p-4 mb-5">
                        <div className="flex items-start gap-3">
                            <div className="h-8 w-8 grid place-items-center bg-white rounded-full border border-blue-200">
                                <FaInfo className="text-blue-600 text-md shrink-0" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 mb-1">Reason for Suspension</p>
                                <p className="text-sm text-gray-800">{suspensionReason}</p>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'expired' && (
                    <div className="bg-linear-to-b from-white to-orange-50 border border-orange-200 rounded-lg p-4 mb-5">
                        <div className="flex items-start gap-3">
                            <FaExclamationCircle className="text-orange-600 text-lg mt-0.5 shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-orange-900 mb-1">Registration Expired</p>
                                <p className="text-sm text-orange-800">Your registration has expired. Please renew to continue accessing services.</p>
                            </div>
                        </div>
                    </div>
                )}

                {status === 'pending' && (
                    <div className="bg-linear-to-b from-white to-yellow-50 border border-yellow-200 rounded-lg p-4 mb-5">
                        <div className="flex items-start gap-3">
                            <FaClock className="text-yellow-600 text-lg mt-0.5 shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-yellow-900 mb-1">Application Under Review</p>
                                <p className="text-sm text-yellow-800">Your application is currently being reviewed by our team. You will be notified once the review is complete.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons - Dynamic based on status */}
                <div className="flex gap-3 flex-wrap mt-2">
                    {status === 'verified' && (
                        <>
                            {daysRemaining && daysRemaining > 30 && <Button
                                className="min-w-64 bg-teal-700 hover:bg-teal-800 text-white flex-1"
                                onClick={onDownloadCertificate}
                            >
                                <FaDownload className="mr-2 text-sm" />
                                Download Certificate
                            </Button>}
                            <Link href="/dashboard/settings?tab=account" className="flex-1 min-w-64">
                                <Button
                                    variant="outline"
                                    className="w-full cursor-pointer"
                                >
                                    <FaEdit className="mr-2 text-sm" />
                                    Update Profile
                                </Button>
                            </Link>
                        </>
                    )}

                    {status === 'expired' && (
                        <>
                            <Button
                                className="min-w-64 flex-1 bg-teal-700 hover:bg-teal-800 text-white"
                                onClick={onRenew}
                            >
                                <FaEdit className="mr-2 text-sm" />
                                Renew Registration
                            </Button>
                            <Link href="/dashboard/settings?tab=account" className="flex-1 min-w-64">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                >
                                    <FaEdit className="mr-2 text-sm" />
                                    Update Profile
                                </Button>
                            </Link>
                        </>
                    )}

                    {status === 'declined' && (
                        <>
                            <Button
                                className="min-w-64 flex-1 bg-teal-700 hover:bg-teal-800 text-white mt-2"
                                onClick={onReapply}
                            >
                                <FaEdit className="mr-2 text-sm" />
                                Reapply for Registration
                            </Button>
                        </>
                    )}

                    {status === 'suspended' && (
                        <>
                            <Button
                                className="min-w-64 flex-1 bg-teal-700 hover:bg-teal-800 text-white"
                                onClick={onContactSupport}
                            >
                                Contact Support
                            </Button>
                            <Button
                                variant="outline"
                                className="min-w-64 flex-1"
                                onClick={onUpdateProfile}
                            >
                                <FaEdit className="mr-2 text-sm" />
                                View Details
                            </Button>
                        </>
                    )}

                    {status === 'pending' && (
                        <>
                            <Link href="/dashboard/registration-status" className="min-w-64 flex-1">
                                <Button
                                    className="w-full bg-teal-700 hover:bg-teal-800 text-white"
                                >
                                    <FaClock className="mr-2 text-sm" />
                                    View Application Status
                                </Button>
                            </Link>
                            <Link href="/dashboard/settings?tab=account" className="min-w-64 flex-1">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                >
                                    <FaEdit className="mr-2 text-sm" />
                                    Update Profile
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
