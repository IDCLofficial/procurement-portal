import { Building2, TrendingUp } from 'lucide-react';
import { MdaTransactionsResponse } from '@/app/admin/types/wallet';

interface MdaTransactionsProps {
  data?: MdaTransactionsResponse;
  isLoading: boolean;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string | null) => string;
}

export default function MdaTransactions({
  data,
  isLoading,
  formatCurrency,
  formatDate,
}: MdaTransactionsProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">MDA Transactions</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading MDA transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.transactions || data.transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">MDA Transactions</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No MDA transactions yet</p>
            <p className="text-sm text-gray-400 mt-2">MDA transaction data will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">{data.mdaName}</h2>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">
              <strong>{data.summary.totalTransactions}</strong> Transactions
            </span>
            <span className="text-green-600 font-semibold">
              {formatCurrency(data.summary.allocatedAmount)} Allocated
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Total Processing Fees: <strong className="text-gray-900">{formatCurrency(data.summary.totalProcessingFees)}</strong>
          </span>
        </div>

        <div className="space-y-2">
          {data.transactions.map((payment) => (
            <div
              key={payment._id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 text-sm">{payment.paymentId}</span>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      payment.status === 'verified'
                        ? 'bg-green-100 text-green-700'
                        : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {payment.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{payment.companyName}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>{payment.category}</span>
                  <span>•</span>
                  <span>Grade: {payment.grade}</span>
                  {payment.paymentDate && (
                    <>
                      <span>•</span>
                      <span>{formatDate(payment.paymentDate)}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Summary</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-blue-600">Total Transactions</p>
              <p className="font-semibold text-blue-900">{data.summary.totalTransactions}</p>
            </div>
            <div>
              <p className="text-blue-600">Total Allocated</p>
              <p className="font-semibold text-blue-900">{formatCurrency(data.summary.allocatedAmount)}</p>
            </div>
            <div>
              <p className="text-blue-600">Total Cashed Out</p>
              <p className="font-semibold text-blue-900">{formatCurrency(data.summary.totalCashedOut)}</p>
            </div>
            <div>
              <p className="text-blue-600">Available Balance</p>
              <p className="font-semibold text-blue-900">{formatCurrency(data.summary.availableBalance)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
