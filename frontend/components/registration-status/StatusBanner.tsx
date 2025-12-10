import { FaClock, FaCheckCircle, FaExclamationTriangle, FaHourglassHalf } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';

interface StatusBannerProps {
    submittedDate: string;
    reviewProgress?: number;
    applicationStatus: string;
}

export default function StatusBanner({ submittedDate, reviewProgress = 60, applicationStatus }: StatusBannerProps) {
    // Determine status styling and content
    const getStatusConfig = () => {
        switch (applicationStatus) {
            case 'Approved':
                return {
                    icon: FaCheckCircle,
                    iconColor: 'text-green-600',
                    bgClass: 'bg-linear-to-b from-white to-green-100 border-green-300',
                    title: 'Application Approved',
                    badgeClass: 'bg-green-200 text-green-800',
                    badgeText: 'Approved',
                    textColor: 'text-green-900',
                    message: `Your registration application was approved! Submitted on ${submittedDate}. You will receive your certificate shortly.`,
                    progressColor: 'bg-green-600',
                    progressBgColor: 'bg-green-200',
                };
            case 'Rejected':
                return {
                    icon: FaExclamationTriangle,
                    iconColor: 'text-red-600',
                    bgClass: 'bg-linear-to-b from-white to-red-100 border-red-300',
                    title: 'Application Rejected',
                    badgeClass: 'bg-red-200 text-red-800',
                    badgeText: 'Rejected',
                    textColor: 'text-red-900',
                    message: `Your registration application was rejected. Submitted on ${submittedDate}. Please contact support for more information.`,
                    progressColor: 'bg-red-600',
                    progressBgColor: 'bg-red-200',
                };
            case 'Forwarded to Registrar':
                return {
                    icon: FaHourglassHalf,
                    iconColor: 'text-purple-600',
                    bgClass: 'bg-linear-to-b from-white to-purple-100 border-purple-300',
                    title: 'Forwarded to Registrar',
                    badgeClass: 'bg-purple-200 text-purple-800',
                    badgeText: 'With Registrar',
                    textColor: 'text-purple-900',
                    message: `Your application has been forwarded to the Registrar for final approval. Submitted on ${submittedDate}.`,
                    progressColor: 'bg-purple-600',
                    progressBgColor: 'bg-purple-200',
                };
            case 'Clarification Requested':
                return {
                    icon: FaExclamationTriangle,
                    iconColor: 'text-orange-600',
                    bgClass: 'bg-linear-to-b from-white to-orange-100 border-orange-300',
                    title: 'Clarification Requested',
                    badgeClass: 'bg-orange-200 text-orange-800',
                    badgeText: 'Action Required',
                    textColor: 'text-orange-900',
                    message: `Additional information is required for your application submitted on ${submittedDate}. Please check your email or contact support.`,
                    progressColor: 'bg-orange-600',
                    progressBgColor: 'bg-orange-200',
                };
            case 'SLA Breach':
                return {
                    icon: FaExclamationTriangle,
                    iconColor: 'text-red-600',
                    bgClass: 'bg-linear-to-b from-white to-red-100 border-red-300',
                    title: 'Review Delayed',
                    badgeClass: 'bg-red-200 text-red-800',
                    badgeText: 'SLA Breach',
                    textColor: 'text-red-900',
                    message: `Your application review is taking longer than expected. Submitted on ${submittedDate}. We apologize for the delay.`,
                    progressColor: 'bg-red-600',
                    progressBgColor: 'bg-red-200',
                };
            case 'Pending Payment':
                return {
                    icon: FaClock,
                    iconColor: 'text-yellow-600',
                    bgClass: 'bg-linear-to-b from-white to-yellow-100 border-yellow-300',
                    title: 'Pending Payment',
                    badgeClass: 'bg-yellow-200 text-yellow-800',
                    badgeText: 'Payment Required',
                    textColor: 'text-yellow-900',
                    message: `Payment is required to complete your application submitted on ${submittedDate}. Please complete payment to proceed.`,
                    progressColor: 'bg-yellow-600',
                    progressBgColor: 'bg-yellow-200',
                };
            case 'Pending Desk Review':
                return {
                    icon: FaClock,
                    iconColor: 'text-yellow-600',
                    bgClass: 'bg-linear-to-b from-white to-yellow-100 border-yellow-300',
                    title: 'Pending Review',
                    badgeClass: 'bg-yellow-200 text-yellow-800',
                    badgeText: 'Pending Review',
                    textColor: 'text-yellow-900',
                    message: `Your application is pending review. Submitted on ${submittedDate}.`,
                    progressColor: 'bg-yellow-600',
                    progressBgColor: 'bg-yellow-200',
                };
            default:
                return {
                    icon: FaClock,
                    iconColor: 'text-blue-600',
                    bgClass: 'bg-linear-to-b from-white to-blue-100 border-blue-300',
                    title: 'Application Under Review',
                    badgeClass: 'bg-blue-200 text-blue-800',
                    badgeText: 'Pending Review',
                    textColor: 'text-blue-900',
                    message: `Your registration application was submitted on ${submittedDate}. Our team is currently reviewing your documents and information. Estimated review time: 3-5 business days.`,
                    progressColor: 'bg-blue-600',
                    progressBgColor: 'bg-blue-200',
                };
        }
    };

    const config = getStatusConfig();
    const StatusIcon = config.icon;

    return (
        <Card className={`${config.bgClass} mb-6`}>
            <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                    <StatusIcon className={`${config.iconColor} text-xl mt-0.5`} />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-sm font-semibold ${config.textColor}`}>{config.title}</h3>
                            <span className={`text-xs ${config.badgeClass} px-2 py-0.5 rounded font-medium`}>
                                {config.badgeText}
                            </span>
                        </div>
                        <p className={`text-xs ${config.textColor} leading-relaxed`}>
                            {config.message}
                        </p>
                    </div>
                </div>
                <div>
                    <div className={`flex justify-between text-xs ${config.textColor} mb-1.5`}>
                        <span className="font-medium">Review Progress</span>
                        <span className="font-semibold">{reviewProgress}% Complete</span>
                    </div>
                    <div className={`w-full ${config.progressBgColor} rounded-full h-1.5`}>
                        <div
                            className={`${config.progressColor} h-1.5 rounded-full transition-all`}
                            style={{ width: `${reviewProgress}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
