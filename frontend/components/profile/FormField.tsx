'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface FormFieldProps {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'tel' | 'select' | 'number' | "password";
    value: string;
    placeholder?: string;
    disabled?: boolean;
    options?: { value: string; label: string }[];
    onChange: (value: string) => void;
    halfWidth?: boolean;
    hint?: string;
}

export default function FormField({
    label,
    name,
    type = 'text',
    value,
    placeholder,
    disabled = false,
    options = [],
    onChange,
    halfWidth = false,
    hint,
}: FormFieldProps) {
    const [showPassword, setShowPassword] = useState(false);
    if (type === 'select') {
        return (
            <div className={halfWidth ? 'w-full' : 'w-full'}>
                <Label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1.5 block">
                    {label}
                    {hint && <span className="ml-2 text-xs font-normal text-gray-500">{hint}</span>}
                </Label>
                <Select value={value} onValueChange={onChange} disabled={disabled}>
                    <SelectTrigger className="w-full bg-gray-50 border-gray-200">
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

    return (
        <div className={halfWidth ? 'w-full' : 'w-full'}>
            <Label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1.5 block">
                {label}
                {hint && <span className="ml-2 text-xs font-normal text-gray-500">{hint}</span>}
            </Label>
            <div className="relative">
                <Input
                    id={name}
                    name={name}
                    type={type === 'password' && !showPassword ? 'password' : type === 'password' ? 'text' : type}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-gray-50 border-gray-200 pr-10"
                />
                {type === 'password' && value && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                        disabled={disabled}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
