"use client";

import type { ComponentType, SVGProps } from "react";
import { Check } from "lucide-react";
import { useMarkAdminNotificationAsReadByIdMutation } from "@/app/admin/redux/services/adminApi";

type NotificationTone = "info" | "warning" | "critical";
type PriorityLevel = "high" | "critical";

interface NotificationCardProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone: NotificationTone;
  title: string;
  description: string;
  date: string;
  priorityLabel: string;
  priorityLevel: PriorityLevel;
  tag: string;
  applicationRef: string;
  notificationId: string;
  isUnread?: boolean;
  actionLabel: string;
  applicationId?: string;
  onPrimaryAction?: () => void;
  onDelete?: () => void;
}

const toneStyles: Record<NotificationTone, { border: string; bg: string; iconBg: string; iconColor: string }> = {
  info: {
    border: "border-gray-200",
    bg: "bg-white",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  warning: {
    border: "border-amber-300",
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  critical: {
    border: "border-red-300",
    bg: "bg-red-50",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
};

export default function NotificationCard({
  icon: Icon,
  tone,
  title,
  description,
  date,
  priorityLabel,
  priorityLevel,
  tag,
  applicationRef,
  notificationId,
  isUnread,
  actionLabel,
  applicationId,
  onPrimaryAction,
  onDelete,
}: NotificationCardProps) {
  const toneStyle = toneStyles[tone];
  const [markAsRead] = useMarkAdminNotificationAsReadByIdMutation();

  const handleMarkAsRead = async () => {
    try {
      await markAsRead(notificationId).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const priorityClasses =
    priorityLevel === "critical"
      ? "bg-red-100 text-red-700"
      : "bg-amber-100 text-amber-700";
console.log(applicationId)
  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-xl border px-5 py-4 text-sm shadow-sm ${toneStyle.border} ${toneStyle.bg}`}
    >
      <div className="flex flex-1 gap-4">
        <div className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full ${toneStyle.iconBg}`}>
          <Icon className={`h-5 w-5 ${toneStyle.iconColor}`} />
        </div>
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                {isUnread && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
              </div>
              <p className="mt-1 text-xs text-gray-600">{description}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>{date}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${priorityClasses}`}
            >
              {priorityLabel}
            </span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>{tag}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span className="text-gray-600">{applicationRef}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        {applicationId && (
          <button
            type="button"
            onClick={onPrimaryAction}
            className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            {actionLabel}
          </button>
        )}
        <div className="flex items-center gap-2 text-gray-400">
          {isUnread && (
            <button
              type="button"
              onClick={handleMarkAsRead}
              className="rounded-full border border-gray-300 px-2 py-1 bg-white hover:bg-gray-100  hover:text-gray-700 flex  items-center gap-2"
            >
            Mark as Read  <Check className="h-4 w-4" />
            </button>
          )}
          {/* <button
            type="button"
            onClick={onDelete}
            className="rounded-full p-1 hover:bg-gray-100 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button> */}
        </div>
      </div>
    </div>
  );
}
