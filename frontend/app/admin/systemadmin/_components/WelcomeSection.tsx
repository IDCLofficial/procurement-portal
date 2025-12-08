'use client';

interface WelcomeSectionProps {
  userName?: string;
}

export function WelcomeSection({ userName = 'Admin' }: WelcomeSectionProps) {
  return (
    <div className="mb-8 bg-[#04785733] p-6 rounded-md">
      <h2 className="text-2xl font-semibold text-gray-900">
        Welcome back, {userName}! 👋
      </h2>
      <p className="text-gray-600 mt-1">
        Take a look at your dashboard today.
      </p>
    </div>
  );
}
