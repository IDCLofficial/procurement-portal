'use client';

import { InfoCards } from '@/app/admin/components/general/InfoCards';
import { SearchBar } from '@/app/admin/components/general/SearchBar';
import { AddUserButton } from '@/app/admin/components/user/addUserButton';
import { UserTable } from '@/app/admin/components/user/UserTable';
import { ResponseDialog } from '@/app/admin/components/user/ResponseDialog';
import { withProtectedRoute } from '@/app/admin/lib/protectedRoute';
import { useUsers } from '../_hooks';
import { LoadingSpinner, ErrorDisplay } from '../_components';

function Users() {
  const {
    filteredUsers,
    stats,
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
  } = useUsers();

  if (isLoading || isDeleting) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorDisplay message={`Error loading users: ${String(error)}`} />;
  }

  return (
    <main className="flex-1 overflow-y-auto focus:outline-none">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4 flex justify-between items-center">
            <h2 className="text-sm font-medium text-[#718096]">
              Manage staff accounts and permissions
            </h2>
            <AddUserButton />
          </div>

          <InfoCards stats={stats} />

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="w-full sm:max-w-md">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

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
