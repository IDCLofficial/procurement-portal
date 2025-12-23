'use client';

import TabNavigation from '@/components/profile/TabNavigation';
import SubHeader from '@/components/SubHeader';
import { FaUser, FaBell, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';
import { updateSearchParam } from '@/lib/utils';
import PersonalInformation from './PersonalInformationTab';
import NotificationTab from './NotificationTab';
import SecurityTab from './SecurityTab';
import { useGetVendorSettingsQuery } from '@/store/api/vendor.api';

export default function AccountSettingsPage() {
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'account';
    const { data: notifications, refetch, isLoading, isError } = useGetVendorSettingsQuery();

    const tabs = [
        {
            id: 'account',
            label: 'Account',
            icon: <FaUser />,
        },
        {
            id: 'notifications',
            label: 'Notifications',
            icon: <FaBell />,
        },
        {
            id: 'security',
            label: 'Security',
            icon: <FaShieldAlt />,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <SubHeader
                title='Account Settings'
                hasBackButton
            />

            <div className="container mx-auto px-4 py-6 max-w-4xl">
                {/* Tab Navigation */}
                <TabNavigation
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={(tab) => updateSearchParam('tab', tab)}
                />

                {/* Error State - Show at top if data exists */}
                {isError && notifications && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                        <FaExclamationTriangle className="text-red-500 mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-red-800 font-semibold mb-1">
                                Unable to refresh settings
                            </h3>
                            <p className="text-red-600 text-sm mb-3">
                                We encountered an error while fetching the latest data. You&apos;re viewing cached information.
                            </p>
                            <button
                                onClick={() => refetch()}
                                className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading ? (
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-600">Loading settings...</p>
                        </div>
                    </div>
                ) : isError && !notifications ? (
                    /* Error State - No cached data */
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <FaExclamationTriangle className="text-red-500 text-2xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Failed to load settings
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-md">
                                We couldn&apos;t retrieve your account settings. Please check your connection and try again.
                            </p>
                            <button
                                onClick={() => refetch()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                ) : !notifications ? (
                    /* No Data State */
                    <div className="bg-white rounded-lg shadow-sm p-8">
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FaShieldAlt className="text-gray-400 text-2xl" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No settings available
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-md">
                                We couldn&apos;t find any settings data for your account. This might be because your account is newly created.
                            </p>
                            <button
                                onClick={() => refetch()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Content */
                    <div>
                        {activeTab === 'account' && (
                            <PersonalInformation />
                        )}

                        {activeTab === 'notifications' && (
                            <NotificationTab notifications={notifications.settings} />
                        )}

                        {activeTab === 'security' && (
                            <SecurityTab notifications={notifications.settings} />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}