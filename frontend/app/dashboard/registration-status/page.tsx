'use client';

import { FaCheckCircle, FaClock, FaExclamationCircle, FaEye, FaFileAlt, FaBuilding, FaUsers, FaCreditCard, FaSync, FaArrowLeft } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

export default function RegistrationStatusPage() {
    // Mock data - will come from API
    const applicationData = {
        id: 'APP-2024-001',
        companyName: 'ABC Construction Ltd',
        submittedDate: '18 January 2024',
        currentStatus: 'Pending Review',
        reviewProgress: 60, // percentage
        reviewDay: 3,
        totalReviewDays: 5,
        sections: [
            {
                id: 'company',
                name: 'Company Information',
                icon: FaBuilding,
                verifiedBy: 'John Doe',
                verifiedDate: '19/01/2024',
                status: 'verified',
            },
            {
                id: 'directors',
                name: 'Directors & Shareholders',
                icon: FaUsers,
                verifiedBy: 'Jane Doe',
                verifiedDate: '19/01/2024',
                status: 'verified',
            },
            {
                id: 'compliance',
                name: 'Compliance Documents',
                icon: FaFileAlt,
                verifiedBy: 'Jane Smith',
                verifiedDate: '',
                status: 'under_review',
            },
            {
                id: 'payment',
                name: 'Payment',
                icon: FaCreditCard,
                verifiedBy: 'Paystack',
                verifiedDate: '15/01/2024',
                status: 'verified',
            },
        ],
        documents: [
            { id: 'cac', name: 'CAC Certificate', uploadedDate: '15/01/2024', status: 'verified' },
            { id: 'tcc', name: 'Tax Clearance Certificate', uploadedDate: '15/01/2024', status: 'resubmit' },
            { id: 'pencom', name: 'PENCOM Certificate', uploadedDate: '15/01/2024', status: 'verified' },
            { id: 'itf', name: 'ITF Certificate', uploadedDate: '15/01/2024', status: 'pending' },
            { id: 'nsitf', name: 'NSITF Certificate', uploadedDate: '15/01/2024', status: 'verified' },
        ],
        timeline: [
            { event: 'Application submitted', date: '2024-01-18 10:30 AM', status: 'completed' },
            { event: 'Payment confirmed', date: '2024-01-18 11:00 AM', status: 'completed' },
            { event: 'Initial review started', date: '2024-01-19 09:15 AM', status: 'completed' },
            { event: 'Company information verified', date: '2024-01-19 10:00 PM', status: 'completed' },
            { event: 'Directors information verified', date: '2024-01-19 11:45 AM', status: 'completed' },
            { event: 'Document verification', date: 'In Progress', status: 'in_progress' },
            { event: 'Final approval', date: 'Pending', status: 'pending' },
        ],
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'verified':
                return (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        <FaCheckCircle /> Verified
                    </span>
                );
            case 'under_review':
                return (
                    <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        <FaClock /> Under Review
                    </span>
                );
            case 'resubmit':
                return (
                    <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                        <FaExclamationCircle /> Resubmit
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                        <FaClock /> Pending
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header
                description='ABC Construction Ltd'
                title='Registration Status'
                hasBackButton
                rightButton={
                    <Button variant="outline" size="sm">
                        <FaSync className="mr-2" />
                        Refresh Status
                    </Button>
                }
            />

            <div className="container mx-auto px-4 py-6">
                {/* Status Banner */}
                <Card className="bg-blue-50 border-blue-300 mb-6">
                    <CardContent className="p-5">
                        <div className="flex items-start gap-3 mb-3">
                            <FaClock className="text-blue-600 text-xl mt-0.5" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-sm font-semibold text-blue-900">Application Under Review</h3>
                                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded font-medium">
                                        Pending Review
                                    </span>
                                </div>
                                <p className="text-xs text-blue-900 leading-relaxed">
                                    Your registration application was submitted on 18 January 2024. Our team is currently reviewing your documents and information. Estimated review time: 3-5 business days.
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs text-blue-900 mb-1.5">
                                <span className="font-medium">Review Progress</span>
                                <span className="font-semibold">Day {applicationData.reviewDay} of 3-5 business days</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-1.5">
                                <div
                                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                                    style={{ width: `${applicationData.reviewProgress}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Application Sections */}
                        <Card className="border-gray-200">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Sections</h3>
                                <p className="text-sm text-gray-500 mb-6">Review status of each section of your application</p>
                                <div className="space-y-0 divide-y divide-gray-200">
                                    {applicationData.sections.map((section) => (
                                        <div
                                            key={section.id}
                                            className="flex items-center justify-between py-5 first:pt-0"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                                    section.status === 'verified' ? 'bg-green-100' :
                                                    section.status === 'under_review' ? 'bg-blue-100' : 'bg-gray-100'
                                                }`}>
                                                    <section.icon className={`text-xl ${
                                                        section.status === 'verified' ? 'text-green-600' :
                                                        section.status === 'under_review' ? 'text-blue-600' : 'text-gray-600'
                                                    }`} />
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-medium text-gray-900 mb-1">{section.name}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {section.status === 'under_review' 
                                                            ? `Currently being reviewed by ${section.verifiedBy}`
                                                            : `Verified by ${section.verifiedBy} on ${section.verifiedDate}`
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            {getStatusBadge(section.status)}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Document Verification Status */}
                        <Card className="border-gray-200">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Verification Status</h3>
                                <p className="text-sm text-gray-500 mb-6">Track the status of each uploaded document</p>
                                <div className="space-y-0 divide-y divide-gray-200">
                                    {applicationData.documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            className="flex items-center justify-between py-4 first:pt-0"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FaFileAlt className="text-gray-400 text-lg" />
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">{doc.name}</h4>
                                                    <p className="text-xs text-gray-500">Uploaded {doc.uploadedDate}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {getStatusBadge(doc.status)}
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                                                    <FaEye className="text-gray-600" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Application Timeline */}
                        <Card className="border-gray-200">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Application Timeline</h3>
                                <p className="text-sm text-gray-500 mb-6">Track the progress of your application</p>
                                <div className="space-y-0">
                                    {applicationData.timeline.map((item, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                                        item.status === 'completed'
                                                            ? 'bg-green-100'
                                                            : item.status === 'in_progress'
                                                            ? 'bg-blue-100'
                                                            : 'bg-gray-100'
                                                    }`}
                                                >
                                                    {item.status === 'completed' ? (
                                                        <FaCheckCircle className="text-green-600 text-sm" />
                                                    ) : item.status === 'in_progress' ? (
                                                        <FaClock className="text-blue-600 text-sm" />
                                                    ) : (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                                                    )}
                                                </div>
                                                {index < applicationData.timeline.length - 1 && (
                                                    <div className="w-px h-12 bg-gray-200 my-1" />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <h4 className="text-sm font-medium text-gray-900 mb-0.5">{item.event}</h4>
                                                <p className="text-xs text-gray-500">{item.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Application Details */}
                        <Card className="border-gray-200">
                            <CardContent className="p-6">
                                <h3 className="text-base font-semibold text-gray-900 mb-5">Application Details</h3>
                                <div className="space-y-0 divide-y divide-gray-200">
                                    <div className="pb-3">
                                        <p className="text-xs text-gray-500 mb-1.5">Application ID</p>
                                        <p className="text-sm font-semibold text-gray-900">{applicationData.id}</p>
                                    </div>
                                    <div className="py-3">
                                        <p className="text-xs text-gray-500 mb-1.5">Company Name</p>
                                        <p className="text-sm font-medium text-gray-900">{applicationData.companyName}</p>
                                    </div>
                                    <div className="py-3">
                                        <p className="text-xs text-gray-500 mb-1.5">Submitted Date</p>
                                        <p className="text-sm font-medium text-gray-900">{applicationData.submittedDate}</p>
                                    </div>
                                    <div className="pt-3">
                                        <p className="text-xs text-gray-500 mb-2">Current Status</p>
                                        <span className="inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded font-medium">
                                            {applicationData.currentStatus}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* What Happens Next */}
                        <Card className="bg-white border-gray-200">
                            <CardContent className="p-6">
                                <h3 className="text-base font-semibold text-gray-900 mb-4">What Happens Next?</h3>
                                <ul className="space-y-3">
                                    <li className="text-xs text-gray-600 flex items-start gap-2.5">
                                        <span className="text-blue-600 font-semibold shrink-0 w-4">1</span>
                                        <span className="leading-relaxed">Our desk officers review your company information and documents</span>
                                    </li>
                                    <li className="text-xs text-gray-600 flex items-start gap-2.5">
                                        <span className="text-blue-600 font-semibold shrink-0 w-4">2</span>
                                        <span className="leading-relaxed">You&rsquo;ll be notified if any clarifications are needed</span>
                                    </li>
                                    <li className="text-xs text-gray-600 flex items-start gap-2.5">
                                        <span className="text-blue-600 font-semibold shrink-0 w-4">3</span>
                                        <span className="leading-relaxed">Application is forwarded to the Registrar for final approval</span>
                                    </li>
                                    <li className="text-xs text-gray-600 flex items-start gap-2.5">
                                        <span className="text-blue-600 font-semibold shrink-0 w-4">4</span>
                                        <span className="leading-relaxed">Your registration certificate will be issued upon approval</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Need Help */}
                        <Card className="border-gray-200">
                            <CardContent className="p-6">
                                <h3 className="text-base font-semibold text-gray-900 mb-3">Need Help?</h3>
                                <p className="text-xs text-gray-600 mb-5 leading-relaxed">
                                    If you have questions about your application status, please contact our support team.
                                </p>
                                <Button className="w-full bg-theme-green hover:bg-theme-green/90 mb-3 text-sm h-10">
                                    Contact Support
                                </Button>
                                <Button variant="outline" className="w-full text-sm h-10">
                                    <FaArrowLeft className="mr-2 text-xs" />
                                    Back to Dashboard
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
