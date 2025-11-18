'use client';

import { FaChevronDown } from 'react-icons/fa';

interface FilterDropdownProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}

export default function FilterDropdown({ label, value, options, onChange }: FilterDropdownProps) {
    return (
        <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                >
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
            </div>
        </div>
    );
}
