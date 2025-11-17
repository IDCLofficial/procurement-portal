'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaExclamationCircle, FaSync } from 'react-icons/fa';

interface RenewalReminderCardProps {
    daysRemaining: number;
    onStartRenewal?: () => void;
}

export default function RenewalReminderCard({ daysRemaining, onStartRenewal }: RenewalReminderCardProps) {
    return (
        <Card className="bg-linear-to-b from-white to-yellow-50 border-yellow-200 shadow-sm">
            <CardContent className="">
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                        <FaExclamationCircle className="text-yellow-600 text-lg" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-yellow-900 mb-1">Renewal Reminder</h3>
                        <p className="text-sm text-yellow-800 leading-relaxed">
                            Your registration will expire in {daysRemaining} days. Please initiate the renewal process to avoid service interruption.
                        </p>
                    </div>
                </div>
                <Button
                    className="bg-teal-700 hover:bg-teal-800 text-white"
                    onClick={onStartRenewal}
                >
                    <FaSync className="mr-2 text-sm" />
                    Start Renewal Process
                </Button>
            </CardContent>
        </Card>
    );
}
