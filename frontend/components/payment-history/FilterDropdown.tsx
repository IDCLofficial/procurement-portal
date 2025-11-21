'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface FilterDropdownProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
}

export default function FilterDropdown({ label, value, onChange, options, placeholder = 'Select...' }: FilterDropdownProps) {
    return (
        <div className="flex-1">
            <label className="text-xs text-gray-600 mb-2 block">{label}</label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="bg-white border-gray-200 w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
