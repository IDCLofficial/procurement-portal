'use client';

import { Check, CheckCheck, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMarkNotificationAsReadByIdMutation, useDeleteNotificationByIdMutation, useGetMyNotificationsQuery } from '@/store/api/vendor.api';

interface NotificationCardProps {
    id: string;
    icon: React.ReactNode;
    title: string;
    message: string;
    timestamp: string;
    badge?: {
        text: string;
        variant: 'default' | 'warning' | 'success' | 'destructive';
    };
    borderColor: string;
    isRead: boolean;
}

export default function NotificationCard({
    id,
    icon,
    title,
    message,
    timestamp,
    badge,
    borderColor,
    isRead,
}: NotificationCardProps) {
    const getBadgeVariant = (variant: string) => {
        switch (variant) {
            case 'warning':
                return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
            case 'success':
                return 'bg-green-100 text-green-700 hover:bg-green-100';
            case 'destructive':
                return 'bg-red-100 text-red-700 hover:bg-red-100';
            default:
                return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
        }
    };

    const [markNotificationAsReadById, { isLoading: isMarkingNotificationAsReadById }] = useMarkNotificationAsReadByIdMutation();
    const [deleteNotificationById, { isLoading: isDeletingNotificationById }] = useDeleteNotificationByIdMutation();

    const { isLoading, refetch } = useGetMyNotificationsQuery();

    const handleMarkAsRead = (id: string) => {
        markNotificationAsReadById(id);
        refetch();
    };

    const handleDelete = (id: string) => {
        deleteNotificationById(id);
        refetch();
    };

    return (
        <div className={`bg-white rounded-xl border ${borderColor} border border-gray-200 p-5 ${!isRead ? 'bg-blue-50/30' : ''}`}>
            <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="shrink-0 mt-1">
                    {icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
                        <div className="flex items-center gap-2 shrink-0">
                            {!isRead ?
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMarkAsRead(id)}
                                    disabled={isMarkingNotificationAsReadById || isLoading}
                                    className="h-8 w-8 p-0 cursor-pointer"
                                    title="Mark as read"
                                >
                                    {(isMarkingNotificationAsReadById || isLoading) ? <Loader2 className="w-4 h-4 animate-spin text-gray-600" /> : <Check className="w-4 h-4 text-gray-600" />}
                                </Button>
                                : 
                                <CheckCheck className="w-4 h-4 text-gray-600" />
                            }
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(id)}
                                disabled={isDeletingNotificationById || isLoading}
                                className="h-8 w-8 p-0 cursor-pointer"
                                title="Delete"
                            >
                                {(isDeletingNotificationById || isLoading) ? <Loader2 className="w-4 h-4 animate-spin text-gray-600" /> : <Trash2 className={`w-4 h-4 text-gray-600`} />}
                            </Button>
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{message}</p>

                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{timestamp}</span>
                        {badge && (
                            <Badge className={`text-xs font-medium ${getBadgeVariant(badge.variant)}`}>
                                {badge.text}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
