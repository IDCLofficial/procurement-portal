// components/renewal/AllDocumentsUpToDate.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function AllDocumentsUpToDate() {
    return (
        <div className="space-y-6">
            <Card className="border-green-100 bg-green-50">
                <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="rounded-full bg-green-100 p-2 text-green-600">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-medium text-green-800">
                                All Documents Are Up to Date
                            </CardTitle>
                            <CardDescription className="text-green-700">
                                Your documents are current and don&apos;t require any updates at this time.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="space-y-4">
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <h3 className="mb-2 font-medium text-gray-900">Next Steps</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-start">
                                    <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                    <span>You can proceed to the payment step to complete your renewal</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircle2 className="mr-2 mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                    <span>Review your company information for any updates</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}