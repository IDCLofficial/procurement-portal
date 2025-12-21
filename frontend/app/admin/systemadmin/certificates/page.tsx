'use client';

import { withProtectedRoute } from '@/app/admin/lib/protectedRoute';
import { CertificateDirectoryToolbar } from '@/app/admin/components/user/CertificateDirectoryToolbar';
import { CertificateTabs } from '@/app/admin/components/user/CertificateTabs';
import { CertificateTable } from '@/app/admin/components/user/CertificateTable';
import { CertificateDetailsPanel } from '@/app/admin/components/user/CertificateDetailsPanel';
import { HiddenCertificateExporter } from '@/app/admin/components/user/HiddenCertificateExporter';
import { CertificateStats } from '@/app/admin/components/user/CertificateStats';
import { useCertificates } from '../_hooks';
import { PageHeader } from '../_components';

function CertificatesPage() {
  const {
    activeTab,
    search,
    gradeFilter,
    statusFilter,
    selectedCertificate,
    downloadCertificate,
    downloadFormat,
    filteredCertificates,
    grades,
    stats,
    tabs,
    isLoading,
    total,
    page,
    limit,
    handleTabChange,
    handleSearchChange,
    handleGradeFilterChange,
    handleStatusFilterChange,
    handleViewDetails,
    handleCloseDetails,
    handleDownload,
    handleDownloadComplete,
    handleExport,
    handlePageChange,
  } = useCertificates();

  return (
    <main className="flex-1 overflow-y-auto focus:outline-none bg-gray-50">
      <HiddenCertificateExporter
        certificate={downloadCertificate}
        format={downloadFormat}
        onDone={handleDownloadComplete}
      />
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-6">
          <PageHeader
            title="Certificates Management"
            description="Manage contractor certificates, renewals, and verification"
          />

          <CertificateStats
            active={stats.active}
            expiring={stats.expiring}
            revoked={stats.revoked}
          />

          {selectedCertificate ? (
            <CertificateDetailsPanel
              certificate={selectedCertificate}
              onClose={handleCloseDetails}
            />
          ) : (
            <section className="bg-white border border-gray-200 rounded-2xl shadow-sm">
              <CertificateDirectoryToolbar
                search={search}
                onSearchChange={handleSearchChange}
                gradeFilter={gradeFilter}
                onGradeFilterChange={handleGradeFilterChange}
                gradeOptions={grades}
                statusFilter={statusFilter}
                onStatusFilterChange={handleStatusFilterChange}
                onExport={handleExport}
              />

              <CertificateTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={(id) => handleTabChange(id as typeof activeTab)}
              />

              {activeTab === 'logs' ? (
                <div className="px-6 pb-6 text-xs text-gray-500">
                  Verification logs will be available here once integrated.
                </div>
              ) : (
                <CertificateTable
                  certificates={filteredCertificates}
                  onViewDetails={handleViewDetails}
                  onDownload={(cert) => handleDownload(cert, 'pdf')}
                  isLoading={isLoading}
                  total={total}
                  page={page}
                  limit={limit}
                  onPageChange={handlePageChange}
                />
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default withProtectedRoute(CertificatesPage, { requiredRoles: ['Admin'] });
