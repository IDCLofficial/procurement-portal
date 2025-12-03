'use client';

import { useEffect, useState, useRef } from 'react';
import type { Certificate } from '@/app/admin/types';
import { ArrowLeft } from 'lucide-react';
import QRCode from 'qrcode';
import { FormatDate } from '../../utils/dateFormateer';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';


interface CertificateDetailsPanelProps {
  certificate: Certificate;
  onClose: () => void;
  autoDownloadFormat?: 'image' | 'pdf' | null;
  onAutoDownloadComplete?: () => void;
}

export function CertificateDetailsPanel({
  certificate,
  onClose,
  autoDownloadFormat,
  onAutoDownloadComplete,
}: CertificateDetailsPanelProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  // Debug: Log the certificate data to see the structure
  console.log('Certificate data:', certificate);
  console.log('Company categories:', certificate.company);
  // Extract sectors from company categories
  const sectors = certificate.company?.categories?.map(cat => cat.sector).join(', ') || 'General';

  const statusClass =
    certificate.status === 'revoked'
      ? 'border-amber-100 bg-amber-50 text-amber-700'
      : certificate.status === 'expired'
      ? 'border-red-100 bg-red-50 text-red-700'
      : 'border-emerald-100 bg-emerald-50 text-emerald-700';

  useEffect(() => {
    const contractorId = certificate.contractorId?._id;

    if (!contractorId) {
      setQrDataUrl(null);
      return;
    }

    const verificationUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/contractor/${contractorId}?scan=true`
        : `https://procurement.imostate.gov.ng/contractor/${contractorId}?scan=true`;

    QRCode.toDataURL(
      verificationUrl,
      { width: 128, margin: 1 },
      (err, url) => {
        if (err) {
          console.error('Failed to generate QR code', err);
          setQrDataUrl(null);
          return;
        }
        setQrDataUrl(url);
      }
    );
  }, [certificate.contractorId?._id]);


   const downloadAsImage = async () => {
    if (!certificateRef.current) return;

    try {
      const dataUrl = await toPng(certificateRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `certificate-${certificate.certificateId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image.');
    }
  };

  // ===============================
  // DOWNLOAD AS PDF
  // ===============================
  const downloadAsPDF = async () => {
    if (!certificateRef.current) return;

    try {
      const dataUrl = await toPng(certificateRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`certificate-${certificate.certificateId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF.');
    }
  };

  useEffect(() => {
    if (!autoDownloadFormat) return;

    const run = async () => {
      try {
        if (autoDownloadFormat === 'image') {
          await downloadAsImage();
        } else {
          await downloadAsPDF();
        }
      } finally {
        onAutoDownloadComplete?.();
      }
    };

    run();
  }, [autoDownloadFormat]);


  return (
    <section className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-md text-white custom-green hover:text-gray-300 flex items-center gap-1 px-4 py-2 rounded-lg font-bold"
          >
            <span className="text-lg leading-none">
              <ArrowLeft className="w-4 h-4" />
            </span>
            <span>Back</span>
          </button>
          <div>
            <p className="text-xs text-[#A0AEC0]">Certificate Details</p>
            <p className="text-sm font-semibold text-gray-900">{certificate.certificateId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={downloadAsImage}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Download as Image
          </button>
          <button
            type="button"
            onClick={downloadAsPDF}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Download as PDF
          </button>
        </div>
      </div>

      <div className="px-6 py-5 grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Certificate Status */}
          <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#A0AEC0]">Certificate Status</p>
              <p
                className={`mt-1 inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusClass}`}
              >
                {certificate.status}
              </p>
            </div>
          </div>

          {/* Contractor Information */}
          <div className="border border-gray-100 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-900">Contractor Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="text-[#A0AEC0]">Company Name</p>
                <p className="text-gray-900 font-medium">{certificate.contractorName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#A0AEC0]">RC/BN Number</p>
                <p className="text-gray-900 font-medium">{certificate.rcBnNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#A0AEC0]">Sector</p>
                <p className="text-gray-900 font-medium">{sectors}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#A0AEC0]">Grade</p>
                <p className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-800">
                  {certificate.grade}
                </p>
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="border border-gray-100 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-900">Certificate Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="text-[#A0AEC0]">Certificate ID</p>
                <p className="text-gray-900 font-medium">{certificate.certificateId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#A0AEC0]">QR Code</p>
                <p className="text-gray-900 font-medium">QR-{certificate.certificateId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#A0AEC0]">Issue Date</p>
                <p className="text-gray-900 font-medium">{certificate.createdAt}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[#A0AEC0]">Expiry Date</p>
                <p className="text-gray-900 font-medium">{FormatDate(certificate.validUntil)}</p>
              </div>
            </div>
          </div>

          {/* Verification History placeholder */}
          <div className="border border-gray-100 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-900">Verification History</p>
            <p className="text-[11px] text-gray-500">Public verification attempts for this certificate will appear here.</p>
          </div>
        </div>

        {/* Right column - Certificate Preview */}
        <div className="space-y-4">
          <div className="border border-gray-100 rounded-xl p-4 space-y-2 text-xs">
            <p className="text-xs font-semibold text-gray-900">Quick Actions</p>
            <button
              type="button"
              onClick={downloadAsImage}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50"
            >
              Download Image
            </button>
            <button
              type="button"
              onClick={downloadAsPDF}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50"
            >
              Download PDF
            </button>
          </div>

          {/* Official Certificate Preview */}
          <div ref={certificateRef} className="mx-auto border-4 border-emerald-700 bg-emerald-50 rounded-lg shadow-sm">
            <div className="border border-emerald-300 m-1 p-4 sm:p-5 bg-white/70 text-xs text-gray-800 flex flex-col justify-between gap-3">
              {/* Header bar */}
              <div className="flex flex-col items-start justify-between border-b border-emerald-300 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-600 p-5 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">BPPPI</span>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-900">
                    Imo State Government
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-900">
                      Bureau of Public Procurement and Price Intelligence
                    </p>
                    <p className="text-[10px] text-gray-600">
                      Established by Public Procurement Act No. 14 of 2007
                    </p>
                  </div>
                </div>
                <div className="text-center my-2  text-[10px] text-gray-700">
                  <p className="font-semibold uppercase tracking-wide text-emerald-900">
                    Certificate No.  {certificate.certificateId}
                  </p>
                 
                </div>
              </div>

              {/* Long title */}
              <div className="text-center mb-3">
                <p className="text-[11px] font-semibold text-gray-800 leading-snug">
                  National Database of the Particulars, Categorization and Classification
                  of Contractors, Consultants and Services Providers
                </p>
              </div>

              {/* "This is to certify that" */}
              <div className="text-center mb-2">
                <p className="text-lg italic text-emerald-900 font-semibold">
                  This is to Certify that
                </p>
              </div>

              {/* Contractor name bar */}
              <div className="mb-3 flex justify-center">
                <div className="inline-block bg-emerald-100 px-4 py-1 rounded text-sm font-semibold text-gray-900">
                  {certificate.contractorName}
                </div>
              </div>

              {/* Compliance paragraph */}
              <p className="text-[11px] text-gray-700 leading-snug mb-3 text-justify">
                Is registered in compliance with Section 5h and 6f of the Public Procurement Act, 2007.
                The company has been categorized and classified as follows:
              </p>

              {/* Classification table */}
              <div className="mb-4 border border-gray-500 text-[11px]">
                <div className="grid grid-cols-3 border-b border-gray-500 bg-gray-100 font-semibold text-gray-800">
                  <div className="px-2 py-1 border-r border-gray-500">Category</div>
                  <div className="px-2 py-1 border-r border-gray-500">Class</div>
                  <div className="px-2 py-1">Procurement Value Range</div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="px-2 py-1 border-r border-gray-500">
                    {(() => {
                      console.log('Checking categories:', certificate.company?.categories);
                      const sectors = certificate.company?.categories?.map((cat: { sector: string; service: string }) => cat.sector);
                      console.log('Mapped sectors:', sectors);
                      const joined = sectors?.join(', ');
                      console.log('Joined sectors:', joined);
                      return joined || 'General';
                    })()}
                  </div>
                  <div className="px-2 py-1 border-r border-gray-500">
                    {certificate?.grade?.toUpperCase() || 'E'}
                  </div>
                  <div className="px-2 py-1">
                    Less than N100 million
                  </div>
                </div>
              </div>

              {/* Validity line */}
              <div className="mb-4 text-[11px] text-gray-800 flex items-center gap-2">
                <span>This Certificate is valid till</span>
                <span className="font-semibold">
                  {FormatDate(certificate.validUntil)}
                </span>
              </div>

              {/* Footer: signature + seal + QR */}
              <div className="mt-4 flex items-end justify-between">
                {/* Signature block */}
                <div className="text-[10px] text-gray-700">
                  <div className="w-40 border-t border-gray-600 mb-1" />
                  <p className="font-semibold text-gray-900">Sir. Clifford Okoro</p>
                  <p>Director-General</p>
                </div>

                {/* Seal placeholder */}
                <div className="hidden sm:block">
                  <div className="h-16 w-16 rounded-full border-2 border-emerald-400 bg-emerald-50 flex items-center justify-center text-[9px] text-emerald-800">
                    <div className="text-center">
                      <div className="font-bold">SEAL</div>
                      <div>BPPPI</div>
                    </div>
                  </div>
                </div>

                {/* QR code */}
                <div className="flex flex-col items-center gap-1">
                  <div className="bg-white p-1 rounded border border-gray-200">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Certificate QR code"
                        className="h-16 w-16"
                      />
                    ) : (
                      <div className="h-16 w-16 flex items-center justify-center text-[9px] text-gray-400">
                        QR unavailable
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] text-gray-500">Scan to verify</p>
                </div>
              </div>

              {/* Bottom verification note */}
              <div className="mt-3 pt-1 border-t border-emerald-300 text-center">
                <p className="text-[9px] text-gray-500">
                  This certificate can be authenticated through http://bppregistration.bpp.gov.ng/verification/contractors.aspx
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
