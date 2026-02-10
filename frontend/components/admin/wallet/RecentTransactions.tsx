import { Clock, CreditCard } from 'lucide-react';
import { Transaction } from '@/app/admin/types/wallet';

interface RecentTransactionsProps {
  transactions?: Transaction[];
  isLoading: boolean;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string | null) => string;
}

export default function RecentTransactions({
  transactions,
  isLoading,
  formatCurrency,
  formatDate,
}: RecentTransactionsProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading transactions...</p>
          </div>
        ) : transactions && transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction._id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`rounded-full p-2 ${
                      transaction.status === 'verified'
                        ? 'bg-green-100'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100'
                        : 'bg-red-100'
                    }`}
                  >
                    <CreditCard
                      className={`h-4 w-4 ${
                        transaction.status === 'verified'
                          ? 'text-green-600'
                          : transaction.status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{transaction.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(transaction.paymentDate)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(transaction.amount)}</p>
                  <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No transactions yet</p>
            <p className="text-sm text-gray-400 mt-2">Your transaction history will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
