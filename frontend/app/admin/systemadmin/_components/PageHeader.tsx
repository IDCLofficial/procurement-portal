'use client';

import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="py-4 flex justify-between items-center">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-[#718096]">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
