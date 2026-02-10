import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WalletSummary } from '@/app/admin/types/wallet';

interface CashOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: WalletSummary | undefined;
  confirmationText: string;
  setConfirmationText: (text: string) => void;
  description: string;
  setDescription: (text: string) => void;
  isCreating: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  formatCurrency: (amount: number) => string;
}

export default function CashOutDialog({
  open,
  onOpenChange,
  summary,
  confirmationText,
  setConfirmationText,
  description,
  setDescription,
  isCreating,
  onConfirm,
  onCancel,
  formatCurrency,
}: CashOutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Cash Out</DialogTitle>
          <DialogDescription>
            This will create cashout requests for all entities with unremitted amounts. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700 font-medium mb-2">Cashout Summary:</p>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• IIRS: {formatCurrency(summary?.unremitted?.entities?.iirs?.amount || 0)}</li>
              <li>• MDA: {formatCurrency(summary?.unremitted?.entities?.mda?.amount || 0)}</li>
              <li>• BPPPI: {formatCurrency(summary?.unremitted?.entities?.bpppi?.amount || 0)}</li>
              <li>• MOJ: {formatCurrency(summary?.unremitted?.entities?.moj?.amount || 0)}</li>
            </ul>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Optional description for all cashouts"
              rows={2}
            />
          </div>

          <div className="border-t pt-4">
            <label htmlFor="confirmation" className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-semibold">"yes, i am sure"</span> to confirm:
            </label>
            <input
              id="confirmation"
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="yes, i am sure"
            />
          </div>
        </div>
        <DialogFooter>
          <button
            onClick={onCancel}
            disabled={isCreating}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmationText !== 'yes, i am sure' || isCreating}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isCreating && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {isCreating ? 'Processing...' : 'Confirm Cash Out'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
