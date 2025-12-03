export type UserRole = 'Desk officer' | 'Registrar' | 'Auditor' 

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNo: string;
  role: UserRole;
  isActive: boolean;
  lastLogin: string;
  assignedApps: string;
}

export interface UserTableProps {
  users: User[];
  onEdit: (userId: string) => void;
  onResetPassword: (userId: string) => void;
  onToggleStatus: (userId: string, newStatus: boolean) => void;
  onDelete: (userId: string) => void;
}
