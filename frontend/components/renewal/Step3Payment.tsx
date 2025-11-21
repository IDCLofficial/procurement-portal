'use client';

import RenewalFeeCard from './RenewalFeeCard';
import RenewalSummarySection from './RenewalSummarySection';
import PostPaymentInfoBox from './PostPaymentInfoBox';

interface Step3PaymentProps {
    amount: string;
    categories: string[];
    summaryItems: Array<{ label: string; value: string }>;
    onPayment: () => void;
}

export default function Step3Payment({ amount, categories, summaryItems, /* onPayment */ }: Step3PaymentProps) {
    return (
        <div className="space-y-6">
            {/* Renewal Fee Card */}
            <RenewalFeeCard amount={amount} categories={categories} />

            {/* Renewal Summary */}
            <RenewalSummarySection items={summaryItems} totalAmount={amount} />

            {/* Post Payment Info */}
            <PostPaymentInfoBox
                title="What happens after payment:"
                items={[
                    'Your renewal application will be submitted for review',
                    'BPPPI staff will verify your updated documents (3-5 business days)',
                    "You'll receive email notifications at each stage",
                    'Once approved, your registration will be extended to Dec 31, 2025',
                    'Your new certificate will be available for download',
                ]}
            />
        </div>
    );
}
