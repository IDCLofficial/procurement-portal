'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/admin/redux/hooks';
import { useLogout } from '@/app/admin/hooks/useLogout';
import { Wallet, DollarSign, ArrowUpRight, ArrowDownRight, Clock, CreditCard } from 'lucide-react';

export default function WalletDashboard() {
  const params = useParams();
  const router = useRouter();
  const logout = useLogout();
  const { user, isAuthenticated, initialized } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 rounded-full p-3">
                <Wallet className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Wallet Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push('/admin/wallet');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Total Remitted</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount Generated</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">₦0.00</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">IIRS Total Transactions</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <ArrowDownRight className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">MDA Total Transactions</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <ArrowDownRight className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">BPPPI Transactions</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">0</p>
                </div>
                <div className="bg-orange-100 rounded-full p-3">
                  <ArrowDownRight className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Number of Payments</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">0</p>
                </div>
                <div className="bg-indigo-100 rounded-full p-3">
                  <CreditCard className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Cashout</p>
                  <p className="text-3xl font-bold text-teal-600 mt-2">₦0.00</p>
                  <p className="text-xs text-gray-500 mt-1">No cashout yet</p>
                </div>
                <div className="bg-teal-100 rounded-full p-3">
                  <ArrowUpRight className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Unremitted Payment</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount Generated</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">₦0.00</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">IIRS Total Transactions</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <ArrowDownRight className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">MDA Total Transactions</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <ArrowDownRight className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">BPPPI Transactions</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">0</p>
                </div>
                <div className="bg-orange-100 rounded-full p-3">
                  <ArrowDownRight className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Number of Payments</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">0</p>
                </div>
                <div className="bg-indigo-100 rounded-full p-3">
                  <CreditCard className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Cashout</p>
                  <p className="text-3xl font-bold text-teal-600 mt-2">₦0.00</p>
                  <p className="text-xs text-gray-500 mt-1">No cashout yet</p>
                </div>
                <div className="bg-teal-100 rounded-full p-3">
                  <ArrowUpRight className="h-6 w-6 text-teal-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No transactions yet</p>
                <p className="text-sm text-gray-400 mt-2">Your transaction history will appear here</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-4">
              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Add Funds</p>
                    <p className="text-sm text-gray-500">Deposit money to your wallet</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <ArrowUpRight className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Send Money</p>
                    <p className="text-sm text-gray-500">Transfer funds to another wallet</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 rounded-full p-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Transaction History</p>
                    <p className="text-sm text-gray-500">View all your transactions</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </button>
            </div>
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
                <strong>Note:</strong> This is your personal wallet dashboard. All transactions are secured and monitored by BPPPI.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
