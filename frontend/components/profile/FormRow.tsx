'use client';

interface FormRowProps {
    children: React.ReactNode;
    columns?: 1 | 2 | 3;
}

export default function FormRow({ children, columns = 1 }: FormRowProps) {
    const gridClass = columns === 2 ? 'grid-cols-1 md:grid-cols-2' : columns === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1';
    
    return (
        <div className={`grid ${gridClass} gap-4`}>
            {children}
        </div>
    );
}
