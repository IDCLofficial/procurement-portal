// ============================================================================
// API Response Types
// ============================================================================

import type { Application, Certificate } from './index';

// Auth Types
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    phoneNo?: string;
    isActive?: boolean;
  };
  token: string;
}

// User API Types
export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: string;
  phoneNo: string;
  mda?: string;
}

export interface CreateUserResponse {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  phoneNo: string;
  isActive: boolean;
  createdAt: string;
}

export interface UpdateUserRoleRequest {
  userId: string;
  role: string;
}

export interface DeleteUserResponse {
  success: boolean;
  id: string;
}

// Application API Types
export interface ApplicationsQueryParams {
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface StatusCounts {
  pendingReview: number;
  approved: number;
  rejected: number;
  forwardedToRegistrar: number;
}

export interface ApplicationsUserResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  statusCounts: StatusCounts;
  applications: Application[];
}
export interface ApplicationsResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  applications: Application[];
}


export interface AssignApplicationRequest {
  applicationId: string;
  userId: string;
  userName: string;
}

export interface ChangeApplicationStatusRequest {
  applicationId: string;
  applicationStatus: string;
  notes?: string;
}

// Certificate API Types
export interface CertificatesQueryParams {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  grade?: string;
  lga?: string;
}

export interface CertificatesResponse {
  total: number;
  page: number;
  limit: number;
  certificates: Certificate[];
  statusCounts?: {
    approved: number;
    expired: number;
    revoked: number;
  };
}

// Document API Types
export interface ChangeDocumentStatusRequest {
  documentId: string;
  documentStatus: string;
  message?: string;
}

export interface ChangeDocumentStatusResponse {
  success: boolean;
  document: {
    _id: string;
    status: {
      status: string;
      message?: string;
    };
  };
}

export interface DocumentPreset {
  _id: string;
  documentName: string;
  isRequired: boolean;
  hasExpiry: string;
  renewalFrequency: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export type DocumentsResponse = DocumentPreset[];

export interface CreateDocumentPresetRequest {
  documentName: string;
  isRequired: boolean;
  hasExpiry: string;
  renewalFrequency: string;
}

export type CreateDocumentPresetResponse = DocumentPreset;

export interface UpdateDocumentPresetRequest {
  documentName?: string;
  isRequired?: boolean;
  hasExpiry?: string;
  renewalFrequency?: string;
}

export type UpdateDocumentPresetResponse = DocumentPreset;

export type DeleteDocumentPresetResponse = DocumentPreset;

// Settings API Types
export interface CreateCategoryRequest {
  sector: string;
  description: string;
}

export interface CreateCategoryResponse {
  _id: string;
  sector: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGradeRequest {
  category: string;
  grade: string;
  registrationCost: number;
  financialCapacity: string;
  renewalFee: number;
}

export interface CreateGradeResponse {
  _id: string;
  category: string;
  grade: string;
  registrationCost: number;
  financialCapacity: number;
  renewalFee: number;
  createdAt: string;
  updatedAt: string;
}

export interface Mda {
  _id: string;
  name: string;
  code: string;
  __v?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MdasResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  mdas: Mda[];
}

export interface MdasQueryParams {
  page?: number;
  limit?: number;
}

export interface CreateMdaRequest {
  name: string;
  code: string;
}

export type CreateMdaResponse = Mda;

export interface UpdateMdaRequest {
  name?: string;
  code?: string;
}

export type UpdateMdaResponse = Mda;

export type DeleteMdaResponse = Mda;
