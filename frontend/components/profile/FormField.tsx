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

interface FormFieldProps {
    label: string;
    name: string;
    type?: 'text' | 'email' | 'tel' | 'select' | 'number';
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
            <Input
                id={name}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-gray-50 border-gray-200"
            />
        </div>
    );
}
