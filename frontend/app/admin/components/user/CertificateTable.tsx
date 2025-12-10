"use client";

import type { Certificate, CertificateStatus } from '@/app/admin/types';
import { FormatDate } from '../../utils/dateFormateer';
import { Pagination } from '../general/Pagination';

const statusClasses: Record<CertificateStatus, string> = {
  approved: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  expired: 'border-amber-100 bg-amber-50 text-amber-700',
  revoked: 'border-red-100 bg-red-50 text-red-700',
};

interface CertificateTableProps {
  certificates: Certificate[];
  onViewDetails?: (certificate: Certificate) => void;
  onDownload?: (certificate: Certificate) => void;
  isLoading?: boolean;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
}

export function CertificateTable({
  certificates,
  onViewDetails,
  onDownload,
  isLoading,
  total,
  page,
  limit,
  onPageChange,
}: CertificateTableProps) {
  return (
    <div className="px-4 pb-4">
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-100 text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Contractor Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">RC/BN</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Grade</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Certificate ID</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Issue Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Expiry Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {isLoading && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-xs text-gray-500"
                >
                  <span className='loader my-6'></span>
                </td>
              </tr>
            )}
            {!isLoading &&
              certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-gray-900">
                    {cert.contractorName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                    {cert.rcbn}
                  </td>
                 
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">{cert.grade}</td>
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-gray-800">
                    {cert.certificateId}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                    {FormatDate(cert.issueDate)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                    {FormatDate(cert.expiryDate)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusClasses[cert.status]}`}
                    >
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2 text-gray-500">
                      <button
                        type="button"
                        onClick={() => onViewDetails && onViewDetails(cert)}
                        className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-[11px] font-medium text-gray-700 hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-700"
                      >
                        See more
                      </button>
                      <button
                        type="button"
                        onClick={() => onDownload && onDownload(cert)}
                        className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-[11px] font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            {!isLoading && certificates.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-xs text-gray-500"
                >
                  No certificates match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {total !== undefined &&
          page !== undefined &&
          limit !== undefined &&
          onPageChange && (
            <Pagination
              total={total}
              page={page}
              limit={limit}
              onPageChange={onPageChange}
            />
          )}
      </div>
    </div>
  );
}
