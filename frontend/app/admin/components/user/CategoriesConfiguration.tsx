'use client';

import { Edit, Trash2, Plus } from 'lucide-react';

export interface SectorConfig {
  id: string;
  sector: string;
  grade: string;
  fee: string;
  effectiveDate: string;
}

export interface GradeConfig {
  id: string;
  code: string;
  description: string;
  threshold: string;
}

interface CategoriesConfigurationProps {
  sectors: SectorConfig[];
  grades: GradeConfig[];
  onChangeSectors?: (sectors: SectorConfig[]) => void;
  onChangeGrades?: (grades: GradeConfig[]) => void;
}

export function CategoriesConfiguration({
  sectors,
  grades,
  onChangeSectors,
  onChangeGrades,
}: CategoriesConfigurationProps) {
  const updateSectors = (next: SectorConfig[]) => {
    if (onChangeSectors) onChangeSectors(next);
  };

  const updateGrades = (next: GradeConfig[]) => {
    if (onChangeGrades) onChangeGrades(next);
  };

  const handleSectorChange = (id: string, sectorName: string) => {
    const next = sectors.map((sector) =>
      sector.id === id ? { ...sector, sector: sectorName } : sector,
    );
    updateSectors(next);
  };

  const handleSectorDetailsChange = (
    id: string,
    field: keyof Omit<SectorConfig, 'id' | 'sector'>,
    value: string,
  ) => {
    const next = sectors.map((sector) =>
      sector.id === id ? { ...sector, [field]: value } : sector,
    );
    updateSectors(next);
  };

  const handleAddSector = () => {
    const next: SectorConfig[] = [
      ...sectors,
      {
        id: `sector-${Date.now()}`,
        sector: '',
        grade: '',
        fee: '',
        effectiveDate: '',
      },
    ];
    updateSectors(next);
  };

  const handleDeleteSector = (id: string) => {
    const next = sectors.filter((sector) => sector.id !== id);
    updateSectors(next);
  };

  const handleGradeChange = (
    id: string,
    field: keyof Omit<GradeConfig, 'id'>,
    value: string,
  ) => {
    const next = grades.map((grade) =>
      grade.id === id ? { ...grade, [field]: value } : grade,
    );
    updateGrades(next);
  };

  const handleAddGrade = () => {
    const next: GradeConfig[] = [
      ...grades,
      { id: `grade-${Date.now()}`, code: '', description: '', threshold: '' },
    ];
    updateGrades(next);
  };

  return (
    <div className="space-y-6">
      {/* Contractor Categories (Sectors) */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 pt-6 pb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Contractor Categories (Sectors)</h2>
            <p className="mt-1 text-xs text-[#A0AEC0]">
              Manage available contractor sectors
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddSector}
            className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Sector
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sectors.map((sector) => (
            <div
              key={sector.id}
              className="flex items-start justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800"
            >
              <div className="flex-1 space-y-2">
                <input
                  value={sector.sector}
                  onChange={(e) => handleSectorChange(sector.id, e.target.value)}
                  className="w-full bg-transparent border-0 focus:outline-none text-xs font-medium tracking-wide uppercase text-gray-800"
                  placeholder="Enter sector"
                />
              </div>
              <div className="flex items-start space-x-2 ml-3">
                <button
                  type="button"
                  className="p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                  aria-label="Edit sector"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSector(sector.id)}
                  className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50"
                  aria-label="Delete sector"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contractor Grades */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 pt-6 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Contractor Grades</h2>
            <p className="mt-1 text-xs text-[#A0AEC0]">
              Define grade levels with financial thresholds
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddGrade}
            className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Grade
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full divide-y divide-gray-100 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Grade</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Description</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Project Value Threshold</th>
                <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {grades.map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-gray-900">
                    <input
                      value={grade.code}
                      onChange={(e) => handleGradeChange(grade.id, 'code', e.target.value)}
                      className="w-12 bg-transparent border-0 focus:outline-none text-xs font-semibold text-gray-900 uppercase"
                      placeholder="A"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-700">
                    <input
                      value={grade.description}
                      onChange={(e) => handleGradeChange(grade.id, 'description', e.target.value)}
                      className="w-full bg-transparent border-0 focus:outline-none text-xs text-gray-700"
                      placeholder="Large Projects"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-700">
                    <input
                      value={grade.threshold}
                      onChange={(e) => handleGradeChange(grade.id, 'threshold', e.target.value)}
                      className="w-full bg-transparent border-0 focus:outline-none text-xs text-gray-700"
                      placeholder="Above ₦50M"
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        className="p-1.5 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        aria-label="Edit grade"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
