'use client';

import FormField from './FormField';
import FormRow from './FormRow';

interface DirectorCardProps {
    directorNumber: number;
    fullName: string;
    nin: string;
    email: string;
    phone: string;
}

export default function DirectorCard({
    directorNumber,
    fullName,
    nin,
    email,
    phone,
}: DirectorCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900">
                    Director {directorNumber}
                    {fullName && <span className="ml-2 font-normal text-gray-600">{fullName}</span>}
                </h3>
            </div>

            <div className="space-y-4">
                <FormRow columns={2}>
                    <FormField
                        label="Full Name"
                        name={`director${directorNumber}FullName`}
                        value={fullName}
                        placeholder="Enter full name"
                        onChange={() => {}}
                    />
                    <FormField
                        label="NIN"
                        name={`director${directorNumber}Nin`}
                        value={nin}
                        type='password'
                        placeholder="11-digit NIN"
                        hint="(Optional, not publicly visible)"
                        onChange={() => {}}
                    />
                </FormRow>

                <FormRow columns={2}>
                    <FormField
                        label="Email Address"
                        name={`director${directorNumber}Email`}
                        type="email"
                        value={email}
                        placeholder="director@company.com"
                        onChange={() => {}}
                    />
                    <FormField
                        label="Phone Number"
                        name={`director${directorNumber}Phone`}
                        type="tel"
                        value={phone}
                        placeholder="+234 803 321 8142 | +234 706 302 8377"
                        onChange={() => {}}
                    />
                </FormRow>
            </div>
        </div>
    );
}
