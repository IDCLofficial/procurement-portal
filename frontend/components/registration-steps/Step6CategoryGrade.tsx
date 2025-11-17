'use client';

import { FaCheck } from 'react-icons/fa';

interface Sector {
    id: string;
    name: string;
    description: string;
}

interface Grade {
    id: string;
    name: string;
    label: string;
    registrationCost: number;
    financialCapacity: number;
}

interface Step6CategoryGradeProps {
    selectedSectors: string[];
    selectedGrade: string;
    onSectorsChange: (sectors: string[]) => void;
    onGradeChange: (grade: string) => void;
}

// Mock data - will be replaced with API response
const mockSectors: Sector[] = [
    {
        id: 'works',
        name: 'WORKS',
        description: 'Construction & Engineering',
    },
    {
        id: 'services',
        name: 'SERVICES',
        description: 'Professional Services',
    },
    {
        id: 'supplies',
        name: 'SUPPLIES',
        description: 'Goods & Materials',
    },
    {
        id: 'ict',
        name: 'ICT',
        description: 'Information Technology',
    },
];

const mockGrades: Grade[] = [
    {
        id: 'a',
        name: 'A',
        label: 'Grade A',
        registrationCost: 150000,
        financialCapacity: 150000,
    },
    {
        id: 'b',
        name: 'B',
        label: 'Grade B',
        registrationCost: 100000,
        financialCapacity: 150000,
    },
    {
        id: 'c',
        name: 'C',
        label: 'Grade C',
        registrationCost: 70000,
        financialCapacity: 150000,
    },
    {
        id: 'd',
        name: 'D',
        label: 'Grade D',
        registrationCost: 40000,
        financialCapacity: 150000,
    },
];

export default function Step6CategoryGrade({
    selectedSectors,
    selectedGrade,
    onSectorsChange,
    onGradeChange,
}: Step6CategoryGradeProps) {
    const toggleSector = (sectorId: string) => {
        if (selectedSectors.includes(sectorId)) {
            onSectorsChange(selectedSectors.filter(id => id !== sectorId));
        } else {
            onSectorsChange([...selectedSectors, sectorId]);
        }
    };

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString()}`;
    };

    return (
        <div className="space-y-8">
            {/* Sectors Selection */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select Sectors (Multi-select)
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    {mockSectors.map((sector) => {
                        const isSelected = selectedSectors.includes(sector.id);
                        return (
                            <button
                                key={sector.id}
                                type="button"
                                onClick={() => toggleSector(sector.id)}
                                className={`relative p-6 rounded-lg border-2 text-left transition-all cursor-pointer active:scale-[0.98] ${
                                    isSelected
                                        ? 'border-theme-green bg-green-50'
                                        : 'border-gray-300 bg-white hover:border-gray-400'
                                }`}
                            >
                                {/* Checkbox */}
                                <div
                                    className={`absolute top-4 left-4 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                                        isSelected
                                            ? 'bg-theme-green border-theme-green'
                                            : 'bg-white border-gray-300'
                                    }`}
                                >
                                    {isSelected && <FaCheck className="text-white text-xs" />}
                                </div>

                                {/* Content */}
                                <div className="ml-8">
                                    <h4 className="font-bold text-gray-900 text-lg mb-1">
                                        {sector.name}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {sector.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Grade Selection */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select Grade
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mockGrades.map((grade) => {
                        const isSelected = selectedGrade === grade.id;
                        return (
                            <button
                                key={grade.id}
                                type="button"
                                onClick={() => onGradeChange(grade.id)}
                                className={`p-6 rounded-lg border-2 text-center transition-all cursor-pointer active:scale-[0.98] active:rotate-2 ${
                                    isSelected
                                        ? 'border-theme-green bg-green-50'
                                        : 'border-gray-300 bg-white hover:border-gray-400'
                                }`}
                            >
                                {/* Grade Circle */}
                                <div
                                    className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold transition-all ${
                                        isSelected
                                            ? 'bg-theme-green text-white'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {grade.name}
                                </div>

                                {/* Grade Label */}
                                <h4 className="font-semibold text-gray-900 mb-4">
                                    {grade.label}
                                </h4>

                                {/* Registration Cost */}
                                <div className="mb-3 pb-3 border-b border-gray-200">
                                    <p className="text-xs text-gray-600 mb-1">Registration Cost</p>
                                    <p className="font-bold text-gray-900">
                                        {formatCurrency(grade.registrationCost)}
                                    </p>
                                </div>

                                {/* Financial Capacity */}
                                <div>
                                    <p className="text-xs text-gray-600 mb-1">financial capacity</p>
                                    <p className="font-bold text-gray-900">
                                        {formatCurrency(grade.financialCapacity)}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Upgrade Policy */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                    Upgrade Policy:
                </h4>
                <p className="text-sm text-blue-900">
                    You can upgrade to a higher grade within the same year by paying the difference. 
                    Downgrades are not permitted within the same registration year.
                </p>
            </div>
        </div>
    );
}
