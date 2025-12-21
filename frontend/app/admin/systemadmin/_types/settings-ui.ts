export interface SectorConfig {
  id: string;
  sector: string;
  grade: string;
  fee: string;
  effectiveDate: string;
}

export interface GradeConfig {
  _id: string;
  category: string;
  grade: string;
  registrationCost: number;
  financialCapacity: number;
  renewalFee: number;
}
