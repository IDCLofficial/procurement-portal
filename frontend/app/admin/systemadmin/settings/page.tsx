'use client';

import { SettingsTabs } from '@/app/admin/components/user/SettingsTabs';
import { FeeConfigurationTable } from '@/app/admin/components/user/FeeConfigurationTable';
import { SlaTimerConfiguration } from '@/app/admin/components/user/SlaTimerConfiguration';
import { CategoriesConfiguration } from '@/app/admin/systemadmin/_components/CategoriesConfiguration';
import { RequiredDocumentsTable } from '@/app/admin/components/user/RequiredDocumentsTable';
import { ConfirmationDialog } from '@/app/admin/components/general/confirmation-dialog';
import { useSettings } from '../_hooks';

export default function SystemAdminSettings() {
  const {
    activeTab,
    fees,
    slaStages,
    documents,
    saving,
    dialog,
    sectors,
    grades,
    handleTabChange,
    handleSlaStagesChange,
    handleDocumentsChange,
    handleSave,
    handleDialogClose,
    handleAddDocument,
    handleEditDocument,
    handleDeleteDocument,
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
