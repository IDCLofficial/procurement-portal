'use client';

import { Check, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    actionLabel?: string;
    borderColor: string;
    isRead: boolean;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    onAction?: (id: string) => void;
}

export default function NotificationCard({
    id,
    icon,
    title,
    message,
    timestamp,
    badge,
    actionLabel,
    borderColor,
    isRead,
    onMarkAsRead,
    onDelete,
    onAction,
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
                                    onClick={() => onMarkAsRead(id)}
                                    className="h-8 w-8 p-0"
                                    title="Mark as read"
                                >
                                    <Check className="w-4 h-4 text-gray-600" />
                                </Button>
                                : 
                                <CheckCheck className="w-4 h-4 text-gray-600" />
                            }
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(id)}
                                className="h-8 w-8 p-0"
                                title="Delete"
                            >
                                <Trash2 className={`w-4 h-4 text-gray-600`} />
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

                    {actionLabel && onAction && (
                        <Button
                            variant="link"
                            size="sm"
                            onClick={() => onAction(id)}
                            className="mt-3 p-0 h-auto text-teal-600 hover:text-teal-700"
                        >
                            {actionLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
