"use client";

import { withProtectedRoute } from '@/app/admin/lib/protectedRoute';
import { SettingsTabs } from '@/app/admin/components/user/SettingsTabs';
import { SlaTimerConfiguration } from '@/app/admin/components/user/SlaTimerConfiguration';
import { CategoriesConfiguration } from '@/app/admin/systemadmin/_components/CategoriesConfiguration';
import { RequiredDocumentsTable } from '@/app/admin/components/user/RequiredDocumentsTable';
import { ConfirmationDialog } from '@/app/admin/components/general/confirmation-dialog';
import { MdasTable } from '@/app/admin/systemadmin/_components/MdasTable';
import { useSettings } from '../_hooks';

function SystemAdminSettings() {
  const {
    activeTab,
   
    slaStages,
    documents,
    saving,
    dialog,
    sectors,
    grades,
    mdas,
    mdasTotal,
    mdasPage,
    mdasLimit,
    handleTabChange,
    handleSlaStagesChange,
    handleDocumentsChange,
    handleSave,
    handleDialogClose,
    handleAddDocument,
    handleEditDocument,
    handleDeleteDocument,
    handleMdasPageChange,
  } = useSettings();

  return (
    <main className="flex-1 overflow-y-auto focus:outline-none bg-gray-50">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-6">
          <SettingsTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onSave={handleSave}
          />

        

          {activeTab === 'sla' && (
            <SlaTimerConfiguration
              stages={slaStages}
              onChange={handleSlaStagesChange}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesConfiguration
              sectors={sectors}
              grades={grades}
            />
          )}

          {activeTab === 'mdas' && (
            <MdasTable
              mdas={mdas}
              total={mdasTotal}
              page={mdasPage}
              limit={mdasLimit}
              onPageChange={handleMdasPageChange}
            />
          )}

          {activeTab === 'documents' && (
            <RequiredDocumentsTable
              documents={documents}
              onChange={handleDocumentsChange}
              onAddDocument={handleAddDocument}
              onEditDocument={handleEditDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={dialog.open}
        onClose={handleDialogClose}
        onConfirm={handleDialogClose}
        title={dialog.title}
        description={dialog.description}
        confirmText="OK"
        cancelText="Close"
        variant={dialog.variant}
        loading={saving}
      />
    </main>
  );
}

export default withProtectedRoute(SystemAdminSettings, { requiredRoles: ['Admin'] });
