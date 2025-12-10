'use client';

import { Card, CardContent } from '@/components/ui/card';
import RecentActivityItem from './RecentActivityItem';
import { useGetMyActivityLogsQuery } from '@/store/api/vendor.api';
import { useMemo } from 'react';

// Map activity types to UI types
const getActivityType = (activityType: string): 'success' | 'info' | 'warning' => {
    const type = activityType.toLowerCase();
    if (type.includes('approved') || type.includes('success') || type.includes('completed')) {
        return 'success';
    }
    if (type.includes('warning') || type.includes('pending') || type.includes('review')) {
        return 'warning';
    }
    return 'info';
};

export default function RecentActivityCard() {
    const { data: activityLogs, isLoading, error } = useGetMyActivityLogsQuery();

    // Transform API data to component format
    const activities = useMemo(() => {
        if (!activityLogs) return [];
        
        return activityLogs.map((log, index) => ({
            id: `${log.timestamp}-${index}`,
            title: log.description,
            date: new Date(log.timestamp).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            type: getActivityType(log.activityType)
        }));
    }, [activityLogs]);
    return (
        <Card className="shadow-sm">
            <CardContent className="px-6">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h2>
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-green"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">Unable to load activity logs</p>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No recent activity</p>
                    </div>
                ) : (
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
                )}
            </CardContent>
        </Card>
    );
}
