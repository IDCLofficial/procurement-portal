'use client';

import { useParams } from 'next/navigation';
import { ApplicationDetailPage } from '@/app/admin/components/general/ApplicationDetailPage';
import { useGetApplicationByIdQuery } from '@/app/admin/redux/services/appApi';
import { LoadingSpinner } from '../../_components';

export default function SystemAdminApplicationDetailRoute() {
  const params = useParams();
  const idParam = (params as { id?: string | string[] })?.id;
  const applicationId = Array.isArray(idParam) ? idParam[0] : idParam || '';

  const { data: application, isLoading } = useGetApplicationByIdQuery(applicationId, {
    skip: !applicationId,
  });

  if (isLoading || !application) {
    return (
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <LoadingSpinner fullScreen />
      </main>
    );
  }

  const company = typeof application.companyId === 'string' ? undefined : application.companyId;

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ApplicationDetailPage
          applicationId={application._id}
          contractorName={application.name}
          rcNumber={application.rcNumber}
          sectorAndGrade={`${application.sector} ${application.grade}`}
          submissionDate={application.submissionDate}
          slaDeadline={undefined}
          assignedTo={application.assignedTo}
          currentStatus={application.currentStatus}
          documents={company?.documents}
          company={company}
        />
      </div>
    </main>
  );
}
