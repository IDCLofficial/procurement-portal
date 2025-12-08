import type { Application, ApplicationStatusEntry } from "@/app/admin/types";

export interface ApiApplication {
  _id: string;
  applicationId: string;
  contractorName: string;
  rcBnNumber: string;
  sectorAndGrade: string;
  grade: string;
  type: string;
  submissionDate: string;
  currentStatus: string;
  assignedToName?: string;
  applicationStatus?: ApplicationStatusEntry[] | string;
  companyId?: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const mapApiApplicationToApplication = (app: ApiApplication): Application => ({
  _id: app._id,
  id: app.applicationId,
  name: app.contractorName,
  rcNumber: app.rcBnNumber,
  sector: app.sectorAndGrade,
  grade: app.grade,
  type: app.type,
  submissionDate: app.submissionDate,
  slaStatus: app.currentStatus === "SLA Breach" ? "Overdue" : "On Track",
  currentStatus: app.currentStatus,
  assignedTo: app.assignedToName ?? "Unassigned",
  applicationTimeline: Array.isArray(app.applicationStatus)
    ? (app.applicationStatus as ApplicationStatusEntry[])
    : typeof app.applicationStatus === "string"
    ? [
        {
          status: app.applicationStatus,
          timestamp: app.updatedAt ?? app.createdAt,
        },
      ]
    : undefined,
  companyId: app.companyId,
  assignedToId: app.assignedTo,
  createdAt: app.createdAt,
  updatedAt: app.updatedAt,
});
