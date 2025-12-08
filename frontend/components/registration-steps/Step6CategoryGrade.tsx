'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
    selectedSector: string;
    selectedGrade: string;
    onSectorChange: (sector: string) => void;
    onGradeChange: (grade: string) => void;
    sectors: Sector[];
    grades: Grade[];
}

export default function Step6CategoryGrade({
    selectedSector,
    selectedGrade,
    onSectorChange,
    onGradeChange,
    sectors,
    grades,
}: Step6CategoryGradeProps) {

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString()}`;
    };

    return (
        <div className="space-y-8">
            {/* Sector Selection */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select Sector
                </h3>
                <Select value={selectedSector} onValueChange={onSectorChange}>
                    <SelectTrigger className="w-full h-auto min-h-12">
                        <SelectValue placeholder="Select a sector">
                            {selectedSector && (
                                <div className="flex flex-col items-start gap-1 py-1">
                                    <span className="font-semibold text-gray-900">
                                        {sectors.find(s => s.id === selectedSector)?.name}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {sectors.find(s => s.id === selectedSector)?.description}
                                    </span>
                                </div>
                            )}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {sectors.map((sector) => (
                            <SelectItem key={sector.id} value={sector.id}>
                                <div className="flex flex-col items-start gap-1 py-1">
                                    <span className="font-semibold text-gray-900">
                                        {sector.name}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {sector.description}
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Grade Selection */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select Grade
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {grades.map((grade) => {
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
