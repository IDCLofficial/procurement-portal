import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentType } from "@/store/api/enum";
import { useInitPaymentMutation } from "@/store/api/vendor.api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaMoneyBillWave, FaInfoCircle } from "react-icons/fa";
import { toast } from "sonner";

interface PendingPaymentCardProps {
    amount: number;
    description: string;
    onPay: () => Promise<void>;
}

export default function PendingPaymentCard({ amount, description, onPay }: PendingPaymentCardProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [initPayment, { isLoading: isPaymentLoading }] = useInitPaymentMutation();
    const router = useRouter();

    const handlePay = async () => {
    
            const payload = {
                amount,
                type: PaymentType.CERTIFICATEFEE,
                description,
            }
    
            try {
                toast.loading('Initializing payment...', { id: "payment" });
                const response = await initPayment(payload);
                toast.dismiss("payment");
                if (response.data) {
                    router.push(response.data.authorization_url);
                }

                onPay()
                setIsOpen(false);
            } catch (error) {
                toast.dismiss("payment");
                console.error(error);
                toast.error((error as Error).message || 'Failed to initialize payment');
                throw new Error((error as Error).message || 'Failed to initialize payment');
            }
        };

    return (
        <>
            <div className="bg-white rounded-xl border border-amber-200 overflow-hidden">
                <div className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-amber-800">Vendor Certificate Payment Required</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Complete your vendor certificate registration with a one-time payment
                            </p>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-lg">
                            <FaMoneyBillWave className="h-6 w-6 text-amber-600" />
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-baseline justify-between">
                            <span className="text-sm font-medium text-gray-700">Certificate Fee:</span>
                            <span className="text-2xl font-bold text-amber-700">₦{amount.toLocaleString()}</span>
                        </div>

                        <div className="mt-4 p-3 bg-linear-to-b from-transparent to-amber-100 rounded-lg text-sm text-amber-800 flex items-start gap-2 border border-amber-200">
                            <FaInfoCircle className="h-4 w-4 mt-0.5 shrink-0" />
                            <span>{description}</span>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 cursor-pointer"
                                onClick={() => setIsOpen(true)}
                            >
                                View Details
                            </Button>
                            <Button
                                className="flex-1 bg-amber-600 hover:bg-amber-700 cursor-pointer"
                                onClick={() => setIsOpen(true)}
                            >
                                Pay Now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Vendor Certificate Payment</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        <div className="bg-linear-to-b from-transparent to-amber-50 p-4 rounded-lg border border-amber-200">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Certificate Fee:</span>
                                <span className="text-2xl font-bold text-amber-700">₦{amount.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium">Payment Details:</h4>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm border border-gray-200">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Purpose:</span>
                                    <span className="font-medium">{description}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-medium">Paystack</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-linear-to-b from-transparent to-blue-50 border border-blue-200 p-3 rounded-lg text-xs text-blue-800">
                            <p>Please note: Certificate fees are processed immediately and are non-refundable upon successful payment.</p>
                        </div>

                        <div className="pt-2">
                            <Button
                                className="w-full bg-amber-600 hover:bg-amber-700 h-12 text-base"
                                onClick={handlePay}
                                disabled={isPaymentLoading}
                            >
                                {isPaymentLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processing Payment...
                                    </span>
                                ) : (
                                    `Proceed to Payment`
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}