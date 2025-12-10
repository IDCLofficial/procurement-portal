'use client';

import { FormatDate } from '@/app/admin/utils/dateFormateer';
import type { Company } from '@/app/admin/types';

interface CompanyProfileTabProps {
  company?: Company;
  contractorName: string;
  rcNumber: string;
  sectorAndGrade: string;
}

export function CompanyProfileTab({ company, contractorName, rcNumber, sectorAndGrade }: CompanyProfileTabProps) {
  const rawCategories = company?.categories ?? [];

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-gray-900">Company Information</h2>
        <p className="text-sm text-gray-600">Contractor details from registration</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
        <div>
          <p className="text-xs font-medium text-gray-500">Company Name</p>
          <p className="mt-1 text-gray-900">{company?.companyName ?? contractorName}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">RC/BN Number</p>
          <p className="mt-1 text-gray-900">{company?.cacNumber ?? rcNumber}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">TIN</p>
          <p className="mt-1 text-gray-900">{company?.tin ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">Website</p>
          {company?.website ? (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex text-blue-600 hover:text-blue-800"
            >
              {company.website}
            </a>
          ) : (
            <p className="mt-1 text-gray-900">N/A</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <p className="text-xs font-medium text-gray-500">Address</p>
          <p className="mt-1 text-gray-900">{company?.address ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">LGA</p>
          <p className="mt-1 text-gray-900">{company?.lga ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">Grade</p>
          <p className="mt-1 text-gray-900">{company?.grade ?? sectorAndGrade}</p>
        </div>
      </div>

      {rawCategories.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-medium text-gray-500">Categories</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {rawCategories.map((cat, index) => {
              const label =
                typeof cat === 'string'
                  ? cat
                  : [cat?.sector, cat?.service].filter(Boolean).join(' - ') || 'Category';
              return (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-900">Bank Details</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
          <div>
            <p className="text-xs font-medium text-gray-500">Bank Name</p>
            <p className="mt-1 text-gray-900">{company?.bankName ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Account Name</p>
            <p className="mt-1 text-gray-900">{company?.accountName ?? 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Account Number</p>
            <p className="mt-1 text-gray-900">{company?.accountNumber ?? 'N/A'}</p>
          </div>
        </div>
      </div>

      {company?.directors && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-900">Directors</h3>
          <p className="mt-1 text-sm text-gray-900">{company.directors}</p>
        </div>
      )}

      {(company?.createdAt || company?.updatedAt) && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
          {company?.createdAt && (
            <div>
              <p className="text-xs font-medium text-gray-500">Company Created</p>
              <p className="mt-1 text-gray-900">{FormatDate(company.createdAt)}</p>
            </div>
          )}
          {company?.updatedAt && (
            <div>
              <p className="text-xs font-medium text-gray-500">Last Updated</p>
              <p className="mt-1 text-gray-900">{FormatDate(company.updatedAt)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
