'use client';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
}

export function LoadingSpinner({ fullScreen = false, message }: LoadingSpinnerProps) {
  const containerClass = fullScreen
    ? 'flex justify-center items-center h-screen'
    : 'flex justify-center items-center py-12';

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-2">
        <span className="loader"></span>
        {message && <p className="text-sm text-gray-500">{message}</p>}
      </div>
    </div>
  );
}
