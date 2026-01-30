'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Download, X } from 'lucide-react';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import useShortcuts, { KeyboardKey, ShortcutsPresets } from '@useverse/useshortcuts';

export type CertificateStatus = 'approved' | 'expired' | 'revoked';

export interface Certificate {
  _id?: string;
  certificateId: string;
  contractorId?: string | {
    _id: string;
    fullname: string;
    email: string;
    phoneNo: string;
    companyId: string;
    [key: string]: unknown;
  };
  company?: string | {
    _id: string;
    companyName: string;
    cacNumber: string;
    tin: string;
    address: string;
    lga: string;
    categories: Array<{
      sector: string;
      service: string;
    }>;
    grade: string;
    documents: string[];
    website?: string;
    accountName?: string;
    accountNumber?: number;
    bankName?: string;
    [key: string]: unknown;
  };
  contractorName: string;
  companyName?: string;
  rcBnNumber: string;
  tin?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  approvedSectors?: string[];
  categories?: Array<{
    sector: string;
    service: string;
  }>;
  grade: string;
  lga: string;
  status: CertificateStatus;
  validUntil?: string;
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  rcbn?: string;
  sector?: string;
  issueDate?: string;
  expiryDate?: string;
}

interface CertificateDetailsPanelProps {
  certificate: Certificate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  autoDownloadFormat?: 'image' | 'pdf' | null;
  onAutoDownloadComplete?: () => void;
  showWatermark?: boolean;
}

function FormatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return 'N/A';
  }
}

