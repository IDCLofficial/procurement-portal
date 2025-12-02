import { Button } from '@/components/ui/button';

interface DangerZoneProps {
    onDeactivate: () => void;
}

export default function DangerZone({ onDeactivate }: DangerZoneProps) {
    return (
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
                onClick={onDeactivate}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
                Deactivate Account
            </Button>
            <p className="text-xs text-red-600 text-center mt-2">
                This action cannot be undone. Contact BPPPI support to reactivate.
            </p>
        </div>
    );
}
