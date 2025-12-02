import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';

export type Timeline = Array<{
    status: "Pending Desk Review" | "Forwarded to Registrar" | "Pending Payment" | "Clarification Requested" | "SLA Breach" | "Approved" | "Rejected";
    timestamp: string;
}>


export default function ApplicationTimeline({ timeline }: { timeline: Timeline }) {
    return (
        <Card className="border-gray-200">
            <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Timeline</h3>
                <p className="text-sm text-gray-500 mb-6">Track the progress of your application</p>
                <div className="space-y-0">
                    {timeline?.map((item, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                        item.status === 'Approved'
                                            ? 'bg-green-100'
                                            : item.status === 'Rejected'
                                            ? 'bg-red-100'
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    {item.status === 'Approved' ? (
                                        <FaCheckCircle className="text-green-600 text-sm" />
                                    ) : item.status === 'Rejected' ? (
                                        <FaTimesCircle className="text-red-600 text-sm" />
                                    ) : (
                                        <FaClock className="text-gray-500 text-sm" />
                                    )}
                                </div>
                                {index < timeline.length - 1 && (
                                    <div className="w-px h-12 bg-gray-200 my-1" />
                                )}
                            </div>
                            <div className="flex-1 pb-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-0.5">{item.status}</h4>
                                <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
