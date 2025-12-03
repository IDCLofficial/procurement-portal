import { CheckCircle2, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResponseDialogProps {
  open: boolean;
  title: string;
  message: string;
  onOpenChange: (open: boolean) => void;
}

export function ResponseDialog({ open, title, message, onOpenChange }: ResponseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className={`p-3 rounded-full ${title === 'Success' ? 'bg-green-100' : 'bg-red-100'}`}>
            {title === 'Success' ? (
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600" />
            )}
          </div>
          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-5xl font-bold text-center">
              {title}
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-2xl">
              {message}
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter className="mt-4">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto min-w-[100px]"
            variant={title === 'Success' ? 'default' : 'destructive'}
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
