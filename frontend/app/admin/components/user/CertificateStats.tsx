'use client';

import { cn } from '@/lib/utils';

interface CertificateStatsProps {
  active: number;
  expiring: number;
  revoked: number;

  className?: string;
}

export function CertificateStats({ active, expiring, revoked, className }: CertificateStatsProps) {
  return (
    <section className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col gap-1">
        <p className="text-xs text-[#A0AEC0]">Active Certificates</p>
        <p className="text-2xl font-semibold text-gray-900">{active}</p>
        <p className="text-[11px] text-gray-500">Currently valid</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col gap-1">
        <p className="text-xs text-[#A0AEC0]">Expired</p>
        <p className="text-2xl font-semibold text-gray-900">{expiring}</p>
        <p className="text-[11px] text-gray-500">Expired certificates</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col gap-1">
        <p className="text-xs text-[#A0AEC0]">Revoked</p>
        <p className="text-2xl font-semibold text-gray-900">{revoked}</p>
        <p className="text-[11px] text-gray-500">Suspended certificates</p>
      </div>
    
    </section>
  );
}
