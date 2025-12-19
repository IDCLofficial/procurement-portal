import PaymentVerification from '@/components/payment-callback/PaymentVerification';

export default async function PaymentCallbackPage({ searchParams }: { searchParams: Promise<{ reference: string; }> }) {
    const reference = (await searchParams).reference || null;

    console.log(reference);

    return <PaymentVerification reference={reference} />;
}