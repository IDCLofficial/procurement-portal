'use client';

import Image from 'next/image';

export function LoginHeader() {
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <Image
          src="/images/ministry-logo.png"
          alt="Logo"
          width={80}
          height={80}
          className="mx-auto h-20 w-auto"
          priority
        />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-gray-900">Staff Portal Login</h2>
      <p className="mt-2 text-sm text-gray-600">Internal access for BPPPI officials</p>
    </div>
  );
}
