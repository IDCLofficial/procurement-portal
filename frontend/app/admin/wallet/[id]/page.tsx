'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Wallet } from 'lucide-react';
import { useAppSelector } from '@/app/admin/redux/hooks';
import { useGetWalletSummaryQuery, useGetRecentTransactionsQuery, useCompleteCashoutMutation } from '@/app/admin/redux/services/walletApi';
import { useLogout } from '@/app/admin/hooks/useLogout';
import WalletHeader from '@/components/admin/wallet/WalletHeader';
import WalletStatsSection from '@/components/admin/wallet/WalletStatsSection';
import RecentTransactions from '@/components/admin/wallet/RecentTransactions';
import QuickActions from '@/components/admin/wallet/QuickActions';
import CashOutDialog from '@/components/admin/wallet/CashOutDialog';
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
        const entities: Array<'IIRS' | 'MDA' | 'BPPPI' | 'IDCL'> = ['IIRS', 'MDA', 'BPPPI', 'IDCL'];
        
        for (const entity of entities) {
          const entityKey = entity.toLowerCase() as 'iirs' | 'mda' | 'bpppi' | 'idcl';
          const amount = summary.unremitted.entities[entityKey].amount;
          
          if (amount > 0) {
            await completeCashout({
              userId: user.id,
              entity: entity,
              amount: amount,
              description: cashoutDescription || `Cashout to ${entity}`,
            }).unwrap();
          }
        }
        
        setShowCashOutDialog(false);
        setConfirmationText('');
        setCashoutDescription('');
      } catch (error) {
        console.error('Failed to complete cashout:', error);
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
          title="Total Remitted"
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
    </div>
  );
}
