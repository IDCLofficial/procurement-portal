'use client';

import { Card, CardContent } from '@/components/ui/card';
import RecentActivityItem from './RecentActivityItem';

interface Activity {
    id: string;
    title: string;
    date: string;
    type?: 'success' | 'info' | 'warning';
}

interface RecentActivityCardProps {
    activities: Activity[];
}

export default function RecentActivityCard({ activities }: RecentActivityCardProps) {
    return (
        <Card className="shadow-sm">
            <CardContent className="px-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-0">
                    {activities.map((activity) => (
                        <RecentActivityItem
                            key={activity.id}
                            title={activity.title}
                            date={activity.date}
                            type={activity.type}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
