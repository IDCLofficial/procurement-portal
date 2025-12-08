'use client';

import { useState, useMemo, useCallback } from 'react';
import { useGetCertificatesQuery } from '@/app/admin/redux/services/certificateApi';
import { CERTIFICATE_TABS, type CertificateTabId } from '../_constants';
import type { Certificate } from '@/app/admin/types';

interface CertificateApiItem {
  _id: string;
  certificateId: string;
  contractorId?: { _id: string };
  company?: { categories?: { sector: string; service: string }[] };
  contractorName: string;
  rcBnNumber: string;
  grade: string;
  lga?: string;
  status: string;
  validUntil: string;
  createdAt: string;
  updatedAt?: string;
}

interface CertificatesApiResponse {
  certificates?: CertificateApiItem[];
  statusCounts?: {
    approved?: number;
    expired?: number;
    revoked?: number;
  };
}

export interface CertificateStats {
  active: number;
  expiring: number;
  revoked: number;
}

export interface UseCertificatesReturn {
  // State
  activeTab: CertificateTabId;
  search: string;
  gradeFilter: string;
  statusFilter: string;
  selectedCertificate: Certificate | null;
  downloadCertificate: Certificate | null;
  downloadFormat: 'image' | 'pdf' | null;
  
  // Data
  certificates: Certificate[];
  filteredCertificates: Certificate[];
  grades: string[];
  stats: CertificateStats;
  tabs: typeof CERTIFICATE_TABS;
  
  // Loading states
  isLoading: boolean;
  
  // Handlers
  handleTabChange: (id: CertificateTabId) => void;
  handleSearchChange: (value: string) => void;
  handleGradeFilterChange: (value: string) => void;
  handleStatusFilterChange: (value: string) => void;
  handleViewDetails: (cert: Certificate) => void;
  handleCloseDetails: () => void;
  handleDownload: (cert: Certificate, format: 'image' | 'pdf') => void;
  handleDownloadComplete: () => void;
  handleExport: () => void;
}

export function useCertificates(): UseCertificatesReturn {
  const [activeTab, setActiveTab] = useState<CertificateTabId>('all');
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All Grades');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [downloadCertificate, setDownloadCertificate] = useState<Certificate | null>(null);
  const [downloadFormat, setDownloadFormat] = useState<'image' | 'pdf' | null>(null);

  // Determine status query based on filters and tab
  const statusQuery = useMemo(() => {
    if (statusFilter !== 'All Status') {
      return statusFilter;
    }
    switch (activeTab) {
      case 'expiring':
        return 'expired';
      case 'revoked':
        return 'revoked';
      default:
        return undefined;
    }
  }, [statusFilter, activeTab]);

  const {
    data: certificatesData,
    isLoading: isLoadingQuery,
    isFetching,
  } = useGetCertificatesQuery({
    page: 1,
    limit: 20,
    status: statusQuery,
  });

  const isLoading = isLoadingQuery || isFetching;

  // Transform API response to Certificate[]
  const certificates = useMemo<Certificate[]>(() => {
    const response = certificatesData as CertificatesApiResponse | CertificateApiItem[] | undefined;
    const apiCertificates: CertificateApiItem[] = Array.isArray((response as CertificatesApiResponse)?.certificates)
      ? (response as CertificatesApiResponse).certificates!
      : Array.isArray(response)
      ? response
      : [];

    return apiCertificates.map((item) => ({
      _id: item._id,
      certificateId: item.certificateId,
      contractorId: item.contractorId as Certificate['contractorId'],
      company: item.company as Certificate['company'],
      contractorName: item.contractorName,
      rcBnNumber: item.rcBnNumber,
      grade: item.grade,
      lga: item.lga ?? '',
      status: item.status as Certificate['status'],
      validUntil: item.validUntil,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt ?? item.createdAt,
      // Legacy properties for backward compatibility
      id: item._id,
      rcbn: item.rcBnNumber,
      certId: item.certificateId,
      issueDate: item.createdAt,
      expiryDate: item.validUntil,
    }));
  }, [certificatesData]);

  // Extract unique grades for filter dropdown
  const grades = useMemo(
    () => Array.from(new Set(certificates.map((c) => c.grade))).sort(),
    [certificates]
  );

  // Calculate stats
  const stats = useMemo<CertificateStats>(() => {
    const response = certificatesData as CertificatesApiResponse | undefined;
    return {
      active: response?.statusCounts?.approved ?? 0,
      expiring: response?.statusCounts?.expired ?? 0,
      revoked: response?.statusCounts?.revoked ?? 0,
    };
  }, [certificatesData]);

  // Filter certificates based on current filters
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      if (activeTab === 'expiring' && cert.status !== 'expired') return false;
      if (activeTab === 'revoked' && cert.status !== 'revoked') return false;
      if (gradeFilter !== 'All Grades' && cert.grade !== gradeFilter) return false;
      if (statusFilter !== 'All Status' && cert.status !== statusFilter) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        cert.contractorName.toLowerCase().includes(q) ||
        cert.certificateId.toLowerCase().includes(q) ||
        cert.rcBnNumber.toLowerCase().includes(q)
      );
    });
  }, [certificates, activeTab, gradeFilter, statusFilter, search]);

  // Handlers
  const handleTabChange = useCallback((id: CertificateTabId) => {
    setActiveTab(id);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleGradeFilterChange = useCallback((value: string) => {
    setGradeFilter(value);
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  const handleViewDetails = useCallback((cert: Certificate) => {
    setSelectedCertificate(cert);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedCertificate(null);
  }, []);

  const handleDownload = useCallback((cert: Certificate, format: 'image' | 'pdf') => {
    setDownloadCertificate(cert);
    setDownloadFormat(format);
  }, []);

  const handleDownloadComplete = useCallback(() => {
    setDownloadCertificate(null);
    setDownloadFormat(null);
  }, []);

  const handleExport = useCallback(() => {
    // Export CSV logic would go here
    // For now, this is a placeholder
  }, []);

  return {
    activeTab,
    search,
    gradeFilter,
    statusFilter,
    selectedCertificate,
    downloadCertificate,
    downloadFormat,
    certificates,
    filteredCertificates,
    grades,
    stats,
    tabs: CERTIFICATE_TABS,
    isLoading,
    handleTabChange,
    handleSearchChange,
    handleGradeFilterChange,
    handleStatusFilterChange,
    handleViewDetails,
    handleCloseDetails,
    handleDownload,
    handleDownloadComplete,
    handleExport,
  };
}
