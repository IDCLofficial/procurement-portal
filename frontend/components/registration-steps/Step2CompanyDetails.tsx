'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useDebounce } from '@/hooks/useDebounce';
import { lgaObject } from '@/lib/constants.const';
import { cn, isUrl } from '@/lib/utils';

interface Step2CompanyDetailsProps {
    formData: {
        companyName: string;
        cacNumber: string;
        tinNumber: string;
        address: string;
        lga: string;
        website: string;
    };
    onInputChange: (field: string, value: string) => void;
    onContinue?: () => void;
}

export default function Step2CompanyDetails({ formData, onInputChange }: Step2CompanyDetailsProps) {
    // Track which fields have been touched
    const [touched, setTouched] = useState({
        cacNumber: false,
        tinNumber: false,
    });

    // Debounced values for validation
    const debouncedCAC = useDebounce(formData.cacNumber, 500);
    const debouncedTIN = useDebounce(formData.tinNumber, 500);

    // CAC Number validation (Format: RC-6digits)
    const cacError = useMemo(() => {
        if (!debouncedCAC) return '';
        const cacRegex = /^RC-\d{6}$/;
        return !cacRegex.test(debouncedCAC) ? 'CAC format must be RC-XXXXXX (e.g., RC-123456)' : '';
    }, [debouncedCAC]);

    // TIN validation (Format: 8digits-4digits)
    const tinError = useMemo(() => {
        if (!debouncedTIN) return '';
        const tinRegex = /^\d{8}-\d{4}$/;
        return !tinRegex.test(debouncedTIN) ? 'TIN format must be XXXXXXXX-XXXX (e.g., 12345678-1234)' : '';
    }, [debouncedTIN]);

    return (
        <div className="space-y-5">
            {/* Legal Company Name */}
            <div>
                <Label htmlFor="companyName">Legal Company Name <span className="text-red-500">*</span></Label>
                <Input
                    id="companyName"
                    placeholder="ABC Construction Limited"
                    value={formData.companyName}
                    onChange={(e) => onInputChange('companyName', e.target.value)}
                    className="mt-1.5"
                    required
                />
            </div>

            {/* CAC Number and TIN */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="cacNumber">CAC Number <span className="text-red-500">*</span></Label>
                    <Input
                        id="cacNumber"
                        placeholder="RC-123456"
                        value={formData.cacNumber}
                        onChange={(e) => onInputChange('cacNumber', e.target.value.toUpperCase())}
                        onBlur={() => setTouched(prev => ({ ...prev, cacNumber: true }))}
                        className={`mt-1.5 ${touched.cacNumber && cacError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        required
                    />
                    {touched.cacNumber && cacError && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                            <FaTimesCircle /> {cacError}
                        </p>
                    )}
                    {touched.cacNumber && !cacError && debouncedCAC && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <FaCheckCircle /> Valid CAC number
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="tinNumber">TIN <span className="text-red-500">*</span></Label>
                    <Input
                        id="tinNumber"
                        placeholder="12345678-1234"
                        value={formData.tinNumber}
                        onChange={(e) => onInputChange('tinNumber', e.target.value)}
                        onBlur={() => setTouched(prev => ({ ...prev, tinNumber: true }))}
                        className={`mt-1.5 ${touched.tinNumber && tinError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        required
                    />
                    {touched.tinNumber && tinError && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                            <FaTimesCircle /> {tinError}
                        </p>
                    )}
                    {touched.tinNumber && !tinError && debouncedTIN && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <FaCheckCircle /> Valid TIN
                        </p>
                    )}
                </div>
            </div>

            {/* Business Address */}
            <div>
                <Label htmlFor="address">Business Address <span className="text-red-500">*</span></Label>
                <Textarea
                    id="address"
                    placeholder="Street address, city"
                    value={formData.address}
                    onChange={(e) => onInputChange('address', e.target.value)}
                    className="mt-1.5 min-h-[80px]"
                    required
                />
            </div>

            {/* LGA and Website */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="lga">LGA <span className="text-red-500">*</span></Label>
                    <Select
                        value={formData.lga}
                        onValueChange={(value) => onInputChange('lga', value)}
                    >
                        <SelectTrigger className="mt-1.5 w-full">
                            <SelectValue placeholder="Select LGA" />
                        </SelectTrigger>
                        <SelectContent>
                            {lgaObject.map((lga) => (
                                <SelectItem key={lga.value} value={lga.value}>
                                    {lga.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                        id="website"
                        type="url"
                        placeholder="https://www.yourcompany.com"
                        value={formData.website}
                        onChange={(e) => onInputChange('website', e.target.value)}
                        className={cn(
                            "mt-1.5",
                            formData.website && !isUrl(formData.website) ? "border-red-500" : ""
                        )}
                    />
                    {formData.website && !isUrl(formData.website) && (
                        <p className="text-xs text-red-500 mt-1">Please enter a valid website URL (e.g., https://www.example.com)</p>
                    )}
                </div>
            </div>
        </div>
    );
}
