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
  console.log(rawCategories)

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
          <p className="text-xs font-medium text-gray-500">Grade</p>
          <p className="mt-1 text-gray-900">{company?.grade?.toUpperCase() ?? sectorAndGrade?.toUpperCase()}</p>
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

      {(() => {
        type Director = {
          name: string;
          position?: string;
          address?: string;
          nationality?: string;
          identification?: string;
          idType: string;
          id: string;
          email?: string;
          phone?: string;
          expiryDate?: string;
        };
        
        const rawDirectorsContainer = company?.directors;
        const directorsArray: Director[] = Array.isArray((rawDirectorsContainer as { directors?: Director[] })?.directors)
          ? (rawDirectorsContainer as { directors: Director[] }).directors
          : Array.isArray(rawDirectorsContainer)
            ? rawDirectorsContainer as Director[]
            : [];

        if (!directorsArray.length) {
          return null;
        }

        return (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-900">Directors</h3>
            <div className="mt-2 space-y-2">
              {directorsArray.map((director, index) => (
                <div
                  key={director?.id ?? director?.email ?? index}
                  className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900"
                >
                  <p className="font-semibold">
                    {director?.name ?? 'Unnamed director'}
                  </p>
                  <div className="mt-1 grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {director?.idType && director?.id && (
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">ID:</span> {director.idType} - {director.id}
                      </p>
                    )}
                    {director?.phone && (
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Phone:</span> {director.phone}
                      </p>
                    )}
                    {director?.email && (
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">Email:</span> {director.email}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

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
