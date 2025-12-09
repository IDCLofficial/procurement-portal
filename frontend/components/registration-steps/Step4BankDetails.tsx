'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Step4BankDetailsProps {
    formData: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
    onInputChange: (field: string, value: string) => void;
}

const nigerianBanks = [
    'Access Bank',
    'Citibank',
    'Ecobank Nigeria',
    'Fidelity Bank',
    'First Bank of Nigeria',
    'First City Monument Bank (FCMB)',
    'Globus Bank',
    'Guaranty Trust Bank (GTBank)',
    'Heritage Bank',
    'Keystone Bank',
    'Polaris Bank',
    'Providus Bank',
    'Stanbic IBTC Bank',
    'Standard Chartered Bank',
    'Sterling Bank',
    'SunTrust Bank',
    'Titan Trust Bank',
    'Union Bank of Nigeria',
    'United Bank for Africa (UBA)',
    'Unity Bank',
    'Wema Bank',
    'Zenith Bank',
];

export default function Step4BankDetails({ formData, onInputChange }: Step4BankDetailsProps) {
    return (
        <div className="space-y-5">
            {/* Bank Name */}
            <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Select
                    value={formData.bankName}
                    onValueChange={(value) => onInputChange('bankName', value)}
                >
                    <SelectTrigger className="mt-1.5 w-full">
                        <SelectValue placeholder="Select Bank" />
                    </SelectTrigger>
                    <SelectContent>
                        {nigerianBanks.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                                {bank}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Account Number and Account Name */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                        id="accountNumber"
                        type="text"
                        placeholder="0123456789"
                        value={formData.accountNumber}
                        onChange={(e) => onInputChange('accountNumber', e.target.value)}
                        className="mt-1.5"
                        maxLength={10}
                    />
                </div>
                <div>
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input
                        id="accountName"
                        placeholder="ABC Construction Limited"
                        value={formData.accountName}
                        onChange={(e) => onInputChange('accountName', e.target.value)}
                        className="mt-1.5"
                    />
                </div>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    Bank details are optional now but will be useful for Phase 2 when contract payments are processed.
                </p>
            </div>
        </div>
    );
}
