import { WalletSummary } from '@/app/admin/types/wallet';

interface RemittedPaymentSectionProps {
  summary: WalletSummary | undefined;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string | null) => string;
}

export default function RemittedPaymentSection({
  summary,
  formatCurrency,
  formatDate,
}: RemittedPaymentSectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Remitted Payment</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-emerald-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Remitted Amount</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(
                    (summary?.remitted?.totalAmountGenerated || 0) - 
                    (summary?.unremitted?.totalAmountGenerated || 0)
                  )}
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Calculated as: Total Transactions - Unremitted Payments
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-teal-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Last Cashout Amount</p>
                <p className="text-2xl font-bold text-teal-600">
                  {formatCurrency(summary?.remitted?.lastCashout?.amount || 0)}
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {formatDate(summary?.remitted?.lastCashout?.date || null)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-cyan-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Remittance Rate</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {summary?.remitted?.totalAmountGenerated 
                    ? (((summary.remitted.totalAmountGenerated - (summary?.unremitted?.totalAmountGenerated || 0)) / summary.remitted.totalAmountGenerated) * 100).toFixed(1)
                    : '0.0'
                  }%
                </p>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Percentage of total transactions remitted
          </p>
        </div>
      </div>
    </div>
  );
}
