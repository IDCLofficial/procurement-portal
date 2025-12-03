"use client";

import { useState } from 'react';
import Header from '../../components/id/header';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Lucide Icons
import {
  Home,
  FileText,
  FileCheck,
  Users,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  XCircle,
  ArrowUpCircle,
  DollarSign,
  Bell,
  ChevronDown,
  UserCircle2,
  ArrowUpRight,
  RefreshCw,
  Search,
  FileSearch,
  ClipboardList,
  BarChart3,
  LogOut,
  FileArchive,
  AlertCircle,
  ArrowUp,
  ArrowDownRight,
  FileQuestion,
  FileClock,
  PlusCircle,
  Upload,
} from 'lucide-react';
import SidebarUser from '../../components/id/sidebar';
import { useAppSelector } from '../../redux/hooks';
import { useGetApplicationsByUserQuery, useGetApplicationsQuery } from '../../redux/services/appApi';
import { FormatDate } from '@/app/admin/utils/dateFormateer';
 
interface Application {
  id: string;
  name: string;
  type: string;
  applicationStatus?: string;
  currentStatus?: string;
  submissionDate: string | Date;
  _id: string;
  grade?: string;
}

type RegistrarTab = 'new' | 'approved' | 'rejected';

export default function AdminApplications() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  console.log("user: ", user)
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [registrarTab, setRegistrarTab] = useState<RegistrarTab>('new');

  const isRegistrar = user?.role === 'Registrar';
  const {
    data: registrarData,
    isLoading: isRegistrarLoading,
    isError: isRegistrarError,
  } = useGetApplicationsQuery(
    {
      status:
        registrarTab === 'new'
          ? 'Forwarded to Registrar'
          : registrarTab === 'approved'
          ? 'Approved'
          : 'Rejected',
    },
    { skip: !isRegistrar }
  );

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useGetApplicationsByUserQuery(user?.id || '', {
    skip: !!isRegistrar,
  });

  const data = isRegistrar ? registrarData : userData;
  console.log(data);
  const isLoading = isRegistrar ? isRegistrarLoading : isUserLoading;
  const isError = isRegistrar ? isRegistrarError : isUserError;

  const applications: Application[] = data?.applications ?? [];
  const totalApplications = data?.total ?? applications.length;

  if (!isAuthenticated) {
    // Optionally redirect to login
    return <div>Loading...</div>;
  }

  // Mock data - replace with actual data from your API
  const stats = [
    { name: 'Total Contractors', value: '1,234', icon: Users, change: '+12%', changeType: 'increase' },
    { name: 'In Progress', value: '47', subValue: '18 desk - 12 registrar', icon: Clock, change: '+5%', changeType: 'increase' },
    { name: 'SLA Compliance', value: '94.2%', icon: ArrowUpCircle, change: '+2.1%', changeType: 'increase' },
    { name: 'SLA Breaches', value: '1', description: 'Requires immediate attention', icon: AlertTriangle, change: '-1', changeType: 'decrease' },
  ];

  const metrics = [
    { name: 'Approved This Month', value: '34', icon: CheckCircle2, change: '+12%', changeType: 'increase' },
    { name: 'Rejected This Month', value: '2', icon: XCircle, change: '-1', changeType: 'decrease' },
    { name: 'Avg. Processing Time', value: '6.5 days', icon: Clock, change: '-0.5 days', changeType: 'increase' },
    { name: 'Revenue (MTD)', value: '₦45.7M', icon: DollarSign, change: '+8.2%', changeType: 'increase' },
  ];

  const quickActions = [
    { name: 'Review New Applications', count: 10, icon: FileSearch },
    { name: 'Clarifications', count: 1, icon: RefreshCw },
    { name: 'SLA Breaches', count: 1, icon: AlertCircle },
    { name: 'Audit Logs', icon: FileText },
  ];

  const registrarTabs: { id: RegistrarTab; label: string }[] = [
    { id: 'new', label: 'New' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
  ];

  // ... rest of the component remains the same until the return statement

  return (
    <div className="flex h-screen bg-gray-50">
   
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Welcome Section */}
          

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Total Applications', value: '0', change: '0%', trend: 'up', icon: FileText },
              { title: 'Pending Review', value: '0', change: '0%', trend: 'up', icon: Clock },
              { title: 'Approved', value: '0', change: '0%', trend: 'up', icon: CheckCircle },
              { title: 'Rejected', value: '0', change: '0%', trend: 'down', icon: XCircle },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                    <div className={`flex items-center mt-2 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                      )}
                      {stat.change} from last week
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>
 
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
                <span className="text-sm text-gray-500">
                  {isLoading
                    ? 'Loading applications...'
                    : `Showing ${totalApplications} application${totalApplications === 1 ? '' : 's'}`}
                </span>
              </div>

              {isRegistrar && (
                <div className="w-full overflow-x-auto mb-4">
                  <div className="inline-flex w-full items-center space-x-1 rounded-full bg-gray-100 px-2 py-1">
                    {registrarTabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setRegistrarTab(tab.id)}
                        className={`whitespace-nowrap rounded-full px-4 py-2 w-full text-xs sm:text-sm font-medium transition-colors ${
                          registrarTab === tab.id
                            ? 'bg-white text-[#0A0A0A] shadow-sm'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 text-center text-gray-500">
                         <span className='loader my-6'></span>
                        </td>
                      </tr>
                    ) : isError ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 text-center text-red-500">
                          Failed to load applications.
                        </td>
                      </tr>
                    ) : applications.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-3 text-center text-gray-500">
                          No applications found.
                        </td>
                      </tr>
                    ) : (
                      applications.map((app) => (
                        console.log(app),
                        <tr key={app.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-900">{app.id}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-900">{app.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-900">{app.type}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {typeof (app.applicationStatus ?? app.currentStatus) === 'string'
                                ? (app.applicationStatus ?? app.currentStatus)
                                : ''}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                            {FormatDate(app.submissionDate)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-gray-900">{app.grade}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <Link
                              href={`/admin/${user?.id}/applications/${app._id}`}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              View details
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
