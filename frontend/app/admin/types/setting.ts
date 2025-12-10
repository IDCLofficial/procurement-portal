export interface Category {
  _id: string;
  sector: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  _id: string;
  grade: string;
  registrationCost: number;
  financialCapacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  categories: Category[];
  grades: Grade[];
}
