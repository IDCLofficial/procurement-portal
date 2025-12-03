'use client';

import { useParams } from 'next/navigation';
import { ApplicationDetailPage } from '@/app/admin/components/general/ApplicationDetailPage';
import { useGetApplicationByIdQuery } from '@/app/admin/redux/services/appApi';

export default function SystemAdminApplicationDetailRoute() {
  const params = useParams();
  const idParam = (params as { id?: string | string[] })?.id;
  const applicationId = Array.isArray(idParam) ? idParam[0] : idParam || '';

  const { data: application, isLoading } = useGetApplicationByIdQuery(applicationId, {
    skip: !applicationId,
  });

  console.log("details:", application)
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading || !application ? (
          <div className='flex justify-center items-center h-screen'>
            <span className='loader'></span>
          </div>
        ) : (
          <ApplicationDetailPage
            applicationId={application._id}
            contractorName={application.name}
            rcNumber={application.rcNumber}
            sectorAndGrade={`${application.sector} ${application.grade}`}
            submissionDate={application.submissionDate}
            slaDeadline={undefined}
            assignedTo={application.assignedTo}
            currentStatus={application.currentStatus}
            documents={application.companyId?.documents}
            company={application.companyId}
          />
        )}
      </div>
    </main>
  );
}
