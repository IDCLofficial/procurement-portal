"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useGetCategoriesQuery, useGetDocumentPresetsQuery, useGetMdasQuery, useGetGradesQuery } from '@/app/admin/redux/services/settingsApi';
import {
  DEFAULT_SLA_STAGES,
  type SlaStageConfig,
  type DocumentConfigItem,
} from '../_constants';
import type { SettingsTabId } from '@/app/admin/components/user/SettingsTabs';
import type { SectorConfig, GradeConfig } from '@/app/admin/systemadmin/_types/settings-ui';

export interface DialogState {
  open: boolean;
  title: string;
  description: string;
  variant: 'default' | 'destructive';
}

export interface MdaConfig {
  id: string;
  name: string;
  code?: string;
}

export interface UseSettingsReturn {
  // State
  activeTab: SettingsTabId;
  
  slaStages: SlaStageConfig[];
  documents: DocumentConfigItem[];
  saving: boolean;
  dialog: DialogState;
  mdasTotal: number;
  mdasPage: number;
  mdasLimit: number;
  
  // Derived data
  sectors: SectorConfig[];
  grades: GradeConfig[];
  mdas: MdaConfig[];
  
  // Handlers
  handleTabChange: (tab: SettingsTabId) => void;
  handleMdasPageChange: (page: number) => void;

  handleSlaStagesChange: (stages: SlaStageConfig[]) => void;
  handleDocumentsChange: (docs: DocumentConfigItem[]) => void;
  handleSave: () => void;
  handleDialogClose: () => void;
  
  // Action handlers (for table buttons)
  handleAddFee: () => void;
  handleEditFee: (id: string) => void;
  handleDeleteFee: (id: string) => void;
  handleAddDocument: () => void;
  handleEditDocument: (id: string) => void;
  handleDeleteDocument: (id: string) => void;
}

function loadSlaStagesFromStorage(): SlaStageConfig[] {
  if (typeof window === 'undefined') return DEFAULT_SLA_STAGES;
  try {
    const stored = window.localStorage.getItem('slaStages');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed as SlaStageConfig[];
      }
    }
  } catch (error) {
    console.error('Failed to load SLA stages from storage', error);
  }
  return DEFAULT_SLA_STAGES;
}

const DEFAULT_MDAS_LIMIT = 10;

export function useSettings(): UseSettingsReturn {
  const [activeTab, setActiveTab] = useState<SettingsTabId>('categories');
  const [slaStages, setSlaStages] = useState<SlaStageConfig[]>(loadSlaStagesFromStorage);
  const [documents, setDocuments] = useState<DocumentConfigItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    title: '',
    description: '',
    variant: 'default',
  });
  const [mdasCurrentPage, setMdasCurrentPage] = useState(1);

  // Fetch categories from API
  const { data: categoriesData } = useGetCategoriesQuery();

  // Fetch grades from dedicated endpoint
  const { data: gradesData } = useGetGradesQuery();

  // Fetch document presets from API
  const { data: documentsData } = useGetDocumentPresetsQuery();

  const { data: mdasResponse } = useGetMdasQuery({
    page: mdasCurrentPage,
    limit: DEFAULT_MDAS_LIMIT,
  });

  // Transform API data to component format
  const sectors = useMemo<SectorConfig[]>(
    () =>
      categoriesData?.categories?.map((category) => ({
        id: category._id,
        sector: category.sector.toUpperCase(),
        grade: '',
        fee: '',
        effectiveDate: '',
      })) ?? [],
    [categoriesData?.categories]
  );

  const grades = useMemo<GradeConfig[]>(() => {
    const source = gradesData ?? categoriesData?.grades ?? [];
    return source.map((grade) => ({
      _id: grade._id,
      category: grade.category ?? '',
      grade: grade.grade,
      registrationCost: grade.registrationCost,
      financialCapacity: grade.financialCapacity,
    }));
  }, [gradesData, categoriesData?.grades]);

  const mdas = useMemo<MdaConfig[]>(
    () =>
      mdasResponse?.mdas?.map((mda) => ({
        id: mda._id,
        name: mda.name,
        code: mda.code,
      })) ?? [],
    [mdasResponse?.mdas]
  );

  const mdasTotal = mdasResponse?.total ?? 0;
  const mdasPage = mdasResponse?.page ?? mdasCurrentPage;
  const mdasLimit = mdasResponse?.limit ?? DEFAULT_MDAS_LIMIT;

  // Handlers
  const handleTabChange = useCallback((tab: SettingsTabId) => {
    setActiveTab(tab);
  }, []);

  const handleMdasPageChange = useCallback((page: number) => {
    setMdasCurrentPage(page);
  }, []);



  const handleSlaStagesChange = useCallback((stages: SlaStageConfig[]) => {
    setSlaStages(stages);
  }, []);

  // Initialize documents from backend presets when available
  useEffect(() => {
    if (!documentsData || documentsData.length === 0) return;

    const mapped: DocumentConfigItem[] = documentsData.map((preset) => ({
      id: preset._id,
      name: preset.documentName,
      required: preset.isRequired ? 'Required' : 'Optional',
      hasExpiry: preset.hasExpiry.toLowerCase() === 'yes' ? 'Yes' : 'No',
      renewalFrequency: preset.renewalFrequency,
    }));

    setDocuments(mapped);
  }, [documentsData]);

  const handleDocumentsChange = useCallback((docs: DocumentConfigItem[]) => {
    setDocuments(docs);
  }, []);

  const handleSave = useCallback(() => {
    try {
      setSaving(true);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('slaStages', JSON.stringify(slaStages));
      }

      setDialog({
        open: true,
        title: 'Settings saved',
        description: 'Your configuration changes have been saved successfully.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to save settings', error);
      setDialog({
        open: true,
        title: 'Save failed',
        description: "We couldn't save your changes. Please try again.",
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  }, [slaStages]);

  const handleDialogClose = useCallback(() => {
    setDialog((prev) => ({ ...prev, open: false }));
  }, []);

  // Action handlers (placeholders for now)
  const handleAddFee = useCallback(() => {
    // Implementation would go here
    console.log('Add fee');
  }, []);

  const handleEditFee = useCallback((id: string) => {
    // Implementation would go here
    console.log('Edit fee', id);
  }, []);

  const handleDeleteFee = useCallback((id: string) => {
    console.log('Delete fee', id);
    // Implementation would go here
  }, []);

  const handleAddDocument = useCallback(() => {
    console.log('Add document');
    // Implementation would go here
  }, []);

  const handleEditDocument = useCallback((id: string) => {
    console.log('Edit document', id);
    // Implementation would go here
  }, []);

  const handleDeleteDocument = useCallback((id: string) => {
    console.log('Delete document', id);
    // Implementation would go here
  }, []);

  return {
    activeTab,
    slaStages,
    documents,
    saving,
    dialog,
    mdasTotal,
    mdasPage,
    mdasLimit,
    sectors,
    grades,
    mdas,
    handleTabChange,
    handleMdasPageChange,
    handleSlaStagesChange,
    handleDocumentsChange,
    handleSave,
    handleDialogClose,
    handleAddFee,
    handleEditFee,
    handleDeleteFee,
    handleAddDocument,
    handleEditDocument,
    handleDeleteDocument,
  };
}
