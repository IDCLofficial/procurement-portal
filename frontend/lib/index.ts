import { toast } from "sonner";

export const copyToClipboard = async (text: string, toastMessage?: string) => {
    try {
        await navigator.clipboard.writeText(text);
        // Optional: Show success feedback
        toast.success(toastMessage || 'Copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy:', err);
        // Optional: Show error feedback
        toast.error('Failed to copy to clipboard');
    }
};