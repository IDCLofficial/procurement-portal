'use client';

import { useState, useMemo, useCallback } from 'react';
import { FileText, Clock, AlertCircle } from 'lucide-react';
import { useGetUsersQuery, useDeleteUserMutation } from '@/app/admin/redux/services/adminApi';
import type { User } from '@/app/admin/types/user';
import type { StatItem } from '@/app/admin/types';

export interface ResponseDialogState {
  open: boolean;
  title: string;
  message: string;
}

export interface UseUsersReturn {
  // Data
  users: User[];
  filteredUsers: User[];
  stats: StatItem[];
  
  // State
  searchQuery: string;
  response: ResponseDialogState;
  
  // Loading states
  isLoading: boolean;
  isDeleting: boolean;
  isError: boolean;
  error: unknown;
  
  // Handlers
  handleSearch: (query: string) => void;
  handleEdit: (userId: string) => void;
  handleResetPassword: (userId: string) => void;
  handleToggleStatus: (userId: string, newStatus: boolean) => void;
  handleDelete: (userId: string) => Promise<void>;
  closeResponseDialog: () => void;
  refetch: () => void;
}

export function useUsers(): UseUsersReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [response, setResponse] = useState<ResponseDialogState>({
    open: false,
    title: '',
    message: '',
  });

  // Fetch users data using RTK Query
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetUsersQuery();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Calculate stats based on the fetched users
  const stats = useMemo<StatItem[]>(() => {
    const userList = users as User[];
    return [
      {
        id: 1,
        name: 'Total Users',
        value: userList.length.toString(),
        icon: FileText,
        change: '+12%',
        changeType: 'increase' as const,
      },
      {
        id: 2,
        name: 'Active Users',
        value: userList.filter((user) => user?.isActive === true).length.toString(),
        icon: Clock,
        change: '+2%',
        changeType: 'increase' as const,
      },
  
      {
        id: 4,
        name: 'Desk Officers',
        value: userList.filter((user) => user?.role === 'Desk officer').length.toString(),
        icon: AlertCircle,
        change: '-1%',
        changeType: 'decrease' as const,
      },
    ];
  }, [users]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    const userList = users as User[];
    if (!searchQuery.trim()) return userList;
    
    const query = searchQuery.toLowerCase();
    return userList.filter(
      (user) =>
        user?.fullName?.toLowerCase().includes(query) ||
        user?.email?.toLowerCase().includes(query) ||
        user?.phoneNo?.includes(searchQuery)
    );
  }, [users, searchQuery]);

  // Handlers
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleEdit = useCallback((userId: string) => {
    // TODO: Implement edit user logic (e.g., open edit modal or navigate to edit page)
    console.log('Edit user:', userId);
  }, []);

  const handleResetPassword = useCallback((userId: string) => {
    // TODO: Implement reset password logic
    console.log('Reset password for user:', userId);
  }, []);

  const handleToggleStatus = useCallback((userId: string, newStatus: boolean) => {
    // TODO: Implement toggle status logic (e.g., call API to update user status)
    console.log('Toggle status for user:', userId, 'to:', newStatus);
  }, []);

  const handleDelete = useCallback(
    async (userId: string) => {
      try {
        await deleteUser(userId).unwrap();
        setResponse({
          open: true,
          title: 'Success',
          message: 'User has been deleted successfully.',
        });
      } catch (err) {
        console.error('Failed to delete user:', err);
        setResponse({
          open: true,
          title: 'Error',
          message: 'Failed to delete user. Please try again.',
        });
      }
    },
    [deleteUser]
  );

  const closeResponseDialog = useCallback(() => {
    setResponse((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    users: users as User[],
    filteredUsers,
    stats,
    searchQuery,
    response,
    isLoading,
    isDeleting,
    isError,
    error,
    handleSearch,
    handleEdit,
    handleResetPassword,
    handleToggleStatus,
    handleDelete,
    closeResponseDialog,
    refetch,
  };
}
