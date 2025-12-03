'use client';

import { useState } from 'react';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Application } from '@/app/admin/types';
import { InfoCards } from '@/app/admin/components/general/InfoCards';
import { StatItem } from '@/app/admin/types';
import { SearchBar } from '@/app/admin/components/general/SearchBar';
import { AddUserButton } from '@/app/admin/components/user/addUserButton';
import { UserTable } from '@/app/admin/components/user/UserTable';
import { useGetUsersQuery, useDeleteUserMutation } from '@/app/admin/redux/services/adminApi';
import { User } from '@/app/admin/types/user';
import { ResponseDialog } from '@/app/admin/components/user/ResponseDialog';
import { withProtectedRoute } from '@/app/admin/lib/protectedRoute';

function Users() {

  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch users data using RTK Query
  const { data: users = [], isLoading, isError, error, refetch } = useGetUsersQuery();
  console.log(users)
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [response, setResponse] = useState<{
    open: boolean;
    title: string;
    message: string;
  }>({
    open: false,
    title: '',
    message: ''
  });

  // Calculate stats based on the fetched users
  const stats: StatItem[] = [
    { 
      id: 1, 
      name: 'Total Users', 
      value: (users as User[]).length.toString(), 
      icon: FileText, 
      change: '+12%', 
      changeType: 'increase' as const 
    },
    { 
      id: 2, 
      name: 'Active Users', 
      value: (users as User[]).filter((user) => user?.isActive === true).length.toString(), 
      icon: Clock, 
      change: '+2%', 
      changeType: 'increase' as const 
    },
    { 
      id: 3, 
      name: 'Inactive Users', 
      value: (users as User[]).filter((user) => user?.isActive === false).length.toString(), 
      icon: CheckCircle, 
      change: '+5%', 
      changeType: 'increase' as const 
    },
    { 
      id: 4, 
      name: 'Desk Officers', 
      value: (users as User[]).filter((user: User) => user?.role === 'Desk officer').length.toString(), 
      icon: AlertCircle, 
      change: '-1%', 
      changeType: 'decrease' as const 
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
console.log(users)
  // Filter users based on search query
  const filteredUsers = (users as User[]).filter((user: User) => 
    user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user?.phoneNo?.includes(searchQuery)
  );

  // Handlers for user actions
  const handleEdit = (userId: string) => {
    console.log('Edit user:', userId);
  };

  const handleResetPassword = (userId: string) => {
    console.log('Reset password for user:', userId);
  };

  const handleToggleStatus = (userId: string, newStatus: 'active' | 'inactive') => {
    console.log(`Toggle status for user ${userId} to ${newStatus}`);
  };

  const handleDelete = async (userId: string) => {
    console.log(userId)
    try {
      await deleteUser(userId).unwrap();
      setResponse({
        open: true,
        title: 'Success',
        message: 'User has been deleted successfully.'
      });
    } catch (err) {
      console.error('Failed to delete user:', err);
      setResponse({
        open: true,
        title: 'Error',
        message: 'Failed to delete user. Please try again.'
      });
    }
  };

  const closeResponseDialog = () => {
    setResponse(prev => ({ ...prev, open: false }));
  };

  if (isLoading || isDeleting) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loader"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading users: {String(error)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto focus:outline-none">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4 flex justify-between items-center">
            <h2 className="text-sm font-medium text-[#718096]">Manage staff accounts and permissions</h2>
            <AddUserButton />
          </div>

          {/* Info cards */}
          <InfoCards stats={stats} />

          {/* Search and actions */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="w-full sm:max-w-md">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

          {/* Users table */}
          <div className="mt-6">
            <UserTable 
              users={filteredUsers}
              onEdit={handleEdit}
              onResetPassword={handleResetPassword}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
      <ResponseDialog
        open={response.open}
        title={response.title}
        message={response.message}
        onOpenChange={closeResponseDialog}
      />
    </main>
  );
}

export default withProtectedRoute(Users, { requiredRoles: ['Admin'] });