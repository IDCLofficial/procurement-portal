import { Card, CardContent } from '@/components/ui/card';

interface ApplicationDetailsCardProps {
    companyName: string;
    submittedDate: string;
    status: string;
}

export default function ApplicationDetailsCard({ companyName, submittedDate, status }: ApplicationDetailsCardProps) {
    return (
        <Card className="border-gray-200">
            <CardContent className="p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-5">Application Details</h3>
                <div className="space-y-0 divide-y divide-gray-200">
                    <div className="py-3">
                        <p className="text-xs text-gray-500 mb-1.5">Company Name</p>
                        <p className="text-sm font-medium text-gray-900">{companyName}</p>
                    </div>
                    <div className="py-3">
                        <p className="text-xs text-gray-500 mb-1.5">Submitted Date</p>
                        <p className="text-sm font-medium text-gray-900">{submittedDate}</p>
                    </div>
                    <div className="pt-3">
                        <p className="text-xs text-gray-500 mb-2">Current Status</p>
                        <span className="inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded font-medium">
                            {status}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
