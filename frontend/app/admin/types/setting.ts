export interface Category {
  _id: string;
  sector: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  _id: string;
  category: string;
  grade: string;
  registrationCost: number;
  financialCapacity: number;
  renewalFee: number;
  createdAt: string;
  updatedAt: string;
}

export interface SlaConfig {
  _id: string;
  deskOfficerReview: number;
  registrarReview: number;
  clarificationResponse: number;
  paymentVerification: number;
  totalProcessingTarget: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  categories: Category[];
  grades: Grade[];
}
