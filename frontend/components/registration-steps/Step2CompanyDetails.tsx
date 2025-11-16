'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Step2CompanyDetailsProps {
    formData: {
        companyName: string;
        rcNumber: string;
        tinNumber: string;
        address: string;
        city: string;
        state: string;
    };
    onInputChange: (field: string, value: string) => void;
}

export default function Step2CompanyDetails({ formData, onInputChange }: Step2CompanyDetailsProps) {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                    id="companyName"
                    placeholder="ABC Construction Ltd"
                    value={formData.companyName}
                    onChange={(e) => onInputChange('companyName', e.target.value)}
                    className="mt-1.5"
                />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="rcNumber">RC/BN Number</Label>
                    <Input
                        id="rcNumber"
                        placeholder="RC1234567"
                        value={formData.rcNumber}
                        onChange={(e) => onInputChange('rcNumber', e.target.value)}
                        className="mt-1.5"
                    />
                </div>
                <div>
                    <Label htmlFor="tinNumber">TIN Number</Label>
                    <Input
                        id="tinNumber"
                        placeholder="TIN-12345678"
                        value={formData.tinNumber}
                        onChange={(e) => onInputChange('tinNumber', e.target.value)}
                        className="mt-1.5"
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="address">Company Address</Label>
                <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={(e) => onInputChange('address', e.target.value)}
                    className="mt-1.5"
                />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="city">City/LGA</Label>
                    <Input
                        id="city"
                        placeholder="Owerri"
                        value={formData.city}
                        onChange={(e) => onInputChange('city', e.target.value)}
                        className="mt-1.5"
                    />
                </div>
                <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                        id="state"
                        placeholder="Imo State"
                        value={formData.state}
                        onChange={(e) => onInputChange('state', e.target.value)}
                        className="mt-1.5"
                    />
                </div>
            </div>
        </div>
    );
}
