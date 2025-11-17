'use client';

import { Card, CardContent } from '@/components/ui/card';

interface DetailItem {
    label: string;
    value: string;
}

interface CertificateDetailsSectionProps {
    title: string;
    details: DetailItem[];
}

export default function CertificateDetailsSection({ title, details }: CertificateDetailsSectionProps) {
    return (
        <Card className="shadow-sm">
            <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">{title}</h3>
                <div className="space-y-3">
                    {details.map((detail, index) => (
                        <div key={index} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className="text-sm text-gray-600">{detail.label}</span>
                            <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{detail.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
