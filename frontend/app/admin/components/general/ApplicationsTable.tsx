import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Application } from '../../types';
import { FormatDate } from '@/app/admin/utils/dateFormateer';
import { Pagination } from '@/app/admin/components/general/Pagination';



interface ApplicationsTableProps {
  applications: Application[];
  isLoading?: boolean;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function ApplicationsTable({ applications, total, page, limit, onPageChange }: ApplicationsTableProps) {
  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Application ID
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                    Contractor Name
                  </th>
                
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                    MDA
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                    Type
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                    Submission Date
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                    SLA Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                    Current Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-medium text-gray-900">
                    Assigned To
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {applications.map((app) => {
                  const statusText = app.currentStatus
                    ?? (Array.isArray(app.applicationTimeline) && app.applicationTimeline.length > 0
                      ? app.applicationTimeline[app.applicationTimeline.length - 1]?.status
                      : undefined);

                  return (console.log(app),
                    <tr key={app.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-blue-600 sm:pl-6">
                        {app.id}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-[350px] whitespace-normal wrap-break-word">{app.name}</td>
                     
                      <td className="px-3 py-4 text-sm text-gray-500 max-w-[350px] whitespace-normal wrap-break-word">
                        {app.companyId && typeof app.companyId === 'object' && 'mda' in app.companyId ? app.companyId.mda : '-'}
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{app.type}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{FormatDate(app.submissionDate)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          app.slaStatus === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {app.slaStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          {statusText === 'Pending Desk Review' && (
                            <Clock className="mr-1.5 h-4 w-4 shrink-0 text-yellow-400" />
                          )}
                          {statusText === 'Approved' && (
                            <CheckCircle className="mr-1.5 h-4 w-4 shrink-0 text-green-500" />
                          )}
                          {statusText === 'SLA Breach' && (
                            <AlertCircle className="mr-1.5 h-4 w-4 shrink-0 text-red-500" />
                          )}
                          {statusText}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{app.assignedTo}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          href={`/admin/systemadmin/applications/${app?._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View<span className="sr-only">, {app.name}</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {typeof total === 'number' && typeof page === 'number' && typeof limit === 'number' && onPageChange && total > 0 && (
              <Pagination total={total} page={page} limit={limit} onPageChange={onPageChange} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}