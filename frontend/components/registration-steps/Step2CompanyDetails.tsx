'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

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

const imoLGAs = [
    'Aboh Mbaise', 'Ahiazu Mbaise', 'Ehime Mbano', 'Ezinihitte', 'Ideato North',
    'Ideato South', 'Ihitte/Uboma', 'Ikeduru', 'Isiala Mbano', 'Isu',
    'Mbaitoli', 'Ngor Okpala', 'Njaba', 'Nkwerre', 'Nwangele',
    'Obowo', 'Oguta', 'Ohaji/Egbema', 'Okigwe', 'Onuimo',
    'Orlu', 'Orsu', 'Oru East', 'Oru West', 'Owerri Municipal',
    'Owerri North', 'Owerri West'
];

export default function Step2CompanyDetails({ formData, onInputChange }: Step2CompanyDetailsProps) {
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
                        placeholder="RC1234567"
                        value={formData.cacNumber}
                        onChange={(e) => onInputChange('cacNumber', e.target.value)}
                        className="mt-1.5"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="tinNumber">TIN <span className="text-red-500">*</span></Label>
                    <Input
                        id="tinNumber"
                        placeholder="TIN-12345678"
                        value={formData.tinNumber}
                        onChange={(e) => onInputChange('tinNumber', e.target.value)}
                        className="mt-1.5"
                        required
                    />
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
                            {imoLGAs.map((lga) => (
                                <SelectItem key={lga} value={lga}>
                                    {lga}
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
                        placeholder="www.abcconstruction.com"
                        value={formData.website}
                        onChange={(e) => onInputChange('website', e.target.value)}
                        className="mt-1.5"
                    />
                </div>
            </div>
        </div>
    );
}
