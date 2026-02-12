'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Wallet, Building2 } from 'lucide-react';
import { useAppSelector } from '@/app/admin/redux/hooks';
import { useGetWalletSummaryQuery, useGetRecentTransactionsQuery, useCompleteCashoutMutation, useGetAllMdaTransactionsQuery } from '@/app/admin/redux/services/walletApi';
import { useLogout } from '@/app/admin/hooks/useLogout';
import WalletHeader from '@/components/admin/wallet/WalletHeader';
import WalletStatsSection from '@/components/admin/wallet/WalletStatsSection';
import RecentTransactions from '@/components/admin/wallet/RecentTransactions';
import QuickActions from '@/components/admin/wallet/QuickActions';
import CashOutDialog from '@/components/admin/wallet/CashOutDialog';
import RemittedPaymentSection from '@/components/admin/wallet/RemittedPaymentSection';
import DeskOfficerWallet from './desk-officer-page';
import IirsOfficerWallet from './iirs-officer-page';

export default function WalletDashboard() {
  const params = useParams();
  const router = useRouter();
  const logout = useLogout();
  const { user, isAuthenticated, initialized } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [showCashOutDialog, setShowCashOutDialog] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [cashoutDescription, setCashoutDescription] = useState('');
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [responseMessage, setResponseMessage] = useState({ type: 'success' as 'success' | 'error', message: '' });

  // Skip System Admin API calls if user is desk officer or IIRS officer
  const shouldSkipAdminCalls = !user?.id || user?.role === 'Desk officer' || user?.role === 'iirs';

  const { data: walletData, isLoading: isWalletLoading, error: walletError } = useGetWalletSummaryQuery(
    user?.id || '',
    { skip: shouldSkipAdminCalls }
  );

  const { data: recentTransactions, isLoading: isTransactionsLoading } = useGetRecentTransactionsQuery(
    user?.id || '',
    { skip: shouldSkipAdminCalls }
  );

  const { data: allMdaData, isLoading: isAllMdaLoading } = useGetAllMdaTransactionsQuery(
    undefined,
    { skip: shouldSkipAdminCalls }
  );
  console.log(allMdaData)

  const [completeCashout, { isLoading: isCreatingCashout }] = useCompleteCashoutMutation();

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

  // Check user role and render appropriate dashboard (after all hooks)
  if (user?.role === 'Desk officer') {
    return <DeskOfficerWallet />;
  }

  if (user?.role === 'iirs') {
    return <IirsOfficerWallet />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No cashout yet';
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleCashOutClick = () => {
    setShowCashOutDialog(true);
    setConfirmationText('');
    setCashoutDescription('');
  };

  const handleCashOutConfirm = async () => {
    if (confirmationText === 'yes, i am sure' && user?.id && summary) {
      try {
        await completeCashout().unwrap();
        
        setShowCashOutDialog(false);
        setConfirmationText('');
        setCashoutDescription('');
        
        setResponseMessage({
          type: 'success',
          message: 'Successfully completed cashout!'
        });
        setShowResponseDialog(true);
      } catch (error: any) {
        console.error('Failed to complete cashout:', error);
        setShowCashOutDialog(false);
        setResponseMessage({
          type: 'error',
          message: error?.data?.message || 'Failed to complete cashout. Please try again.'
        });
        setShowResponseDialog(true);
      }
    }
  };

  const handleCashOutCancel = () => {
    setShowCashOutDialog(false);
    setConfirmationText('');
    setCashoutDescription('');
  };

  if (isLoading || !user || isWalletLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wallet...</p>
        </div>
      </div>
    );
  }

  if (walletError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Wallet className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-red-600 font-semibold">Failed to load wallet data</p>
          <p className="text-sm text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  const summary = walletData;

  const handleLogout = () => {
    logout();
    router.push('/admin/wallet');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WalletHeader userName={user.name} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WalletStatsSection
          title="Total Transactions"
          summary={summary}
          type="remitted"
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />

        <WalletStatsSection
          title="Unremitted Payment"
          summary={summary}
          type="unremitted"
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />

        <RemittedPaymentSection
          summary={summary}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />

        {/* All MDA Transactions Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">All MDAs</h2>
              </div>
              <span className="text-sm text-gray-600">
                {Array.isArray(allMdaData?.mdas) ? allMdaData?.mdas.length : 0} Total MDAs
              </span>
            </div>
          </div>
          <div className="p-6">
            {isAllMdaLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading MDAs...</p>
              </div>
            ) : Array.isArray(allMdaData?.mdas) && allMdaData?.mdas.length > 0 ? (
              console.log("heelo",allMdaData),
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allMdaData?.mdas.map((mdaTransaction: any) => (
                  <div
                    key={mdaTransaction.mda}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm mb-2 truncate" title={mdaTransaction.mda}>
                          {mdaTransaction.mda}
                        </h3>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Total Fees:</span>
                            <span className="text-xs font-semibold text-gray-900">
                              {formatCurrency(mdaTransaction.totalProcessingFees)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Allocated:</span>
                            <span className="text-xs font-semibold text-green-600">
                              {formatCurrency(mdaTransaction.allocatedAmount)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Transactions:</span>
                            <span className="text-xs font-medium text-gray-700">
                              {mdaTransaction.transactionCount}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Payments:</span>
                            <span className="text-xs font-medium text-gray-700">
                              {mdaTransaction.payments?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No MDAs found</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentTransactions
            transactions={recentTransactions?.transactions}
            isLoading={isTransactionsLoading}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />

          <QuickActions onCashOutClick={handleCashOutClick} />
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
                <strong>Note:</strong> This is your personal wallet dashboard. All transactions are secured and monitored by BPPPI.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CashOutDialog
        open={showCashOutDialog}
        onOpenChange={setShowCashOutDialog}
        summary={summary}
        confirmationText={confirmationText}
        setConfirmationText={setConfirmationText}
        description={cashoutDescription}
        setDescription={setCashoutDescription}
        isCreating={isCreatingCashout}
        onConfirm={handleCashOutConfirm}
        onCancel={handleCashOutCancel}
        formatCurrency={formatCurrency}
      />

      {showResponseDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              {responseMessage.type === 'success' ? (
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <h3 className={`text-lg font-semibold mb-2 ${responseMessage.type === 'success' ? 'text-green-900' : 'text-red-900'}`}>
                {responseMessage.type === 'success' ? 'Success!' : 'Error!'}
              </h3>
              <p className="text-gray-600 mb-6">{responseMessage.message}</p>
              <button
                onClick={() => setShowResponseDialog(false)}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  responseMessage.type === 'success'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
