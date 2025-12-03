'use client';

import { useEffect } from 'react';
import type { Certificate } from '@/app/admin/types';
import { CertificateDetailsPanel } from './CertificateDetailsPanel';

interface HiddenCertificateExporterProps {
  certificate: Certificate | null;
  format: 'image' | 'pdf' | null;
  onDone?: () => void;
}

export function HiddenCertificateExporter({ certificate, format, onDone }: HiddenCertificateExporterProps) {
  useEffect(() => {
    // no-op: this component relies on CertificateDetailsPanel's
    // autoDownloadFormat effect to perform the download and then
    // call onDone via onAutoDownloadComplete
  }, [certificate, format]);

  if (!certificate || !format) return null;

  return (
    <div className="fixed -left-[9999px] top-0 opacity-0 pointer-events-none">
      <CertificateDetailsPanel
        certificate={certificate}
        onClose={() => {}}
        autoDownloadFormat={format}
        onAutoDownloadComplete={onDone}
      />
    </div>
  );
}
