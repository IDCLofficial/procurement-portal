"use client";

import { useMemo, useState } from "react";
import { useGetTransactionsQuery } from "@/app/admin/redux/services/adminApi";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Search } from "lucide-react";

interface CompanyRef {
  _id?: string;
  companyName?: string;
  cacNumber?: string;
}

interface Transaction {
  _id: string;
  paymentId: string;
  companyId?: CompanyRef;
  amount: number;
  status: string;
  type: string;
  description?: string;
  category?: string;
  grade?: string;
  transactionReference?: string;
  createdAt?: string;
  updatedAt?: string;
  paymentDate?: string;
  verificationMessage?: string;
  applicationId?: string;
}

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
  verified: {
    label: "Verified",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  pending: {
    label: "Pending",
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  processing: {
    label: "Processing",
    badgeClass: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  failed: {
    label: "Failed",
    badgeClass: "bg-rose-50 text-rose-700 border border-rose-200",
  },
  declined: {
    label: "Declined",
    badgeClass: "bg-rose-50 text-rose-700 border border-rose-200",
  },
  reversed: {
    label: "Reversed",
    badgeClass: "bg-rose-50 text-rose-700 border border-rose-200",
  },
};

function getStatusConfig(status?: string) {
  const key = (status ?? "").toLowerCase();
  return (
    statusConfig[key] ?? {
      label: status ?? "Unknown",
      badgeClass: "bg-gray-50 text-gray-700 border border-gray-200",
    }
  );
}

function formatCurrency(amount?: number) {
  if (amount === undefined || amount === null || Number.isNaN(amount)) return "-";
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return String(amount);
  }
}

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

export default function Transactions() {
  const { data, isLoading, isFetching, error } = useGetTransactionsQuery();
  const transactions = useMemo(
    () => (data as Transaction[] | undefined) ?? [],
    [data],
  );

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [gradeFilter, setGradeFilter] = useState("All Grades");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const stats = useMemo(() => {
    const total = transactions.length;
    const verified = transactions.filter(
      (t) => t.status?.toLowerCase() === "verified",
    ).length;
    const pending = transactions.filter((t) => {
      const s = t.status?.toLowerCase();
      return s === "pending" || s === "processing";
    }).length;
    const failed = transactions.filter((t) => {
      const s = t.status?.toLowerCase();
      return s === "failed" || s === "declined" || s === "reversed";
    }).length;

    return { total, verified, pending, failed };
  }, [transactions]);

  const uniqueCategories = useMemo(
    () =>
      Array.from(
        new Set(transactions.map((t) => t.category).filter(Boolean)),
      ) as string[],
    [transactions],
  );

  const uniqueGrades = useMemo(
    () =>
      Array.from(
        new Set(transactions.map((t) => t.grade).filter(Boolean)),
      ) as string[],
    [transactions],
  );

  const uniqueStatuses = useMemo(
    () =>
      Array.from(
        new Set(transactions.map((t) => t.status).filter(Boolean)),
      ) as string[],
    [transactions],
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch = search
        ? [
            tx.companyId?.companyName,
            tx.companyId?.cacNumber,
            tx.paymentId,
            tx.applicationId,
            tx.transactionReference,
            tx.category,
            tx.type,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;

      const matchesCategory =
        categoryFilter === "All Categories" || tx.category === categoryFilter;

      const matchesGrade = gradeFilter === "All Grades" || tx.grade === gradeFilter;

      const matchesStatus =
        statusFilter === "All Statuses" || tx.status === statusFilter;

      return matchesSearch && matchesCategory && matchesGrade && matchesStatus;
    });
  }, [transactions, search, categoryFilter, gradeFilter, statusFilter]);

  if (isLoading || isFetching) {
  return <div className="flex h-screen items-center justify-center"><span className="loader"></span></div>;
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-red-600">
        Failed to load transactions.
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="p-6 text-sm text-gray-600">No transactions found.</div>
    );
  }

  return (
    <Dialog
      open={detailsOpen}
      onOpenChange={(open) => {
        setDetailsOpen(open);
        if (!open) {
          setSelectedTransaction(null);
        }
      }}
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Transactions Management
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Monitor vendor payments, processing fees, and verification status.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500 mb-1">Total Transactions</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500 mb-1">Verified</p>
            <p className="text-2xl font-semibold text-emerald-600">
              {stats.verified}
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500 mb-1">Pending / Processing</p>
            <p className="text-2xl font-semibold text-amber-600">{stats.pending}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500 mb-1">Failed / Reversed</p>
            <p className="text-2xl font-semibold text-rose-600">{stats.failed}</p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company, payment ID, or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white min-w-[140px]"
            >
              <option>All Categories</option>
              {uniqueCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white min-w-[140px]"
            >
              <option>All Grades</option>
              {uniqueGrades.map((grade) => (
                <option key={grade}>{grade}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white min-w-[140px]"
            >
              <option>All Statuses</option>
              {uniqueStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Transactions Directory
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Showing {filteredTransactions.length} of {transactions.length} payments
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs text-gray-500">Company</TableHead>
                  <TableHead className="text-xs text-gray-500">CAC Number</TableHead>
                  <TableHead className="text-xs text-gray-500">Category</TableHead>
                  <TableHead className="text-xs text-gray-500">Grade</TableHead>
                  <TableHead className="text-xs text-gray-500">Amount</TableHead>
                  <TableHead className="text-xs text-gray-500">Type</TableHead>
                  <TableHead className="text-xs text-gray-500">Payment Date</TableHead>
                  <TableHead className="text-xs text-gray-500">Status</TableHead>
                  <TableHead className="text-xs text-gray-500 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-xs text-gray-500 text-center py-6"
                    >
                      No transactions match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((tx) => {
                    const status = getStatusConfig(tx.status);
                    return (
                      <TableRow key={tx._id}>
                        <TableCell className="text-xs text-gray-900 whitespace-nowrap">
                          {tx.companyId?.companyName ?? "-"}
                        </TableCell>
                        <TableCell className="text-xs text-gray-700 whitespace-nowrap">
                          {tx.companyId?.cacNumber ?? "-"}
                        </TableCell>
                        <TableCell className="text-xs text-gray-700 whitespace-nowrap">
                          {tx.category ?? "-"}
                        </TableCell>
                        <TableCell className="text-xs text-gray-700 whitespace-nowrap">
                          {tx.grade?.toUpperCase() ?? "-"}
                        </TableCell>
                        <TableCell className="text-xs text-gray-900 whitespace-nowrap">
                          {formatCurrency(tx.amount)}
                        </TableCell>
                        <TableCell className="text-xs text-gray-700 whitespace-nowrap">
                          {tx.type}
                        </TableCell>
                        <TableCell className="text-xs text-gray-700 whitespace-nowrap">
                          {formatDate(tx.paymentDate ?? tx.createdAt)}
                        </TableCell>
                        <TableCell className="text-xs">
                          <Badge className={status.badgeClass}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-right whitespace-nowrap">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-[11px] flex items-center gap-1"
                            onClick={() => {
                              setSelectedTransaction(tx);
                              setDetailsOpen(true);
                            }}
                          >
                            <Eye className="w-3 h-3" />
                            View more
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {selectedTransaction && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Transaction details</DialogTitle>
              <DialogDescription>
                {selectedTransaction.companyId?.companyName ?? "Unknown company"}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 space-y-4 text-xs text-gray-700">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] text-gray-500 mb-0.5">Amount</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-gray-500 mb-0.5">Status</p>
                  {(() => {
                    const status = getStatusConfig(selectedTransaction.status);
                    return (
                      <Badge className={status.badgeClass}>{status.label}</Badge>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[11px] text-gray-500">Company</p>
                  <p className="text-xs text-gray-900">
                    {selectedTransaction.companyId?.companyName ?? "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-gray-500">CAC Number</p>
                  <p className="text-xs">
                    {selectedTransaction.companyId?.cacNumber ?? "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-gray-500">Payment ID</p>
                  <p className="text-xs break-all">
                    {selectedTransaction.paymentId}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-gray-500">Application ID</p>
                  <p className="text-xs break-all">
                    {selectedTransaction.applicationId ?? "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-gray-500">Category</p>
                  <p className="text-xs">{selectedTransaction.category ?? "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-gray-500">Grade</p>
                  <p className="text-xs">
                    {selectedTransaction.grade?.toUpperCase() ?? "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-gray-500">Transaction Ref</p>
                  <p className="text-xs break-all">
                    {selectedTransaction.transactionReference ?? "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-gray-500">Payment Date</p>
                  <p className="text-xs">
                    {formatDate(
                      selectedTransaction.paymentDate ??
                        selectedTransaction.createdAt,
                    )}
                  </p>
                </div>
              </div>

              {selectedTransaction.description && (
                <div className="space-y-1">
                  <p className="text-[11px] text-gray-500">Description</p>
                  <p className="text-xs whitespace-pre-wrap">
                    {selectedTransaction.description}
                  </p>
                </div>
              )}

              {selectedTransaction.verificationMessage && (
                <div className="space-y-1">
                  <p className="text-[11px] text-gray-500">Verification message</p>
                  <p className="text-xs whitespace-pre-wrap">
                    {selectedTransaction.verificationMessage}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </div>
    </Dialog>
  );
}