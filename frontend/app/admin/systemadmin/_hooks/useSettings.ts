"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
  useGetCategoriesQuery,
  useGetDocumentPresetsQuery,
  useGetMdasQuery,
  useGetGradesQuery,
  useGetSlaConfigQuery,
  useUpdateSlaConfigMutation,
} from '@/app/admin/redux/services/settingsApi';
import {
  DEFAULT_SLA_STAGES,
  type SlaStageConfig,
  type DocumentConfigItem,
} from '../_constants';
import { useAppDispatch } from '../../redux/hooks';
import { setSlaConfig } from '../../redux/slice/slaConfigSlice';
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
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<SettingsTabId>('categories');
  const [saving, setSaving] = useState(false);
  const [dialog, setDialog] = useState<DialogState>({
    open: false,
    title: '',
    description: '',
    variant: 'default',
  });
  const [mdasCurrentPage, setMdasCurrentPage] = useState(1);
  const [editedSlaStages, setEditedSlaStages] = useState<SlaStageConfig[] | null>(null);
  const [editedDocuments, setEditedDocuments] = useState<DocumentConfigItem[] | null>(null);

  // Fetch categories from API
  const { data: categoriesData } = useGetCategoriesQuery();

  // Fetch grades from dedicated endpoint
  const { data: gradesData } = useGetGradesQuery();

  // Fetch document presets from API
  const { data: documentsData } = useGetDocumentPresetsQuery();

  // Fetch SLA configuration from backend
  const { data: slaConfigData } = useGetSlaConfigQuery();

  const [updateSlaConfig] = useUpdateSlaConfigMutation();

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
      renewalFee: grade.renewalFee,
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

  const storedSlaStages = useMemo<SlaStageConfig[]>(() => loadSlaStagesFromStorage(), []);

  const apiSlaStages = useMemo<SlaStageConfig[] | null>(() => {
    if (!slaConfigData) return null;

    try {
      return DEFAULT_SLA_STAGES.map((stage) => {
        switch (stage.id) {
          case 'desk-officer-review':
            return {
              ...stage,
              value: slaConfigData.deskOfficerReview ?? stage.value,
            };
          case 'registrar-review':
            return {
              ...stage,
              value: slaConfigData.registrarReview ?? stage.value,
            };
          case 'clarification-response':
            return {
              ...stage,
              value: slaConfigData.clarificationResponse ?? stage.value,
            };
          case 'payment-verification':
            return {
              ...stage,
              value: slaConfigData.paymentVerification ?? stage.value,
            };
          case 'total-processing-target':
            return {
              ...stage,
              value: slaConfigData.totalProcessingTarget ?? stage.value,
            };
          default:
            return stage;
        }
      });
    } catch (error) {
      console.error('Failed to map SLA configuration from API', error);
      return null;
    }
  }, [slaConfigData]);

  const slaStages = editedSlaStages ?? apiSlaStages ?? storedSlaStages;

  const documentsFromApi = useMemo<DocumentConfigItem[]>(() => {
    if (!documentsData || documentsData.length === 0) return [];

    return documentsData.map((preset) => ({
      id: preset._id,
      name: preset.documentName,
      required: preset.isRequired ? 'Required' : 'Optional',
      hasExpiry: preset.hasExpiry.toLowerCase() === 'yes' ? 'Yes' : 'No',
      renewalFrequency: preset.renewalFrequency,
    }));
  }, [documentsData]);

  const documents = editedDocuments ?? documentsFromApi;

  // Mirror SLA configuration into global Redux when available
  useEffect(() => {
    if (!slaConfigData) return;

    dispatch(setSlaConfig(slaConfigData));
  }, [slaConfigData, dispatch]);

  // Handlers
  const handleTabChange = useCallback((tab: SettingsTabId) => {
    setActiveTab(tab);
  }, []);

  const handleMdasPageChange = useCallback((page: number) => {
    setMdasCurrentPage(page);
  }, []);

  const handleSlaStagesChange = useCallback((stages: SlaStageConfig[]) => {
    setEditedSlaStages(stages);
  }, []);

  const handleDocumentsChange = useCallback((docs: DocumentConfigItem[]) => {
    setEditedDocuments(docs);
  }, []);

  const handleSave = useCallback(() => {
    setSaving(true);

    const payload: Partial<{
      deskOfficerReview: number;
      registrarReview: number;
      clarificationResponse: number;
      paymentVerification: number;
      totalProcessingTarget: number;
    }> = {};

    const getValue = (id: string) => slaStages.find((s) => s.id === id)?.value;

    const deskOfficerReview = getValue('desk-officer-review');
    const registrarReview = getValue('registrar-review');
    const clarificationResponse = getValue('clarification-response');
    const paymentVerification = getValue('payment-verification');
    const totalProcessingTarget = getValue('total-processing-target');

    if (deskOfficerReview !== undefined) payload.deskOfficerReview = deskOfficerReview;
    if (registrarReview !== undefined) payload.registrarReview = registrarReview;
    if (clarificationResponse !== undefined) payload.clarificationResponse = clarificationResponse;
    if (paymentVerification !== undefined) payload.paymentVerification = paymentVerification;
    if (totalProcessingTarget !== undefined) payload.totalProcessingTarget = totalProcessingTarget;

    updateSlaConfig(payload)
      .unwrap()
      .then(() => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('slaStages', JSON.stringify(slaStages));
        }

        setDialog({
          open: true,
          title: 'Settings saved',
          description: 'Your configuration changes have been saved successfully.',
          variant: 'default',
        });
      })
      .catch((error) => {
        console.error('Failed to save settings', error);
        setDialog({
          open: true,
          title: 'Save failed',
          description: "We couldn't save your changes. Please try again.",
          variant: 'destructive',
        });
      })
      .finally(() => {
        setSaving(false);
      });
  }, [slaStages, updateSlaConfig]);

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
