'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfirmationDialog } from '@/app/admin/components/general/confirmation-dialog';

export interface SlaStageConfig {
  id: string;
  label: string;
  description: string;
  value: number;
  fullWidth?: boolean;
}

interface SlaTimerConfigurationProps {
  stages: SlaStageConfig[];
  onChange?: (stages: SlaStageConfig[]) => void;
  onSave?: () => void;
}

export function SlaTimerConfiguration({ stages, onChange, onSave }: SlaTimerConfigurationProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleValueChange = (id: string, value: number) => {
    if (!onChange) return;
    const nextStages = stages.map((stage) =>
      stage.id === id ? { ...stage, value } : stage,
    );
    onChange(nextStages);
  };

  const handleSaveClick = () => {
    if (!onSave) return;
    setIsConfirmOpen(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 pt-6 pb-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">SLA Timer Configuration</h2>
          <p className="mt-1 text-xs text-[#A0AEC0]">
            Define review time limits for each stage
          </p>
        </div>
        {onSave && (
          <button
            type="button"
            onClick={handleSaveClick}
            className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 text-white px-3 py-1.5 text-xs font-medium shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save changes</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={cn('space-y-1', stage.fullWidth ? 'md:col-span-2' : '')}
          >
            <div className="text-xs font-medium text-gray-700">
              {stage.label}
            </div>
            <div className="mt-1 flex items-center">
              <div className="flex-1 rounded-lg bg-gray-100 px-3 py-2">
                <input
                  type="number"
                  value={Number.isFinite(stage.value) ? stage.value : ""}
                  onChange={(e) =>
                    handleValueChange(stage.id, Number(e.target.value || 0))
                  }
                  className="w-full border-0 bg-transparent text-sm text-gray-900 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
            <p className="text-[11px] text-[#A0AEC0]">{stage.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-800">
        <span className="font-semibold">Note: </span>
        SLA timers automatically pause when clarification is requested and resume when vendor responds.
      </div>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          if (!onSave) return;
          onSave();
          setIsConfirmOpen(false);
        }}
        title="Update SLA configuration"
        description="Are you sure you want to make these changes?"
        confirmText="Yes, save"
        cancelText="Cancel"
      />
    </div>
  );
}
