'use client';

import TabNavigation from '@/components/profile/TabNavigation';
import SubHeader from '@/components/SubHeader';
import { FaUser, FaBell, FaShieldAlt } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';
import { updateSearchParam } from '@/lib/utils';
import PersonalInformation from './PersonalInformationTab';
import NotificationTab from './NotificationTab';
import SecurityTab from './SecurityTab';

export default function AccountSettingsPage() {
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'account';

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
                    onTabChange={(tabe)=>updateSearchParam('tab', tabe)}
                />

                {/* Form Content */}
                <div>
                    {activeTab === 'account' && (
                        <PersonalInformation />
                    )}

                    {activeTab === 'notifications' && (
                        <NotificationTab />
                    )}

                    {activeTab === 'security' && (
                        <SecurityTab />
                    )}
                </div>
            </div>
        </div>
    );
}
