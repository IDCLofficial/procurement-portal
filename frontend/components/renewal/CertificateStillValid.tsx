import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, AlertCircle, XCircle, Send } from 'lucide-react';
import { Application } from '@/store/api/types';

interface CertificateStillValidProps {
    validUntil: string;
    status: Application["status"];
}

const statusConfig = {
    "Approved": {
        icon: CheckCircle2,
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        titleColor: "text-emerald-900",
        descColor: "text-emerald-700",
        title: "Certificate Approved",
        description: "Your registration is active and in good standing",
        showValidity: true,
        actions: [
            "Browse and bid on procurement opportunities",
            "Update your company profile anytime",
            "Receive renewal notifications automatically"
        ]
    },
    "Pending Desk Review": {
        icon: Clock,
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        titleColor: "text-blue-900",
        descColor: "text-blue-700",
        title: "Under Desk Review",
        description: "Your application is being reviewed by our team",
        showValidity: false,
        actions: [
            "Review is typically completed within 5-7 business days",
            "Ensure your contact details are up to date",
            "We'll notify you of any required actions"
        ]
    },
    "Forwarded to Registrar": {
        icon: Send,
        bgColor: "bg-indigo-50",
        borderColor: "border-indigo-200",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        titleColor: "text-indigo-900",
        descColor: "text-indigo-700",
        title: "Forwarded to Registrar",
        description: "Your application has been sent to the registrar for final approval",
        showValidity: false,
        actions: [
            "Final approval typically takes 3-5 business days",
            "The registrar will conduct the final verification",
            "You'll be notified once a decision is made"
        ]
    },
    "Pending Payment": {
        icon: AlertCircle,
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        titleColor: "text-amber-900",
        descColor: "text-amber-700",
        title: "Payment Required",
        description: "Please complete your payment to activate your certificate",
        showValidity: false,
        actions: [
            "Complete payment to proceed with your application",
            "Multiple payment methods available",
            "Certificate will be issued immediately after payment"
        ]
    },
    "Clarification Requested": {
        icon: AlertCircle,
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        titleColor: "text-orange-900",
        descColor: "text-orange-700",
        title: "Action Required",
        description: "We need additional information to process your application",
        showValidity: false,
        actions: [
            "Check your notifications for specific requirements",
            "Submit requested documents as soon as possible",
            "Contact support if you need clarification"
        ]
    },
    "SLA Breach": {
        icon: AlertCircle,
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        titleColor: "text-red-900",
        descColor: "text-red-700",
        title: "Processing Delayed",
        description: "Your application is taking longer than expected",
        showValidity: false,
        actions: [
            "Our team is actively working to resolve this",
            "You will receive priority processing",
            "Contact support for immediate assistance"
        ]
    },
    "Rejected": {
        icon: XCircle,
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        iconBg: "bg-gray-100",
        iconColor: "text-gray-600",
        titleColor: "text-gray-900",
        descColor: "text-gray-700",
        title: "Application Not Approved",
        description: "Unfortunately, your application could not be approved at this time",
        showValidity: false,
        actions: [
            "Review the rejection reason in your notifications",
            "You may reapply after addressing the issues",
            "Contact support for guidance on next steps"
        ]
    }
};

export default function CertificateStatusCard({ validUntil, status }: CertificateStillValidProps) {
    const config = statusConfig[status];
    const Icon = config.icon;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getDaysRemaining = (dateString: string) => {
        const diff = new Date(dateString).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const daysRemaining = getDaysRemaining(validUntil);

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <Card className={`border-2 ${config.borderColor} shadow-lg overflow-hidden transition-all hover:shadow-xl`}>
                <CardHeader className={`${config.bgColor} p-6 border-b ${config.borderColor}`}>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${config.iconBg} ${config.iconColor}`}>
                            <Icon className="h-7 w-7" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className={`text-2xl font-bold ${config.titleColor}`}>
                                {config.title}
                            </CardTitle>
                            <CardDescription className={`${config.descColor} mt-1 text-base`}>
                                {config.description}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    {config.showValidity && (
                        <div className={`${config.bgColor} p-5 rounded-lg border-2 ${config.borderColor}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className={`font-semibold ${config.titleColor} mb-2 text-sm uppercase tracking-wide`}>
                                        Valid Until
                                    </h3>
                                    <div className={`text-3xl font-bold ${config.titleColor} mb-2`}>
                                        {formatDate(validUntil)}
                                    </div>
                                    <p className={`text-sm ${config.descColor}`}>
                                        {daysRemaining > 0
                                            ? `${daysRemaining} days remaining`
                                            : 'Expired - Please renew'}
                                    </p>
                                </div>
                                {daysRemaining <= 30 && daysRemaining > 0 && (
                                    <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                                        Expiring Soon
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 text-lg">
                            {config.showValidity ? "What you can do:" : "Next steps:"}
                        </h4>
                        <ul className="space-y-3">
                            {config.actions.map((action, index) => (
                                <li key={index} className="flex items-start gap-3 group">
                                    <div className={`${config.iconBg} ${config.iconColor} p-1 rounded-full mt-0.5 transition-transform group-hover:scale-110`}>
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <span className="text-gray-700 leading-relaxed">{action}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}