export function CertificateDetailsPanel({
  certificate,
  open,
  onOpenChange,
  autoDownloadFormat,
  onAutoDownloadComplete,
  showWatermark = false,
}: CertificateDetailsPanelProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const sectors = certificate.approvedSectors?.join(', ')
    || certificate.categories?.map(cat => cat.sector).join(', ')
    || (typeof certificate.company === 'object' && certificate.company?.categories?.map(cat => cat.sector).join(', '))
    || 'General';

  const statusClass =
    certificate.status === 'revoked'
      ? 'border-amber-100 bg-amber-50 text-amber-700'
      : certificate.status === 'expired'
        ? 'border-red-100 bg-red-50 text-red-700'
        : 'border-emerald-100 bg-emerald-50 text-emerald-700';

  useEffect(() => {
    const contractorId = typeof certificate.certificateId === 'string'
      ? certificate.certificateId
      : "n/a";

    if (!contractorId) {
      setQrDataUrl(null);
      return;
    }

    const verificationUrl =
      typeof window !== 'undefined'
        ? `https://procurement-portal-mu.vercel.app/contractor/${contractorId}?scan=true`
        : `https://procurement-portal-mu.vercel.app/contractor/${contractorId}?scan=true`;

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
  }, [certificate.certificateId]);

  const downloadAsImage = useCallback(async () => {
    if (!certificateRef.current) return;

    try {
      setIsDownloading(true);
      // Wait for watermark to render if needed
      await new Promise(resolve => setTimeout(resolve, 100));
      
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
    } finally {
      setIsDownloading(false);
    }
  }, [certificate.certificateId]);

  const downloadAsPDF = useCallback(async () => {
    if (!certificateRef.current) return;

    try {
      setIsDownloading(true);
      // Wait for watermark to render if needed
      await new Promise(resolve => setTimeout(resolve, 100));
      
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
    } finally {
      setIsDownloading(false);
    }
  }, [certificate.certificateId]);

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
  }, [autoDownloadFormat, downloadAsImage, downloadAsPDF, onAutoDownloadComplete]);

  useShortcuts({
    shortcuts: [
      ShortcutsPresets.SAVE(open),
      {
        key: KeyboardKey.Escape,
        enabled: open,
      }
    ],
    onTrigger: (shortcut) => {
      switch(shortcut.key) {
        case "Escape": 
          onOpenChange(false);
          break;
        case "S":
          downloadAsPDF();
          break;
        default:
          break;
      }
    }
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0}}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 z-0 backdrop-blur-[2px]"
              onClick={() => onOpenChange(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20, rotate: 5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-lg relative z-10 origin-bottom-left shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">Certificate Details</h2>
                  <p className="text-sm text-gray-600 mt-1">{certificate.certificateId}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="default"
                size="default"
                className='cursor-pointer bg-theme-green/90 hover:bg-theme-green active:scale-95 transition-transform duration-300 active:rotate-2'
                onClick={downloadAsImage}
              >
                <Download className="w-4 h-4 mr-2" />
                Image
              </Button>
              <Button
                type="button"
                variant="default"
                size="default"
                className='cursor-pointer bg-theme-green/90 hover:bg-theme-green active:scale-95 transition-transform duration-300 active:rotate-2'
                onClick={downloadAsPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <button
                onClick={() => onOpenChange(false)}
                className="ml-2 p-2 hover:bg-gray-100 cursor-pointer rounded-md transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-4">

            <div className="grid grid-cols-1 gap-6">
              <div className="lg:col-span-2 space-y-4">
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

                <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-gray-900">Contractor Information</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <p className="text-[#A0AEC0]">Company Name</p>
                      <p className="text-gray-900 font-medium">{certificate.companyName || certificate.contractorName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#A0AEC0]">Contractor Name</p>
                      <p className="text-gray-900 font-medium">{certificate.contractorName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#A0AEC0]">RC/BN Number</p>
                      <p className="text-gray-900 font-medium">{certificate.rcBnNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#A0AEC0]">TIN</p>
                      <p className="text-gray-900 font-medium">{certificate.tin || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#A0AEC0]">Sector</p>
                      <p className="text-gray-900 font-medium">{sectors}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#A0AEC0]">Grade</p>
                      <p className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-800">
                        {certificate.grade?.toUpperCase()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#A0AEC0]">LGA</p>
                      <p className="text-gray-900 font-medium">{certificate.lga}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#A0AEC0]">Address</p>
                      <p className="text-gray-900 font-medium">{certificate.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-gray-900">Certificate Validity</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <p className="text-[#A0AEC0]">Issue Date</p>
                      <p className="text-gray-900 font-medium">{FormatDate(certificate.createdAt || certificate.issueDate)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#A0AEC0]">Valid Until</p>
                      <p className="text-gray-900 font-medium">{FormatDate(certificate.validUntil || certificate.expiryDate)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                ref={certificateRef}
                className="relative bg-white border-2 border-gray-200 rounded-xl p-8 shadow-lg"
                style={{
                  backgroundImage: 'url(/certificate-bg.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/90 rounded-xl" />
                
                {/* Watermark - only shows when downloading and showWatermark is true */}
                {showWatermark && isDownloading && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className="transform -rotate-45 opacity-10">
                      <p className="text-6xl font-bold text-gray-800 whitespace-nowrap">
                        PUBLIC DIRECTORY COPY
                      </p>
                    </div>
                  </div>
                )}

                <div className="relative z-10 space-y-6">
                  <div className="text-center border-b-2 border-emerald-600 pb-4">
                    <div className="flex items-center justify-center mb-2">
                      <Image
                        src="/images/ministry-logo.png"
                        alt="Imo State Logo"
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                      Imo State Government
                    </h2>
                    <p className="text-sm text-gray-700 font-medium">
                      Bureau of Public Procurement  & Price Inteligence
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Contractor Registration Certificate</p>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">
                        Certificate ID
                      </p>
                      <p className="text-lg font-bold text-emerald-700 font-mono">
                        {certificate.certificateId}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-gray-600 font-medium mb-1">Company Name</p>
                        <p className="text-gray-900 font-semibold">
                          {certificate.companyName || certificate.contractorName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium mb-1">RC/BN Number</p>
                        <p className="text-gray-900 font-semibold">{certificate.rcBnNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium mb-1">Grade</p>
                        <p className="text-gray-900 font-semibold uppercase">
                          {certificate.grade}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium mb-1">Sector</p>
                        <p className="text-gray-900 font-semibold">{sectors}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium mb-1">Issue Date</p>
                        <p className="text-gray-900 font-semibold">
                          {FormatDate(certificate.createdAt || certificate.issueDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium mb-1">Valid Until</p>
                        <p className="text-gray-900 font-semibold">
                          {FormatDate(certificate.validUntil || certificate.expiryDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 mb-2">Verification QR Code</p>
                      {qrDataUrl && (
                        <Image
                          src={qrDataUrl}
                          alt="QR Code"
                          width={80}
                          height={80}
                          className="border-2 border-gray-300 rounded"
                        />
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      <div className="inline-block">
                        <p className="text-xs text-gray-600 mb-2">Authorized Signature</p>
                        <div className="border-b-2 border-gray-400 w-32 mb-1" />
                        <p className="text-[10px] text-gray-600">Director, BPPPI</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-[10px] text-gray-500">
                      This certificate is valid only for the period stated above. Verify authenticity at
                      procurement-portal-mu.vercel.app
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
