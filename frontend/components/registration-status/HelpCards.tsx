import { FaArrowLeft } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function WhatHappensNextCard() {
    return (
        <Card className="bg-white border-gray-200">
            <CardContent className="p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4">What Happens Next?</h3>
                <ul className="space-y-3">
                    <li className="text-xs text-gray-600 flex items-start gap-2.5">
                        <span className="text-blue-600 font-semibold shrink-0 w-4">1</span>
                        <span className="leading-relaxed">Our desk officers review your company information and documents</span>
                    </li>
                    <li className="text-xs text-gray-600 flex items-start gap-2.5">
                        <span className="text-blue-600 font-semibold shrink-0 w-4">2</span>
                        <span className="leading-relaxed">You&rsquo;ll be notified if any clarifications are needed</span>
                    </li>
                    <li className="text-xs text-gray-600 flex items-start gap-2.5">
                        <span className="text-blue-600 font-semibold shrink-0 w-4">3</span>
                        <span className="leading-relaxed">Application is forwarded to the Registrar for final approval</span>
                    </li>
                    <li className="text-xs text-gray-600 flex items-start gap-2.5">
                        <span className="text-blue-600 font-semibold shrink-0 w-4">4</span>
                        <span className="leading-relaxed">Your registration certificate will be issued upon approval</span>
                    </li>
                </ul>
            </CardContent>
        </Card>
    );
}

export function NeedHelpCard() {
    const router = useRouter();

    return (
        <Card className="border-gray-200">
            <CardContent className="p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-3">Need Help?</h3>
                <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                    If you have questions about your application status, please contact our support team.
                </p>
                <Button className="w-full bg-theme-green hover:bg-theme-green/90 mb-3 text-sm h-10">
                    Contact Support
                </Button>
                <Button 
                    variant="outline" 
                    className="w-full text-sm h-10"
                    onClick={() => router.push('/dashboard')}
                >
                    <FaArrowLeft className="mr-2 text-xs" />
                    Back to Dashboard
                </Button>
            </CardContent>
        </Card>
    );
}
