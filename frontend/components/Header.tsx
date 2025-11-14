'use client';

import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-lg shadow-black/5">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image
              src="/images/ministry-logo.png"
              alt="Ministry Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Imo State E-Procurement</h1>
            <p className="text-xs text-gray-500">Contractor Registration & Renewal Portal</p>
          </div>
        </div>
      </div>
    </header>
  );
}
