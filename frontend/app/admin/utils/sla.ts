import type { Application, ApplicationStatusEntry } from '@/app/admin/types';
import type { SlaConfig } from '@/app/admin/types/setting';

function toDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  const date = typeof value === 'string' ? new Date(value) : value;
  if (!date || Number.isNaN(date.getTime())) return null;
  return date;
}

function isBusinessDay(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

export function addBusinessDays(start: Date, businessDays: number): Date {
  const result = new Date(start);

  if (!Number.isFinite(businessDays) || businessDays <= 0) {
    return result;
  }

  let added = 0;
  while (added < businessDays) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDay(result)) {
      added += 1;
    }
  }

  return result;
}

export function businessDaysBetween(start: Date, end: Date): number {
  const from = new Date(start);
  const to = new Date(end);

  if (to <= from) return 0;

  let current = new Date(from);
  let count = 0;

  while (current < to) {
    if (isBusinessDay(current)) {
      count += 1;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}

function getCompletionTimestamp(application: Application): string | undefined {
  const timeline = application.applicationTimeline ?? [];

  const hasCompletionStatus = (entry: ApplicationStatusEntry): boolean => {
    const value = entry.status?.toLowerCase() ?? '';
    return value === 'approved' || value === 'rejected';
  };

  const datedEntries = timeline.filter((entry) => entry.timestamp);

  if (datedEntries.length > 0) {
    const sorted = [...datedEntries].sort((a, b) => {
      const aDate = toDate(a.timestamp) ?? new Date(0);
      const bDate = toDate(b.timestamp) ?? new Date(0);
      return aDate.getTime() - bDate.getTime();
    });

    const completedEntry = sorted.find(hasCompletionStatus);
    if (completedEntry?.timestamp) {
      return completedEntry.timestamp;
    }
  }

  const current = application.currentStatus?.toLowerCase();
  if (current === 'approved' || current === 'rejected') {
    return application.updatedAt ?? application.createdAt;
  }

  return undefined;
}

function getTotalTargetDays(config?: SlaConfig | null): number | undefined {
  if (!config) return undefined;

  if (config.totalProcessingTarget && config.totalProcessingTarget > 0) {
    return config.totalProcessingTarget;
  }

  const sum =
    (config.deskOfficerReview ?? 0) +
    (config.registrarReview ?? 0) +
    (config.paymentVerification ?? 0);

  return sum > 0 ? sum : undefined;
}

export interface ApplicationSlaMetrics {
  startDate?: Date;
  endDate?: Date;
  deadline?: Date;
  elapsedBusinessDays: number;
  remainingBusinessDays?: number;
  completed: boolean;
  overdue: boolean;
}

export function computeApplicationSla(
  application: Application,
  slaConfig?: SlaConfig | null,
  now: Date = new Date(),
): ApplicationSlaMetrics {
  const start = toDate(application.submissionDate) ?? toDate(application.createdAt ?? null);

  if (!start) {
    return {
      elapsedBusinessDays: 0,
      completed: false,
      overdue: false,
    };
  }

  const completionTimestamp = getCompletionTimestamp(application);
  const end = completionTimestamp ? toDate(completionTimestamp) ?? now : now;

  const totalTargetDays = getTotalTargetDays(slaConfig);
  const deadline = totalTargetDays ? addBusinessDays(start, totalTargetDays) : undefined;

  const elapsed = businessDaysBetween(start, end);
  const completed = Boolean(completionTimestamp);
  const overdue = Boolean(deadline && (completed ? end > deadline : now > deadline));

  let remaining: number | undefined;
  if (deadline) {
    if (completed) {
      remaining = 0;
    } else {
      remaining = Math.max(0, businessDaysBetween(now, deadline));
    }
  }

  return {
    startDate: start,
    endDate: completed ? end : undefined,
    deadline,
    elapsedBusinessDays: elapsed,
    remainingBusinessDays: remaining,
    completed,
    overdue,
  };
}
