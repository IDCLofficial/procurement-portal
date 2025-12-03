"use client";

import { useState } from "react";
import { SettingsTabs, SettingsTabId } from "@/app/admin/components/user/SettingsTabs";
import { FeeConfigurationTable, FeeConfig } from "@/app/admin/components/user/FeeConfigurationTable";
import { SlaTimerConfiguration, type SlaStageConfig } from "@/app/admin/components/user/SlaTimerConfiguration";
import { CategoriesConfiguration, type SectorConfig, type GradeConfig } from "@/app/admin/components/user/CategoriesConfiguration";
import { RequiredDocumentsTable, type DocumentConfig } from "@/app/admin/components/user/RequiredDocumentsTable";
import { ConfirmationDialog } from "@/app/admin/components/general/confirmation-dialog";

const defaultSlaStages: SlaStageConfig[] = [
  {
    id: "desk-officer-review",
    label: "Desk Officer Review (Business Days)",
    description: "Time allowed for initial document review",
    value: 5,
  },
  {
    id: "registrar-review",
    label: "Registrar Review (Business Days)",
    description: "Time for final approval decision",
    value: 3,
  },
  {
    id: "clarification-response",
    label: "Clarification Response (Business Days)",
    description: "Time for vendor to respond to clarifications",
    value: 7,
  },
  {
    id: "payment-verification",
    label: "Payment Verification (Business Days)",
    description: "Time to verify payment status",
    value: 2,
  },
  {
    id: "total-processing-target",
    label: "Total Processing Target (Business Days)",
    description: "Overall target for complete application processing",
    value: 10,
    fullWidth: true,
  },
];

