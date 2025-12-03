'use client';

import { useState, useEffect } from 'react';
import { useGetUsersQuery } from '@/app/admin/redux/services/adminApi';
import type { User } from '@/app/admin/types/user';
import { ConfirmationDialog } from '@/app/admin/components/general/confirmation-dialog';
import { useAssignApplicationMutation } from '@/app/admin/redux/services/appApi';

interface DeskOfficerTabProps {
  applicationId: string;
  assignedTo?: string;
  allowDeskOfficerAssignment: boolean;
  currentStatus?: string;
}

export function DeskOfficerTab({
  applicationId,
  assignedTo,
  allowDeskOfficerAssignment,
  currentStatus,
}: DeskOfficerTabProps) {
  const [selectedDeskOfficer, setSelectedDeskOfficer] = useState('');
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [assignedOfficerName, setAssignedOfficerName] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [officerToAssign, setOfficerToAssign] = useState<User | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  useEffect(() => {
    if (assignedTo && assignedTo !== 'Unassigned') {
      setAssignedOfficerName(assignedTo);
    } else {
      setAssignedOfficerName(null);
    }
  }, [assignedTo]);

  const normalizedStatus = (currentStatus || '').toUpperCase();
  const isAssignmentLocked = [
    'FORWARDED TO REGISTRAR',
    'PENDING PAYMENT',
    'CLARIFICATION REQUESTED',
    'APPROVED',
  ].includes(normalizedStatus);

  const { data: users = [], isLoading: isUsersLoading } = useGetUsersQuery();
  console.log(users);
  const deskOfficers = (users as User[]).filter((user) => user?.role === 'Desk officer');

  const [assignApplication, { isLoading: isAssigning }] = useAssignApplicationMutation();

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-gray-900">Desk Officer</h2>
     
      {assignedOfficerName ? (
        <p className="text-lg font-bold text-green-600">
          This application has been assigned to {assignedOfficerName}.
        </p>
      ) : (
        <p className="text-sm text-gray-600">
          {allowDeskOfficerAssignment
            ? 'Assign a desk officer to this application.'
            : 'No desk officer has been assigned to this application yet.'}
        </p>
      )}
      {allowDeskOfficerAssignment && !isAssignmentLocked && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-gray-500" htmlFor="desk-officer-select">
              Select Desk Officer
            </label>
            <select
              id="desk-officer-select"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={selectedDeskOfficer}
              onChange={(e) => setSelectedDeskOfficer(e.target.value)}
              disabled={isUsersLoading || deskOfficers.length === 0}
            >
              <option value="">
                {isUsersLoading
                  ? 'Loading desk officers...'
                  : deskOfficers.length === 0
                  ? 'No desk officers available'
                  : 'Select desk officer'}
              </option>
              {deskOfficers.map((officer) => (
                <option key={officer.id} value={officer.id}>
                  {officer.fullName}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              disabled={!selectedDeskOfficer || isUsersLoading || deskOfficers.length === 0 || isAssigning}
              onClick={() => {
                const officer = deskOfficers.find((user) => user.id === selectedDeskOfficer);
                if (!officer) return;
                setOfficerToAssign(officer);
                setIsConfirmDialogOpen(true);
              }}
              className={`inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                selectedDeskOfficer && !isUsersLoading && deskOfficers.length > 0
                  ? 'custom-green hover:bg-green-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {assignedOfficerName ? 'Reassign to another desk officer' : 'Assign Desk Officer'}
            </button>
          </div>
        </div>
      )}
      {allowDeskOfficerAssignment && (
        <>
          <ConfirmationDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={async () => {
              if (!officerToAssign) return;
              try {
                await assignApplication({
                  applicationId,
                  userId: officerToAssign.id,
                  userName: officerToAssign.fullName,
                }).unwrap();
                setAssignedOfficerName(officerToAssign.fullName);
                setIsConfirmDialogOpen(false);
                setIsSuccessDialogOpen(true);
              } catch (error) {
                console.error('Failed to assign desk officer', error);
                setIsConfirmDialogOpen(false);
                setIsErrorDialogOpen(true);
              }
            }}
            title={assignedOfficerName ? 'Reassign desk officer' : 'Assign desk officer'}
            description={`Are you sure you want to ${assignedOfficerName ? 'reassign' : 'assign'} this application to ${officerToAssign?.fullName ?? 'this desk officer'}?`}
            confirmText={assignedOfficerName ? 'Yes, reassign' : 'Yes, assign'}
            cancelText="Cancel"
            loading={isAssigning}
          />
          <ConfirmationDialog
            isOpen={isSuccessDialogOpen}
            onClose={() => setIsSuccessDialogOpen(false)}
            onConfirm={() => setIsSuccessDialogOpen(false)}
            title="Desk officer assigned"
            description="The desk officer has been successfully assigned to this application."
            confirmText="OK"
            cancelText="Close"
          />
          <ConfirmationDialog
            isOpen={isErrorDialogOpen}
            onClose={() => setIsErrorDialogOpen(false)}
            onConfirm={() => setIsErrorDialogOpen(false)}
            title="Assignment failed"
            description="There was a problem assigning this application. Please try again."
            confirmText="OK"
            cancelText="Close"
            variant="destructive"
          />
        </>
      )}
    </div>
  );
}
