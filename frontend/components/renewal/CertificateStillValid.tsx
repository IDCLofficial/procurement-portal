import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface CertificateStillValidProps {
    validUntil: string;
}

export default function CertificateStillValid({ validUntil }: CertificateStillValidProps) {
    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <Card className="border-0 shadow-lg overflow-hidden">
                <CardHeader className="bg-green-50 p-6 border-b">
                    <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-full bg-green-100 text-green-600">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-green-800">Certificate Still Valid</CardTitle>
                            <CardDescription className="text-green-700 mt-1">
                                Your registration is still active and in good standing
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h3 className="font-medium text-blue-800 mb-2">Your certificate is valid until:</h3>
                        <div className="text-2xl font-bold text-blue-900">
                            {new Date(validUntil).toLocaleDateString('en-GB', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </div>
                        <p className="text-sm text-blue-700 mt-2">
                            You can continue to participate in procurement opportunities until this date.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">What you can do now:</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                                <span>Continue bidding on available procurement opportunities</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                                <span>Update your company profile and documents at any time</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                                <span>You&apos;ll receive a notification when it&apos;s time to renew</span>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
