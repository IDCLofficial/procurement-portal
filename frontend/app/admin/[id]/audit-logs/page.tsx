"use client";

import { useState, useMemo } from "react";
import { useGetAuditLogsQuery } from "@/app/admin/redux/services/adminApi";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Search,
} from "lucide-react";
import { Pagination } from "@/app/admin/components/general/Pagination";

type AuditSeverity = "Info" | "Warning" | "Success" | "Error" | string;

interface AuditLogMetadata {
  oldStatus?: string;
  newStatus?: string;
  companyId?: string;
  companyName?: string;
  [key: string]: unknown;
}

interface AuditLog {
  _id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  severity: AuditSeverity;
  ipAddress: string;
  metadata?: AuditLogMetadata;
  createdAt?: string;
  updatedAt?: string;
}

interface AuditLogsResponse {
  data: AuditLog[];
  total: number;
  page?: number;
  limit?: number;
}

const DEFAULT_LIMIT = 20;

const ACTOR_FILTER_OPTIONS = [
  "All Actors",
  "desk officer",
  "Admin",
  "registrar",
] as const;

const SEVERITY_FILTER_OPTIONS = [
  "All Severities",
  "Info",
  "Warning",
  "Success",
  "Error",
] as const;

const ACTION_FILTER_OPTIONS = [
  "All Actions",
  "Application Submitted",
  "Application Reviewed",
  "Application Forwarded",
  "Application Approved",
  "Application Rejected",
  "Clarification Requested",
  "Clarification Submitted",
  "Certificate Generated",
  "Certificate Revoked",
  "Certificate Renewed",
  "User Created",
  "User Updated",
  "User Deleted",
  "User Activated",
  "User Deactivated",
  "Settings Updated",
  "SLA Updated",
  "Document Uploaded",
  "Document Verified",
  "Document Rejected",
  "Report Generated",
  "Payment Initiated",
  "Payment Verified",
  "Payment Failed",
] as const;

