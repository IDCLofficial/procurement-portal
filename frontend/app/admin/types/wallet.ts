export interface RemittedEntity {
  amount: number;
  percentage: string;
  count: number;
}

export interface UnremittedEntity {
  amount: number;
  percentage: string;
  allocated: number;
}

export interface WalletSummary {
  remitted: {
    totalAmountGenerated: number;
    iirsTransactions: number;
    mdaTransactions: number;
    bpppiTransactions: number;
    totalPayments: number;
    lastCashout: {
      amount: number;
      date: string | null;
    };
    entities: {
      iirs: RemittedEntity;
      mda: RemittedEntity;
      bpppi: RemittedEntity;
      moj: RemittedEntity;
    };
  };
  unremitted: {
    totalAmountGenerated: number;
    iirsTransactions: number;
    mdaTransactions: number;
    bpppiTransactions: number;
    totalPayments: number;
    entities: {
      iirs: UnremittedEntity;
      mda: UnremittedEntity;
      bpppi: UnremittedEntity;
      moj: UnremittedEntity;
    };
  };
  summary: {
    totalAmountGenerated: number;
    totalRemitted: number;
    totalUnremitted: number;
    totalNumberOfPayments: number;
  };
}

export interface Transaction {
  _id: string;
  paymentId: string;
  amount: number;
  status: 'verified' | 'pending' | 'failed';
  description: string;
  category: string;
  grade: string;
  transactionReference: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  companyName: string;
  companyMda: string;
  vendorEmail: string;
}

export interface TransactionStats {
  verified: {
    count: number;
    totalAmount: number;
  };
  pending: {
    count: number;
    totalAmount: number;
  };
}

export interface RecentTransactionsResponse {
  transactions: Transaction[];
  count: number;
  stats: TransactionStats;
  recentCashouts: any[];
  cashoutCount: number;
}

export interface CreateCashoutRequest {
  userId: string;
  entity: 'IIRS' | 'MDA' | 'BPPPI' | 'MOJ';
  amount: number;
  description: string;
}

export interface WalletSummaryResponse {
  success: boolean;
  data: WalletSummary;
  message?: string;
}

export interface MdaPayment {
  _id: string;
  paymentId: string;
  amount: number;
  companyName: string;
  companyId: string;
  category: string;
  grade: string;
  description: string;
  paymentDate?: string;
  createdAt: string;
  status: 'verified' | 'pending' | 'failed';
}

export interface MdaTransaction {
  totalProcessingFees: number;
  transactionCount: number;
  payments: MdaPayment[];
  mda: string;
  allocatedAmount: number;
}

export interface MdaCashoutHistory {
  _id: string;
  cashoutId: string;
  entity: string;
  mdaName: string;
  amount: number;
  cashedOutTransactions: string[];
  status: string;
  description: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  cashoutDate?: string;
  __v: number;
}

export interface MdaTransactionsResponse {
  mdaName: string;
  transactions: MdaPayment[];
  pagination: {
    currentPage: number;
    limit: number;
    totalTransactions: number;
    totalPages: number;
    hasMore: boolean;
  };
  summary: {
    totalTransactions: number;
    totalProcessingFees: number;
    allocatedAmount: number;
    mdaPercentage: string;
    totalCashedOut: number;
    availableBalance: number;
  };
  cashoutHistory: MdaCashoutHistory[];
}

export interface IirsTransaction {
  _id: string;
  paymentId: string;
  amount: number;
  status: 'verified' | 'pending' | 'failed';
  description: string;
  category: string;
  grade: string;
  paymentDate?: string;
  createdAt: string;
  isCashout: boolean;
  companyName: string;
  companyMda: string;
  companyId: string;
}

export interface CashoutHistory {
  _id: string;
  cashoutId: string;
  entity: string;
  mdaName: string | null;
  amount: number;
  cashedOutTransactions: string[];
  status: string;
  description: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  cashoutDate?: string;
  __v: number;
}

export interface IirsTransactionsResponse {
  entity: string;
  transactions: IirsTransaction[];
  pagination: {
    currentPage: number;
    limit: number;
    totalTransactions: number;
    totalPages: number;
    hasMore: boolean;
  };
  summary: {
    totalTransactions: number;
    totalProcessingFees: number;
    allocatedAmount: number;
    iirsPercentage: string;
    totalCashedOut: number;
    availableBalance: number;
  };
  cashoutHistory: CashoutHistory[];
}

export interface Mda {
  _id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AllMdaTransactionsResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  mdas: Mda[];
}