export default function SystemAdminSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("fees");

  const [fees, setFees] = useState<FeeConfig[]>([
    { id: "1", sector: "WORKS", grade: "A", fee: 180000, effectiveDate: "23/11/2025" },
    { id: "2", sector: "WORKS", grade: "B", fee: 120000, effectiveDate: "23/11/2025" },
    { id: "3", sector: "WORKS", grade: "C", fee: 90000, effectiveDate: "23/11/2025" },
    { id: "4", sector: "SUPPLIES", grade: "A", fee: 140000, effectiveDate: "23/11/2025" },
    { id: "5", sector: "SUPPLIES", grade: "B", fee: 100000, effectiveDate: "23/11/2025" },
    { id: "6", sector: "SUPPLIES", grade: "C", fee: 80000, effectiveDate: "23/11/2025" },
    { id: "7", sector: "SERVICES", grade: "A", fee: 150000, effectiveDate: "23/11/2025" },
    { id: "8", sector: "SERVICES", grade: "B", fee: 110000, effectiveDate: "23/11/2025" },
    { id: "9", sector: "SERVICES", grade: "C", fee: 85000, effectiveDate: "23/11/2025" },
    { id: "10", sector: "ICT", grade: "A", fee: 160000, effectiveDate: "23/11/2025" },
    { id: "11", sector: "ICT", grade: "B", fee: 120000, effectiveDate: "23/11/2025" },
    { id: "12", sector: "ICT", grade: "C", fee: 95000, effectiveDate: "23/11/2025" },
  ]);

  const [sectors, setSectors] = useState<SectorConfig[]>([
    {
      id: "sector-works",
      sector: "WORKS",
      grade: "",
      fee: "",
      effectiveDate: "",
    },
    {
      id: "sector-supplies",
      sector: "SUPPLIES",
      grade: "",
      fee: "",
      effectiveDate: "",
    },
    {
      id: "sector-services",
      sector: "SERVICES",
      grade: "",
      fee: "",
      effectiveDate: "",
    },
    {
      id: "sector-ict",
      sector: "ICT",
      grade: "",
      fee: "",
      effectiveDate: "",
    },
  ]);

  const [grades, setGrades] = useState<GradeConfig[]>([
    { id: "grade-a", code: "A", description: "Large Projects", threshold: "Above ₦50M" },
    { id: "grade-b", code: "B", description: "Medium Projects", threshold: "₦10M - ₦50M" },
    { id: "grade-c", code: "C", description: "Small Projects", threshold: "Below ₦10M" },
  ]);

  const [documents, setDocuments] = useState<DocumentConfig[]>([
    { id: "doc-cac", name: "CAC Incorporation Certificate", required: "Required", hasExpiry: "No", renewalFrequency: "N/A" },
    { id: "doc-tax", name: "Tax Clearance Certificate", required: "Required", hasExpiry: "Yes", renewalFrequency: "Annual" },
    { id: "doc-pencom", name: "PENCOM Certificate", required: "Required", hasExpiry: "Yes", renewalFrequency: "Annual" },
    { id: "doc-itf", name: "ITF Certificate", required: "Required", hasExpiry: "Yes", renewalFrequency: "Annual" },
    { id: "doc-nsitf", name: "NSITF Certificate", required: "Required", hasExpiry: "Yes", renewalFrequency: "Annual" },
    { id: "doc-affidavit", name: "Sworn Affidavit", required: "Required", hasExpiry: "No", renewalFrequency: "N/A" },
    { id: "doc-bank-ref", name: "Bank Reference Letter", required: "Optional", hasExpiry: "No", renewalFrequency: "N/A" },
    { id: "doc-project-refs", name: "Past Project References", required: "Optional", hasExpiry: "No", renewalFrequency: "N/A" },
  ]);

  const [saving, setSaving] = useState(false);

  const [dialog, setDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    variant: "default" | "destructive";
  }>({
    open: false,
    title: "",
    description: "",
    variant: "default",
  });

  const [slaStages, setSlaStages] = useState<SlaStageConfig[]>(() => {
    if (typeof window === "undefined") return defaultSlaStages;
    try {
      const stored = window.localStorage.getItem("slaStages");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed as SlaStageConfig[];
        }
      }
    } catch (error) {
      console.error("Failed to load SLA stages from storage", error);
    }
    return defaultSlaStages;
  });

  const handleTabChange = (tab: SettingsTabId) => {
    setActiveTab(tab);
  };

  const handleSave = () => {
    try {
      setSaving(true);
      console.log("Save settings clicked", { fees, slaStages, sectors, grades, documents });

      if (typeof window !== "undefined") {
        window.localStorage.setItem("slaStages", JSON.stringify(slaStages));
      }

      setDialog({
        open: true,
        title: "Settings saved",
        description: "Your configuration changes have been saved successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to save settings", error);
      setDialog({
        open: true,
        title: "Save failed",
        description: "We couldn't save your changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDialogClose = () => {
    setDialog((prev) => ({ ...prev, open: false }));
  };

  return (
    <main className="flex-1 overflow-y-auto focus:outline-none bg-gray-50">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-6">
          <SettingsTabs activeTab={activeTab} onTabChange={handleTabChange} onSave={handleSave} />

          {activeTab === "fees" && (
            <FeeConfigurationTable
              fees={fees}
              onChange={setFees}
              onAddFee={() => console.log("Add fee")}
              onEditFee={(id) => console.log("Edit fee", id)}
              onDeleteFee={(id) => console.log("Delete fee", id)}
            />
          )}

          {activeTab === "sla" && (
            <SlaTimerConfiguration stages={slaStages} onChange={setSlaStages} />
          )}

          {activeTab === "categories" && (
            <CategoriesConfiguration
              sectors={sectors}
              grades={grades}
              onChangeSectors={setSectors}
              onChangeGrades={setGrades}
            />
          )}

          {activeTab === "documents" && (
            <RequiredDocumentsTable
              documents={documents}
              onChange={setDocuments}
              onAddDocument={() => console.log("Add document")}
              onEditDocument={(id) => console.log("Edit document", id)}
              onDeleteDocument={(id) => console.log("Delete document", id)}
            />
          )}
        </div>
      </div>
      <ConfirmationDialog
        isOpen={dialog.open}
        onClose={handleDialogClose}
        onConfirm={handleDialogClose}
        title={dialog.title}
        description={dialog.description}
        confirmText="OK"
        cancelText="Close"
        variant={dialog.variant}
        loading={saving}
      />
    </main>
  );
}