import { FaCheckCircle } from 'react-icons/fa';

export default function VerifiedBadge() {
    return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium">
            <FaCheckCircle className="w-3 h-3" />
            <span>Verified</span>
        </div>
    );
}
