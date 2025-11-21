'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Search by ID, description, or reference...' }: SearchInputProps) {
    return (
        <div className="flex-1">
            <label className="text-xs text-gray-600 mb-2 block">{"Search"}</label>
            <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="pl-10 bg-white border-gray-200"
                />
            </div>
        </div>
    );
}
