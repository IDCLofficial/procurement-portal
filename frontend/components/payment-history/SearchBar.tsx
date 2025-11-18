'use client';

import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search by ID, description, or reference...' }: SearchBarProps) {
    return (
        <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Search</label>
            <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
            </div>
        </div>
    );
}
