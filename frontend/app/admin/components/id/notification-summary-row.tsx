"use client";

import { AlertTriangle, Bell, BellRing } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

interface NotificationSummaryRowProps {
  total: number;
  unread: number;
  critical: number;
  highPriority: number;
}
 
interface SummaryCardProps {
  label: string;
  value: number;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  borderClass: string;
  iconBgClass: string;
  iconColorClass: string;
}

function SummaryCard({ label, value, icon: Icon, borderClass, iconBgClass, iconColorClass }: SummaryCardProps) {
  return (
    <div className={`flex items-center justify-between rounded-xl border bg-white px-5 py-4 ${borderClass}`}>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBgClass}`}>
        <Icon className={`h-5 w-5 ${iconColorClass}`} />
      </div>
    </div>
  );
}

export default function NotificationSummaryRow({ total, unread, critical, highPriority }: NotificationSummaryRowProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        label="Total"
        value={total}
        icon={Bell}
        borderClass="border-gray-200"
        iconBgClass="bg-blue-50"
        iconColorClass="text-blue-600"
      />
      <SummaryCard
        label="Unread"
        value={unread}
        icon={BellRing}
        borderClass="border-blue-200"
        iconBgClass="bg-blue-50"
        iconColorClass="text-blue-600"
      />
      <SummaryCard
        label="Critical"
        value={critical}
        icon={AlertTriangle}
        borderClass="border-red-200"
        iconBgClass="bg-red-50"
        iconColorClass="text-red-600"
      />
      <SummaryCard
        label="High Priority"
        value={highPriority}
        icon={AlertTriangle}
        borderClass="border-amber-200"
        iconBgClass="bg-amber-50"
        iconColorClass="text-amber-600"
      />
    </div>
  );
}