const severityConfig: Record<AuditSeverity, { label: string; badgeClass: string }> = {
  Info: {
    label: "Info",
    badgeClass: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  Warning: {
    label: "Warning",
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  Success: {
    label: "Success",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  Error: {
    label: "Error",
    badgeClass: "bg-rose-50 text-rose-700 border border-rose-200",
  },
};

function getSeverityConfig(severity: AuditSeverity) {
  return severityConfig[severity] ?? severityConfig.Info;
}

export default function AuditLogs() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = DEFAULT_LIMIT;

  const [search, setSearch] = useState("");
  const [actorFilter, setActorFilter] = useState<string>("All Actors");
  const [severityFilter, setSeverityFilter] = useState<string>("All Severities");
  const [actionFilter, setActionFilter] = useState<string>("All Actions");

  const { data: globalData } = useGetAuditLogsQuery();

  const actorParam =
    actorFilter === "All Actors"
      ? undefined
      : actorFilter === "desk officer"
      ? "system"
      : actorFilter === "Admin"
      ? "System Admin"
      : actorFilter;

  const { data, isLoading, isFetching, error } = useGetAuditLogsQuery({
    limit,
    skip: (currentPage - 1) * limit,
    actor: actorParam,
    severity: severityFilter !== "All Severities" ? severityFilter : undefined,
    action: actionFilter !== "All Actions" ? actionFilter : undefined,
  });

  const globalTyped: AuditLogsResponse =
    (globalData as AuditLogsResponse | undefined) ?? {
      data: [],
      total: 0,
    };
  const globalTotal = globalTyped.total ?? 0;

  const { logs, total, pageFromApi, limitFromApi } = useMemo(() => {
    const typed: AuditLogsResponse =
      (data as AuditLogsResponse | undefined) ?? { data: [], total: 0 };

    const logs = typed.data ?? [];
    const total = typed.total ?? logs.length;
    const pageFromApi = typed.page ?? currentPage;
    const limitFromApi = typed.limit ?? limit;

    return { logs, total, pageFromApi, limitFromApi };
  }, [data, currentPage, limit]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = search
        ? [
            log.actor,
            log.role,
            log.action,
            log.entityId,
            log.details,
            log.ipAddress,
          ]
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;

      return matchesSearch;
    });
  }, [logs, search]);

  const stats = useMemo(() => {
    const success = logs.filter((l) => l.severity === "Success").length;
    const warnings = logs.filter((l) => l.severity === "Warning").length;
    const errors = logs.filter((l) => l.severity === "Error").length;
    return { total: globalTotal, success, warnings, errors };
  }, [logs, globalTotal]);

  const handleExportCsv = () => {
    if (!filteredLogs.length) return;

    const headers: (keyof AuditLog)[] = [
      "timestamp",
      "actor",
      "role",
      "action",
      "entityType",
      "entityId",
      "details",
      "severity",
      "ipAddress",
    ];

    const rows = filteredLogs.map((log) =>
      headers
        .map((key) => {
          const value = log[key];

          const str =
            value === null || value === undefined
              ? ""
              : typeof value === "object"
              ? JSON.stringify(value)
              : String(value);
          return '"' + str.replace(/"/g, '""') + '"';
        })
        .join(","),
    );

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "audit-logs.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading || isFetching) {
    return (
    <div className="flex h-screen items-center justify-center">
    <span className="loader"></span>
    </div>);
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-red-600">
        Failed to load audit logs.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            Immutable record of all system activities
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Audit trail of key events across applications, certificates, users, and settings.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-xs"
          onClick={handleExportCsv}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500 mb-1">Total Events</p>
          <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500 mb-1">Success</p>
          <p className="text-2xl font-semibold text-emerald-600">{stats.success}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500 mb-1">Warnings</p>
          <p className="text-2xl font-semibold text-amber-600">{stats.warnings}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500 mb-1">Errors</p>
          <p className="text-2xl font-semibold text-rose-600">{stats.errors}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            value={actorFilter}
            onChange={(e) => {
              setActorFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white min-w-[140px]"
          >
            {ACTOR_FILTER_OPTIONS.map((actor) => (
              <option key={actor}>{actor}</option>
            ))}
          </select>

          <select
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white min-w-[140px]"
          >
            {SEVERITY_FILTER_OPTIONS.map((sev) => (
              <option key={sev}>{sev}</option>
            ))}
          </select>

          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white min-w-[140px]"
          >
            {ACTION_FILTER_OPTIONS.map((action) => (
              <option key={action}>{action}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Activity Log</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Immutable record of all system activities (showing {filteredLogs.length} of {logs.length} events)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs text-gray-500">Timestamp</TableHead>
                <TableHead className="text-xs text-gray-500">Actor</TableHead>
                <TableHead className="text-xs text-gray-500">Role</TableHead>
                <TableHead className="text-xs text-gray-500">Action</TableHead>
                <TableHead className="text-xs text-gray-500">Entity</TableHead>
                <TableHead className="text-xs text-gray-500">Details</TableHead>
                <TableHead className="text-xs text-gray-500">Severity</TableHead>
                <TableHead className="text-xs text-gray-500">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-xs text-gray-500 text-center py-6"
                  >
                    No audit logs found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => {
                  const sev = getSeverityConfig(log.severity);
                  return (
                    <TableRow key={log._id}>
                      <TableCell className="text-xs text-gray-700 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-gray-900 whitespace-nowrap">
                        {log.actor}
                      </TableCell>
                      <TableCell className="text-xs text-gray-700 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[11px]">
                          {log.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-gray-900 whitespace-nowrap">
                        {log.action}
                      </TableCell>
                      <TableCell className="text-xs text-gray-700 whitespace-nowrap">
                        <span className="block text-[11px] text-gray-500">{log.entityType}</span>
                        <span className="text-xs font-medium text-gray-900">{log.entityId}</span>
                      </TableCell>
                      <TableCell className="text-xs text-gray-700 max-w-xs">
                        <div>{log.details}</div>
                        {log.metadata?.oldStatus && log.metadata?.newStatus && (
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Status: {log.metadata.oldStatus} → {log.metadata.newStatus}
                          </div>
                        )}
                        {log.metadata?.companyName && (
                          <div className="text-[11px] text-gray-500">
                            Company: {log.metadata.companyName}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge className={sev.badgeClass}>{sev.label}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-gray-700 whitespace-nowrap">
                        {log.ipAddress}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        {total > 0 && (
          <Pagination
            total={total}
            page={pageFromApi}
            limit={limitFromApi}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
}