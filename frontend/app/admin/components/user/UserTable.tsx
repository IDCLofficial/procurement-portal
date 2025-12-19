'use client';

import { Edit, Trash2, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import { UserTableProps } from '@/app/admin/types/user';
import { ConfirmationDialog } from '@/app/admin/components/general/confirmation-dialog';
import { FormatDate } from '../../utils/dateFormateer';

export function UserTable({ users, onEdit, onToggleStatus, onDelete }: UserTableProps) {
  const [userToDelete, setUserToDelete] = useState<{id: string, name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(userToDelete.id);
      setUserToDelete(null);
    } catch {
      // Error handled by parent
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
  };

  const getRoleClasses = (role: string) => {
    switch (role.toLowerCase()) {
      case 'system-admin':
        return 'bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs';
      case 'registrar':
        return 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs';
      case 'desk officer':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs';
      case 'auditor':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs';
    }
  };


  return (
    <div className="overflow-x-auto bg-white p-2">
        <div className='p-6'>
            <h1>Staff Members</h1>
            <p className='text-[#718096]'>Manage user accounts and permissions</p>
        </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              MDA
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Login
            </th>
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Assigned Apps
            </th>
           
           <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                 
                  <div className="text-xs font-medium text-gray-900">{user?.fullName}</div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className={getRoleClasses(user.role)}>
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">{user?.email}</td>
              <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-500">{user?.phoneNo}</td>
              <td className="px-4 py-4 text-xs text-gray-500 w-48 break-word">
                {user?.mda}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{FormatDate(user.lastLogin)}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex flex-wrap gap-1 text-gray-500">
                  {user.assignedApps}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onEdit(user.id)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit user"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                
                  <button
                    onClick={() => handleDeleteClick(user?.id, user?.fullName)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete user"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ConfirmationDialog
        isOpen={!!userToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete User"
        variant="destructive"
        loading={isDeleting}
      />
    </div>
  );
}