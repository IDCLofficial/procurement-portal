import { DollarSign, ArrowDownRight, CreditCard } from 'lucide-react';
import StatCard from './StatCard';
import { WalletSummary } from '@/app/admin/types/wallet';

interface WalletStatsSectionProps {
  title: string;
  summary: WalletSummary | undefined;
  type: 'remitted' | 'unremitted';
  formatCurrency: (amount: number) => string;
  formatDate: (date: string | null) => string;
}

export default function WalletStatsSection({
  title,
  summary,
  type,
  formatCurrency,
  formatDate,
}: WalletStatsSectionProps) {
  const data = summary?.[type];

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Amount Generated"
          value={formatCurrency(data?.totalAmountGenerated || 0)}
          icon={DollarSign}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />

        {type === 'remitted' ? (
          <>
            <StatCard
              title="IIRS Total Transactions"
              value={data?.iirsTransactions || 0}
              icon={ArrowDownRight}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
              valueColor="text-blue-600"
            />
            <StatCard
              title="MDA Total Transactions"
              value={data?.mdaTransactions || 0}
              icon={ArrowDownRight}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
              valueColor="text-purple-600"
            />
            <StatCard
              title="BPPPI Transactions"
              value={data?.bpppiTransactions || 0}
              icon={ArrowDownRight}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100"
              valueColor="text-orange-600"
            />
            <StatCard
              title="Total Number of Payments"
              value={data?.totalPayments || 0}
              icon={CreditCard}
              iconColor="text-indigo-600"
              iconBgColor="bg-indigo-100"
              valueColor="text-indigo-600"
            />
            <StatCard
              title="Last Cashout"
              value={formatCurrency(summary?.remitted.lastCashout.amount || 0)}
              icon={ArrowDownRight}
              iconColor="text-teal-600"
              iconBgColor="bg-teal-100"
              valueColor="text-teal-600"
              subtitle={formatDate(summary?.remitted.lastCashout.date || null)}
            />
          </>
        ) : (
          <>
            <StatCard
              title="IIRS Amount"
              value={formatCurrency(summary?.unremitted.entities.iirs.amount || 0)}
              icon={ArrowDownRight}
              iconColor="text-blue-600"
              iconBgColor="bg-blue-100"
              valueColor="text-blue-600"
              subtitle={`${formatCurrency(summary?.unremitted.entities.iirs.allocated || 0)} allocated • ${summary?.unremitted.entities.iirs.percentage || '0%'}`}
            />
            <StatCard
              title="MDA Amount"
              value={formatCurrency(summary?.unremitted.entities.mda.amount || 0)}
              icon={ArrowDownRight}
              iconColor="text-purple-600"
              iconBgColor="bg-purple-100"
              valueColor="text-purple-600"
              subtitle={`${formatCurrency(summary?.unremitted.entities.mda.allocated || 0)} allocated • ${summary?.unremitted.entities.mda.percentage || '0%'}`}
            />
            <StatCard
              title="BPPPI Amount"
              value={formatCurrency(summary?.unremitted.entities.bpppi.amount || 0)}
              icon={ArrowDownRight}
              iconColor="text-orange-600"
              iconBgColor="bg-orange-100"
              valueColor="text-orange-600"
              subtitle={`${formatCurrency(summary?.unremitted.entities.bpppi.allocated || 0)} allocated • ${summary?.unremitted.entities.bpppi.percentage || '0%'}`}
            />
            <StatCard
              title="Total Number of Payments"
              value={data?.totalPayments || 0}
              icon={CreditCard}
              iconColor="text-indigo-600"
              iconBgColor="bg-indigo-100"
              valueColor="text-indigo-600"
            />
            <StatCard
              title="IDCL Amount"
              value={formatCurrency(summary?.unremitted?.entities?.idcl?.amount || 0)}
              icon={ArrowDownRight}
              iconColor="text-pink-600"
              iconBgColor="bg-pink-100"
              valueColor="text-pink-600"
              subtitle={`${formatCurrency(summary?.unremitted?.entities?.idcl?.allocated || 0)} allocated • ${summary?.unremitted?.entities?.idcl?.percentage || '0%'}`}
            />
          </>
        )}
      </div>
    </div>
  );
}
