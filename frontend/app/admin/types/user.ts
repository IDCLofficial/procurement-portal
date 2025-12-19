export type UserRole = 'Admin' | 'Desk officer' | 'Registrar' | 'Auditor';

export interface User {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  phoneNo: string;
  role: UserRole;
  mda: string;
  isActive: boolean;
  lastLogin?: string;
  assignedApps?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserTableProps {
  users: User[];
  onEdit: (userId: string) => void;
  onResetPassword: (userId: string) => void;
  onToggleStatus: (userId: string, newStatus: boolean) => void;
  onDelete: (userId: string) => void;
}

// Auth user type (for Redux state)
export interface AuthUserState {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}
