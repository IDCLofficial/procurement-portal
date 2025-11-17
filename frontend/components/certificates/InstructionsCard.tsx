'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FaInfoCircle } from 'react-icons/fa';

interface InstructionsCardProps {
    title: string;
    instructions: string[];
}

export default function InstructionsCard({ title, instructions }: InstructionsCardProps) {
    return (
        <Card className="shadow-sm bg-white border border-gray-200">
            <CardContent className="px-6">
                <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <FaInfoCircle className="text-blue-600 text-sm" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-semibold text-blue-900 mb-3">{title}</h3>
                        <div className="space-y-1">
                            {instructions.map((instruction, index) => (
                                <p key={index} className="text-sm text-blue-700 leading-relaxed">
                                    {instruction}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
