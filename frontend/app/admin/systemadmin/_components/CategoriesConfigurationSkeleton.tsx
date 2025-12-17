'use client';

export function CategoriesConfigurationSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 pt-6 pb-6 animate-pulse">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-64 bg-gray-100 rounded" />
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2].map((key) => (
            <div
              key={key}
              className="flex items-start justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3"
            >
              <div className="flex-1 space-y-3">
                <div className="h-3 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-32 bg-gray-100 rounded" />
              </div>
              <div className="flex items-start space-x-2 ml-3">
                <div className="h-6 w-6 bg-gray-200 rounded-full" />
                <div className="h-6 w-6 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 pt-6 pb-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-64 bg-gray-100 rounded" />
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded-full" />
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <div className="min-w-full divide-y divide-gray-100 text-xs">
            {[1, 2, 3].map((row) => (
              <div key={row} className="flex items-center justify-between px-4 py-3">
                <div className="flex-1 flex space-x-4">
                  <div className="h-3 w-12 bg-gray-200 rounded" />
                  <div className="h-3 w-40 bg-gray-100 rounded" />
                  <div className="h-3 w-32 bg-gray-100 rounded" />
                </div>
                <div className="h-6 w-6 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
