'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TabNavigation } from './TabNavigation';
import { FormatDate } from '@/app/admin/utils/dateFormateer';
import type { Company, CompanyDocument } from '@/app/admin/types';
import { CompanyProfileTab } from '@/app/admin/components/general/CompanyProfileTab';
import { DocumentsTab } from '@/app/admin/components/general/DocumentsTab';
import { DeskOfficerTab } from '@/app/admin/components/general/DeskOfficerTab';
import { RegistrarTab } from '@/app/admin/components/general/RegistrarTab';

interface ApplicationDetailPageProps {
  applicationId: string;
  contractorName: string;
  rcNumber: string;
  sectorAndGrade: string;
  submissionDate?: string | null;
  slaDeadline?: string | null;
  currentStatus?: string;
  assignedTo?: string;
  documents?: CompanyDocument[];
  company?: Company;
  showBackButton?: boolean;
  allowDeskOfficerAssignment?: boolean;
  onDocumentsUpdated?: () => void;
}

export function ApplicationDetailPage({
  applicationId,
  contractorName,
  rcNumber,
  sectorAndGrade,
  submissionDate,
  slaDeadline,
  currentStatus = 'Pending Desk Review',
  assignedTo,
  documents,
  company,
  showBackButton = true,
  allowDeskOfficerAssignment = true,
  onDocumentsUpdated,
}: ApplicationDetailPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Company Profile');

  const tabNames = ['Company Profile', 'Documents', 'Messages', 'Desk Officer', 'Registrar'];

  const tabs = tabNames.map((name) => ({
    name,
    count: name === 'Company Profile' || name === 'Desk Officer' || name === 'Registrar' ? undefined : undefined,
    current: name === activeTab,
  }));

  return (
    <div className="space-y-6">
      <ApplicationHeader
        showBackButton={showBackButton}
        onBack={() => router.back()}
        currentStatus={currentStatus}
        contractorName={contractorName}
        applicationId={applicationId}
        rcNumber={rcNumber}
        sectorAndGrade={sectorAndGrade}
        submissionDate={submissionDate}
        slaDeadline={slaDeadline}
      />

      <div className="mt-4">
        <TabNavigation tabs={tabs} onTabChange={setActiveTab} />
      </div>

      <div className="mt-4 rounded-2xl bg-white px-6 py-5 border border-gray-200">
        {activeTab === 'Company Profile' && (
          <CompanyProfileTab
            company={company}
            contractorName={contractorName}
            rcNumber={rcNumber}
            sectorAndGrade={sectorAndGrade}
          />
        )}
        {activeTab === 'Documents' && (
          <DocumentsTab
            documents={documents}
            onDocumentsUpdated={onDocumentsUpdated}
          />
        )}
        {activeTab === 'Desk Officer' && (
          <DeskOfficerTab
            applicationId={applicationId}
            assignedTo={assignedTo}
            allowDeskOfficerAssignment={allowDeskOfficerAssignment}
            currentStatus={currentStatus}
          />
        )}
        {activeTab === 'Registrar' && <RegistrarTab currentStatus={currentStatus} />}
        {activeTab === 'Messages' && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Document messages</h3>
            {!documents || documents.length === 0 ? (
              <p className="text-sm text-gray-500">No document messages available.</p>
            ) : (
              (() => {
                const docsWithMessages = documents.filter(
                  (doc) => typeof doc.status !== 'string' && doc.status?.message
                );

                if (docsWithMessages.length === 0) {
                  return (
                    <p className="text-sm text-gray-500">No document messages available.</p>
                  );
                }

                return (
                  <ul className="space-y-2">
                    {docsWithMessages.map((doc) => (
                      <li
                        key={doc._id ?? doc.fileName}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
                      >
                        <p className="text-xs font-medium text-gray-600">
                          {doc.documentType ?? doc.fileName ?? 'Document'}
                        </p>
                        <p className="mt-1 text-sm text-gray-800">
                          {doc.status && typeof doc.status !== 'string' ? doc.status.message : ''}
                        </p>
                      </li>
                    ))}
                  </ul>
                );
              })()
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface ApplicationHeaderProps {
  showBackButton?: boolean;
  onBack: () => void;
  currentStatus?: string;
  contractorName: string;
  applicationId: string;
  rcNumber: string;
  sectorAndGrade: string;
  submissionDate?: string | null;
  slaDeadline?: string | null;
}

function ApplicationHeader({
  showBackButton,
  onBack,
  currentStatus,
  contractorName,
  applicationId,
  rcNumber,
  sectorAndGrade,
  submissionDate,
  slaDeadline,
}: ApplicationHeaderProps) {
  const displayStatus = currentStatus ?? '';

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          {showBackButton && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <span className="mr-1">&larr;</span>
              Back
            </button>
          )}
        </div>
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
          {displayStatus}
        </span>
      </div>

      <div>
        <h1 className="text-xl font-semibold text-gray-900">{contractorName}</h1>
        <p className="mt-1 text-sm text-gray-500">{applicationId}</p>
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-gray-500">RC/BN Number</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{rcNumber}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Sector &amp; Grade</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{sectorAndGrade}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Submission Date</p>
            <p className="mt-1 text-sm font-semibold text-gray-900">{FormatDate(submissionDate)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">SLA Deadline</p>
            <p className="mt-1 text-sm font-semibold text-red-600">{FormatDate(slaDeadline)}</p>
          </div>
        </div>
      </div>
    </>
  );
}


