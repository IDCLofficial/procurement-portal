import { FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';

export function getStatusBadge(status: string) {
    switch (status.toLocaleLowerCase()) {
        case 'Approved'.toLocaleLowerCase():
            return (
                <span className="inline-flex items-center gap-1 text-xs bg-green-50 border border-green-200 text-green-600 px-2 py-1 rounded-md">
                    <FaCheckCircle /> Verified
                </span>
            );
        case 'under_review'.toLocaleLowerCase():
            return (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-50 border border-blue-200 text-blue-600 px-2 py-1 rounded-md">
                    <FaClock /> Under Review
                </span>
            );
        case 'rejected'.toLocaleLowerCase():
            return (
                <span className="inline-flex items-center gap-1 text-xs bg-orange-50 border border-orange-200 text-orange-600 px-2 py-1 rounded-md">
                    <FaExclamationCircle /> Resubmit
                </span>
            );
        case 'pending'.toLocaleLowerCase():
            return (
                <span className="inline-flex items-center gap-1 text-xs bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded-md">
                    <FaClock /> Pending
                </span>
            );
        default:
            return (
                <span className="inline-flex items-center gap-1 text-xs bg-red-50 border border-red-200 text-red-600 px-2 py-1 rounded-md">
                    <FaExclamationCircle /> {status}
                </span>
            );
    }
}
