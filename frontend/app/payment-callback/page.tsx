import PaymentVerification from '@/components/payment-callback/PaymentVerification';

export default async function PaymentCallbackPage({ searchParams }: { searchParams: Promise<{ reference: string; return_url?: string }> }) {
    const reference = (await searchParams).reference || null;
    const return_url = (await searchParams)["return_url"];

    return <PaymentVerification reference={reference} return_url={return_url} />;
}