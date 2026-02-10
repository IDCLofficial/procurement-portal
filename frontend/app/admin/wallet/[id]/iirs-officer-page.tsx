'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Wallet, FileText, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { useAppSelector } from '@/app/admin/redux/hooks';
import { useGetIirsTransactionsQuery } from '@/app/admin/redux/services/walletApi';
import { useLogout } from '@/app/admin/hooks/useLogout';
import WalletHeader from '@/components/admin/wallet/WalletHeader';
import RecentTransactions from '@/components/admin/wallet/RecentTransactions';

export default function IirsOfficerWallet() {
  const params = useParams();
  const router = useRouter();
  const logout = useLogout();
  const { user, isAuthenticated, initialized } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  const { data: iirsTransactions, isLoading: isIirsTransactionsLoading } = useGetIirsTransactionsQuery(
    user?.id || '',
    { skip: !user?.id }
  );

  useEffect(() => {
    if (!initialized) return;

    if (!isAuthenticated) {
      router.replace('/admin/wallet');
      return;
    }

    if (user && params.id !== user.id) {
      router.replace(`/admin/wallet/${user.id}`);
      return;
    }

    setIsLoading(false);
  }, [initialized, isAuthenticated, user, params.id, router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/wallet');
  };

  if (isLoading || !user || isIirsTransactionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const totalTransactions = iirsTransactions?.summary.totalTransactions || 0;
  const totalProcessingFees = iirsTransactions?.summary.totalProcessingFees || 0;
  const allocatedAmount = iirsTransactions?.summary.allocatedAmount || 0;
  const totalCashedOut = iirsTransactions?.summary.totalCashedOut || 0;
  const availableBalance = iirsTransactions?.summary.availableBalance || 0;
  const iirsPercentage = iirsTransactions?.summary.iirsPercentage || '0%';
  
  const verifiedTransactions = iirsTransactions?.transactions.filter(t => t.status === 'verified') || [];
  const pendingTransactions = iirsTransactions?.transactions.filter(t => t.status === 'pending') || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <WalletHeader userName={user.name} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">IIRS Officer Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">Monitor IIRS transactions and cashout history • {iirsPercentage} allocation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalTransactions}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Processing Fees</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {formatCurrency(totalProcessingFees)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  From {totalTransactions} transactions
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Allocated Amount</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {formatCurrency(allocatedAmount)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {iirsPercentage} of processing fees
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cashed Out</p>
                <p className="text-2xl font-bold text-purple-600 mt-2">
                  {formatCurrency(totalCashedOut)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Balance: {formatCurrency(availableBalance)}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">IIRS Transactions</h2>
            <p className="text-sm text-gray-600 mt-1">{totalTransactions} total transactions</p>
          </div>
          <div className="p-6">
            {isIirsTransactionsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading transactions...</p>
              </div>
            ) : iirsTransactions?.transactions && iirsTransactions.transactions.length > 0 ? (
              <div className="space-y-3">
                {iirsTransactions.transactions.map((transaction) => (
                  <div key={transaction._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{transaction.paymentId}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.status === 'verified'
                            ? 'bg-green-100 text-green-700'
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                      <span className="font-bold text-gray-900">{formatCurrency(transaction.amount)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{transaction.companyName}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>Grade: {transaction.grade}</span>
                      <span>•</span>
                      <span>{transaction.companyMda}</span>
                      {transaction.paymentDate && (
                        <>
                          <span>•</span>
                          <span>{formatDate(transaction.paymentDate)}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No transactions yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Cashout History</h2>
            <p className="text-sm text-gray-600 mt-1">{iirsTransactions?.cashoutHistory.length || 0} cashouts completed</p>
          </div>
          <div className="p-6">
            {isIirsTransactionsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading cashout history...</p>
              </div>
            ) : iirsTransactions?.cashoutHistory && iirsTransactions.cashoutHistory.length > 0 ? (
              <div className="space-y-3">
                {iirsTransactions.cashoutHistory.map((cashout) => (
                  <div key={cashout._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{cashout.cashoutId}</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          {cashout.status}
                        </span>
                      </div>
                      <span className="font-bold text-green-600">{formatCurrency(cashout.amount)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{cashout.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>Transactions: {cashout.cashedOutTransactions.join(', ')}</span>
                      {cashout.cashoutDate && (
                        <>
                          <span>•</span>
                          <span>{formatDate(cashout.cashoutDate)}</span>
                        </>
                      )}
                    </div>
                    {cashout.notes && (
                      <p className="text-xs text-gray-500 mt-2 italic">{cashout.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No cashout history yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> As an IIRS Officer, you can view and monitor IIRS transactions. Contact your System Administrator for cashout requests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
