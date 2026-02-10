import { CreditCard, ArrowUpRight } from 'lucide-react';

interface QuickActionsProps {
  onCashOutClick: () => void;
}

export default function QuickActions({ onCashOutClick }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
      </div>
      <div className="p-6 space-y-4">
        <button
          onClick={onCashOutClick}
          className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 rounded-full p-2">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Cash Out</p>
              <p className="text-sm text-gray-500">Remit to the associated bank accounts</p>
            </div>
          </div>
          <ArrowUpRight className="h-5 w-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
