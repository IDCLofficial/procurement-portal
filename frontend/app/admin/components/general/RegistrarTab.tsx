import React from 'react';

interface RegistrarTabProps {
  currentStatus?: string;
}

export function RegistrarTab({ currentStatus }: RegistrarTabProps) {
  const normalizedStatus = (currentStatus || '').toUpperCase();

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-900">Registrar</h2>
      {normalizedStatus === 'FORWARDED TO REGISTRAR' && (
        <p className="text-xl font-bold text-gray-600">This application has been forwarded to registrar.</p>
      )}
      {normalizedStatus === 'APPROVED' && (
        <p className="text-xl font-bold text-gray-600">This application has been approved by the registrar.</p>
      )}
       {normalizedStatus === 'REJECTED' && (
        <p className="text-xl font-bold text-gray-600">This application has been rejected by the registrar.</p>
      )}
      {normalizedStatus !== 'FORWARDED TO REGISTRAR' && normalizedStatus !== 'APPROVED' &&  normalizedStatus !== 'REJECTED' && (
        <p className="text-xl font-bold text-gray-500">This application is yet to be forwarded to the Registrar.</p>
      )}
    </div>
  );
}
