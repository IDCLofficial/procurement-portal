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

export function deepEqual(a: unknown, b: unknown): boolean {
    if (Object.is(a, b)) return true;

    if (typeof a !== typeof b) return false;

    if (a === null || b === null) return false;
    if (typeof a !== "object" || typeof b !== "object") return false;

    return deepEqualObject(a as Record<PropertyKey, unknown>, b as Record<PropertyKey, unknown>);
}

function deepEqualObject(
    a: Record<PropertyKey, unknown>,
    b: Record<PropertyKey, unknown>
): boolean {
    if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

    const keysA = Reflect.ownKeys(a);
    const keysB = Reflect.ownKeys(b);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
        if (!keysB.includes(key)) return false;
    }
    for (const key of keysA) {
        const valA = a[key];
        const valB = b[key];

        if (!deepEqual(valA, valB)) return false;
    }

    return true;
}
