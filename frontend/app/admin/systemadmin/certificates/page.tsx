"use client";

import { useMemo, useState } from "react";
import { CertificateDirectoryToolbar } from "@/app/admin/components/user/CertificateDirectoryToolbar";
import { CertificateTabs } from "@/app/admin/components/user/CertificateTabs";
import { CertificateTable } from "@/app/admin/components/user/CertificateTable";
import { CertificateDetailsPanel } from "@/app/admin/components/user/CertificateDetailsPanel";
import { HiddenCertificateExporter } from "@/app/admin/components/user/HiddenCertificateExporter";
import { CertificateStats } from "@/app/admin/components/user/CertificateStats";
import { useGetCertificatesQuery } from "@/app/admin/redux/services/certificateApi";

import type { Certificate } from "@/app/admin/types";

type TabId = "all" | "pending" | "expiring" | "revoked" | "logs";

const TABS: { id: TabId; label: string }[] = [
  { id: "all", label: "All Certificates" },
  { id: "expiring", label: "Expired" },
  { id: "revoked", label: "Revoked/Suspended" },
  { id: "logs", label: "Verification Logs" },
];

export default function CertificatesPage() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All Grades");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [downloadCertificate, setDownloadCertificate] = useState<Certificate | null>(null);
  const [downloadFormat, setDownloadFormat] = useState<"image" | "pdf" | null>(null);

  const statusQuery = useMemo(() => {
    // If user picked a specific status from the dropdown, prefer that
    if (statusFilter !== "All Status") {
      return statusFilter;
    }

    // Otherwise, derive status from the active tab
    switch (activeTab) {
      case "expiring":
        return "expired";
      case "revoked":
        return "revoked";
      default:
        return undefined;
    }
  }, [statusFilter, activeTab]);

  const {
    data: certificatesData,
    isLoading,
    isFetching,
  } = useGetCertificatesQuery({
    page: 1,
    limit: 20,
    status: statusQuery,
  });

  const isLoadingCertificates = isLoading || isFetching;

  console.log("Certificates API response:", (certificatesData as any)?.certificates ?? certificatesData);

  const certificates: Certificate[] = useMemo(
    () => {
      const apiCertificates = Array.isArray((certificatesData as any)?.certificates)
        ? (certificatesData as any).certificates
        : Array.isArray(certificatesData)
        ? (certificatesData as any)
        : [];

      return apiCertificates.map((item: any) => ({
        _id: item._id,
        certificateId: item.certificateId,
        contractorId: item.contractorId,
        company: item.company,
        contractorName: item.contractorName,
        rcBnNumber: item.rcBnNumber,
        grade: item.grade,
        lga: item.lga,
        status: item.status,
        validUntil: item.validUntil,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        // Legacy properties for backward compatibility
        id: item._id,
        rcbn: item.rcBnNumber,
        certId: item.certificateId,
        issueDate: item.createdAt,
        expiryDate: item.validUntil,
      }));
    },
    [certificatesData],
  );

  const grades = useMemo(
    () => Array.from(new Set(certificates.map((c) => c.grade))).sort(),
    [certificates],
  );

  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      if (activeTab === "expiring" && cert.status !== "expired") return false;
      if (activeTab === "revoked" && cert.status !== "revoked") return false;

      if (gradeFilter !== "All Grades" && cert.grade !== gradeFilter) return false;
      if (statusFilter !== "All Status" && cert.status !== statusFilter) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        cert.contractorName.toLowerCase().includes(q) ||
        cert.certificateId.toLowerCase().includes(q) ||
        cert.rcBnNumber.toLowerCase().includes(q)
      );
    });
  }, [certificates, activeTab, gradeFilter, statusFilter, search]);
  console.log(filteredCertificates);

  const handleExport = () => {
    console.log("Export CSV for certificates", filteredCertificates);
  };

  return (
    <main className="flex-1 overflow-y-auto focus:outline-none bg-gray-50">
      <HiddenCertificateExporter
        certificate={downloadCertificate}
        format={downloadFormat}
        onDone={() => {
          setDownloadCertificate(null);
          setDownloadFormat(null);
        }}
      />
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-6">
          <section className="space-y-1">
            <h1 className="text-lg font-semibold text-gray-900">Certificates Management</h1>
            <p className="text-sm text-[#718096]">
              Manage contractor certificates, renewals, and verification
            </p>
          </section>

          {/* Static stats placeholders for now; to be wired to dedicated stats endpoint later */}
          <CertificateStats
            active={(certificatesData as any)?.statusCounts?.approved ?? 0}
            expiring={(certificatesData as any)?.statusCounts?.expired ?? 0}
            revoked={(certificatesData as any)?.statusCounts?.revoked ?? 0}
          />

          {selectedCertificate ? (
            <CertificateDetailsPanel
              certificate={selectedCertificate}
              onClose={() => setSelectedCertificate(null)}
            />
          ) : (
            <>
              {/* Certificate directory */}
              <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <CertificateDirectoryToolbar
                  search={search}
                  onSearchChange={setSearch}
                  gradeFilter={gradeFilter}
                  onGradeFilterChange={setGradeFilter}
                  gradeOptions={grades}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  onExport={handleExport}
                />

                <CertificateTabs
                  tabs={TABS}
                  activeTab={activeTab}
                  onTabChange={(id) => setActiveTab(id as TabId)}
                />

                {activeTab === "logs" ? (
                  <div className="px-6 pb-6 text-xs text-gray-500">
                    Verification logs will be available here once integrated.
                  </div>
                ) : (
                  <CertificateTable
                    certificates={filteredCertificates}
                    onViewDetails={(cert) => setSelectedCertificate(cert)}
                    onDownload={(cert) => {
                      setDownloadCertificate(cert);
                      setDownloadFormat("pdf");
                    }}
                    isLoading={isLoadingCertificates}
                  />
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}