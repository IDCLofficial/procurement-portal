'use client';

interface CategoryBadgeProps {
    category: string;
    grade: string;
}

export default function CategoryBadge({ category, grade }: CategoryBadgeProps) {
    return (
        <div className="flex items-center justify-between py-3 px-4 border-b border-gray-200 last:border-0">
            <span className="text-sm text-gray-700">{category}</span>
            <span className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                {grade}
            </span>
        </div>
    );
}
