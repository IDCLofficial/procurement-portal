'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaUserPlus } from 'react-icons/fa';

interface Director {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    documentType: string;
    documentValue: string;
}

interface Step3DirectorsProps {
    directors: Director[];
    onDirectorsChange: (directors: Director[]) => void;
}

const documentTypes = [
    ['National Identification Number', 'NIN'],
    ['International Passport', 'Passport'],
    ['Driver\'s License', 'Drivers License'],
    ['Voter\'s Card', 'Voters Card'],
];

export default function Step3Directors({ directors, onDirectorsChange }: Step3DirectorsProps) {
    const handleAddDirector = () => {
        const newDirector: Director = {
            id: Date.now().toString(),
            fullName: '',
            phone: '',
            email: '',
            documentType: '',
            documentValue: '',
        };
        onDirectorsChange([...directors, newDirector]);
    };

    const handleRemoveDirector = (id: string) => {
        if (directors.length > 1) {
            onDirectorsChange(directors.filter(d => d.id !== id));
        }
    };

    const handleDirectorChange = (id: string, field: keyof Director, value: string) => {
        onDirectorsChange(
            directors.map(d => d.id === id ? { ...d, [field]: value } : d)
        );
    };

    return (
        <div className="space-y-6">
            {/* Directors List */}
            {directors.map((director, index) => (
                <div key={director.id} className="border rounded-lg p-6 space-y-4 bg-gray-50">
                    {/* Director Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Director {directors.length > 1 ? index + 1 : ""}
                        </h3>
                        {directors.length > 1 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveDirector(director.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                Remove
                            </Button>
                        )}
                    </div>

                    {/* Row 1: Full Name */}
                    <div>
                        <Label htmlFor={`fullName-${director.id}`}>
                            Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id={`fullName-${director.id}`}
                            placeholder="Jane Smith"
                            value={director.fullName}
                            onChange={(e) => handleDirectorChange(director.id, 'fullName', e.target.value)}
                            className="mt-1.5"
                            required
                        />
                    </div>

                    {/* Row 2: Phone and Email */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor={`phone-${director.id}`}>
                                Phone <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id={`phone-${director.id}`}
                                type="tel"
                                placeholder="+234 803 111 2222"
                                value={director.phone}
                                onChange={(e) => handleDirectorChange(director.id, 'phone', e.target.value)}
                                className="mt-1.5"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor={`email-${director.id}`}>
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id={`email-${director.id}`}
                                type="email"
                                placeholder="jane@abcconstruction.com"
                                value={director.email}
                                onChange={(e) => handleDirectorChange(director.id, 'email', e.target.value)}
                                className="mt-1.5"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 3: Document Type and Document Value */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor={`documentType-${director.id}`}>
                                Document Type <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={director.documentType}
                                onValueChange={(value) => handleDirectorChange(director.id, 'documentType', value)}
                            >
                                <SelectTrigger className="mt-1.5 w-full">
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {documentTypes.map((type) => (
                                        <SelectItem key={type[0]} value={type[1]}>
                                            {type[0]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor={`documentValue-${director.id}`}>
                                {director.documentType} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id={`documentValue-${director.id}`}
                                placeholder="Enter document number"
                                value={director.documentValue}
                                onChange={(e) => handleDirectorChange(director.id, 'documentValue', e.target.value)}
                                className="mt-1.5"
                                required
                            />
                        </div>
                    </div>
                </div>
            ))}

            {/* Add Another Director Button */}
            <Button
                type="button"
                variant="outline"
                onClick={handleAddDirector}
                className="w-full border-dashed border-2 py-6 hover:bg-gray-50"
            >
                <FaUserPlus className="mr-2" />
                Add Another Director
            </Button>

            {/* Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                    <strong>Note:</strong> NIN information is Mandatory but will not be displayed publicly.
                </p>
            </div>
        </div>
    );
}
