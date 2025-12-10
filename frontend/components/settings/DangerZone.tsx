'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface DangerZoneProps {
    onDeactivate: () => void;
    isLoading?: boolean;
}

const CONFIRMATION_TEXT = 'DEACTIVATE';

export default function DangerZone({ onDeactivate, isLoading }: DangerZoneProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [confirmationInput, setConfirmationInput] = useState('');

    const handleConfirmDeactivation = () => {
        if (confirmationInput === CONFIRMATION_TEXT) {
            onDeactivate();
            setIsDialogOpen(false);
            setConfirmationInput('');
        }
    };

    const handleCancel = () => {
        setIsDialogOpen(false);
        setConfirmationInput('');
    };

    const isConfirmationValid = confirmationInput === CONFIRMATION_TEXT;

    return (
        <>
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="mb-4">
                    <h2 className="text-base font-semibold text-red-900 mb-1">
                        Danger Zone
                    </h2>
                    <p className="text-sm text-red-700">
                        Irreversible actions
                    </p>
                </div>

                <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                    Deactivate Account
                </Button>
                <p className="text-xs text-red-600 text-center mt-2">
                    This action cannot be undone. Contact BPPPI support to reactivate.
                </p>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <FaExclamationTriangle className="text-red-600 text-xl" />
                            </div>
                            <DialogTitle className="text-xl font-semibold text-gray-900">
                                Deactivate Account
                            </DialogTitle>
                        </div>
                        <DialogDescription className="text-sm text-gray-600 space-y-3 pt-2">
                            <p className="font-semibold text-red-600">
                                ⚠️ Warning: This action is permanent and may not be reversible!
                            </p>
                            <p>
                                Deactivating your account will:
                            </p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Immediately revoke access to your account</li>
                                <li>Remove your company from the vendor directory</li>
                                <li>Cancel all pending applications</li>
                                <li>Disable all compliance documents</li>
                                <li>Prevent you from bidding on new projects</li>
                            </ul>
                            <p className="text-red-600 font-medium">
                                You will need to contact BPPPI support to reactivate your account.
                            </p>
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-sm text-amber-900">
                                To confirm, please type <span className="font-bold">{CONFIRMATION_TEXT}</span> in the box below:
                            </p>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="confirmation" className="text-sm font-medium text-gray-900 mb-2">
                                Confirmation Text
                            </Label>
                            <Input
                                id="confirmation"
                                type="text"
                                value={confirmationInput}
                                onChange={(e) => setConfirmationInput(e.target.value)}
                                placeholder={`Type "${CONFIRMATION_TEXT}" to confirm`}
                                className="font-mono"
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 flex">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmDeactivation}
                            disabled={!isConfirmationValid || isLoading}
                            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <span>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deactivating...
                            </span> : 'Deactivate Account'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
