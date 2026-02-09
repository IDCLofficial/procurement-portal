'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { CategoriesResponse, MDAResponse } from '@/store/api/types';

interface Sector {
    id: string;
    name: string;
    description: string;
}

interface Step6CategoryGradeProps {
    selectedSector: string;
    selectedGrade: string;
    selectedMDA: string;
    onMDAChange: (mda: string) => void;
    onSectorChange: (sector: string) => void;
    onGradeChange: (grade: string) => void;
    sectors: Sector[];
    grades: CategoriesResponse["grades"];
    mdas: MDAResponse["mdas"];
}

export default function Step6CategoryGrade({
    selectedSector,
    selectedGrade,
    selectedMDA,
    onMDAChange,
    onSectorChange,
    onGradeChange,
    sectors,
    mdas,
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
                    Select <span>Your Category <span className="text-red-500 text-lg">*</span></span>
                </h3>
                <Select value={selectedSector} onValueChange={(value)=>onSectorChange(value)}>
                    <SelectTrigger className="w-full h-auto min-h-12">
                        <SelectValue placeholder="Select a ministry">
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
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select <abbr title="Ministries, Departments, and Agencies (government bodies)">MDA</abbr> <span className="text-red-500 text-lg">*</span>
                </h3>
                {mdas && <Select value={selectedMDA} onValueChange={(value)=>onMDAChange(value)}>
                    <SelectTrigger className="w-full h-auto min-h-12">
                        <SelectValue placeholder="Select a ministry">
                            {selectedMDA && (
                                <div className="flex flex-col items-start gap-1 py-1">
                                    <span className="font-semibold text-gray-900">
                                        {mdas.find(s => s.name === selectedMDA)?.name}
                                    </span>
                                </div>
                            )}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {mdas.map((mda) => (
                            <SelectItem key={mda.name} value={mda.name}>
                                <div className="flex flex-col items-start gap-1 py-1">
                                    <span className="font-semibold text-gray-900">
                                        {mda.name}
                                    </span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>}
            </div>

            {/* Grade Selection */}
            {selectedSector && <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Select Grade <span className="text-red-500 text-lg">*</span>
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {grades.filter((grade) => grade.category.toLowerCase() === selectedSector.toLowerCase()).sort((a, b) => String(a.grade).localeCompare(String(b.grade))).map((grade) => {
                        const isSelected = selectedGrade === grade.grade;
                        return (
                            <button
                                key={grade._id}
                                type="button"
                                onClick={() => onGradeChange(grade.grade)}
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
                                    {grade.grade}
                                </div>

                                {/* Registration Cost */}
                                <div className="mb-3 pb-3 border-b border-gray-200">
                                    <p className="text-xs text-gray-600 mb-1">Certificate Cost</p>
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
            </div>}

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
