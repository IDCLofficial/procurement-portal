'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import {
    FaBuilding,
    FaSearch,
    FaCheckCircle,
    FaFileAlt,
    FaCog,
    FaShieldAlt,
    FaUsers,
    FaArrowRight
} from 'react-icons/fa';
import { IoCheckmarkCircle } from 'react-icons/io5';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
            <Header
                title="Imo State E-Procurement"
                description="Contractor Registration & Renewal Portal"
            />

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16 text-center">
                <Badge variant="outline" className="mb-6 border-emerald-600 text-emerald-700">
                    <IoCheckmarkCircle className="mr-1" />
                    Secure, Transparent & Efficient
                </Badge>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Welcome to Imo State E-Procurement Platform
                </h2>

                <p className="text-gray-600 max-w-3xl mx-auto text-lg mb-12">
                    A comprehensive digital platform for contractor registration, renewal, and verification. Built to
                    ensure transparency, compliance, and efficiency in public procurement.
                </p>

                {/* Main Cards */}
                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {/* Vendor Registration Card */}
                    <Card className="text-left hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 bg-theme-green rounded-lg flex items-center justify-center mb-4">
                                <FaBuilding className="text-white text-xl" />
                            </div>
                            <CardTitle className="text-xl">Vendor Registration</CardTitle>
                            <CardDescription>
                                Register your company and manage contractor credentials
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <FaCheckCircle className="text-theme-green mt-0.5 shrink-0" />
                                    <span>Complete registration in minutes</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <FaCheckCircle className="text-theme-green mt-0.5 shrink-0" />
                                    <span>Upload compliance documents</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <FaCheckCircle className="text-theme-green mt-0.5 shrink-0" />
                                    <span>Track application status in real-time</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <FaCheckCircle className="text-theme-green mt-0.5 shrink-0" />
                                    <span>Manage yearly renewals easily</span>
                                </li>
                            </ul>

                            <div className="space-y-2">
                                <Button className="w-full bg-theme-green hover:bg-emerald-700 cursor-pointer active:scale-95 transition-transform duration-300">
                                    Register Your Company
                                    <FaArrowRight className="ml-2" />
                                </Button>
                                <Button variant="outline" className="w-full cursor-pointer active:scale-95 transition-transform duration-300">
                                    Vendor Login
                                </Button>
                                <p className="text-xs text-gray-500 text-center pt-2">
                                    New contractors and existing vendors
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Public Directory Card */}
                    <Card className="text-left hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 bg-theme-green rounded-lg flex items-center justify-center mb-4">
                                <FaSearch className="text-white text-xl" />
                            </div>
                            <CardTitle className="text-xl">Public Directory</CardTitle>
                            <CardDescription>
                                Search and verify registered contractors
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <FaCheckCircle className="text-theme-green mt-0.5 shrink-0" />
                                    <span>Search approved contractors</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <FaCheckCircle className="text-theme-green mt-0.5 shrink-0" />
                                    <span>Verify credentials and certificates</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <FaCheckCircle className="text-theme-green mt-0.5 shrink-0" />
                                    <span>Check registration status</span>
                                </li>
                                <li className="flex items-start gap-2 text-sm text-gray-600">
                                    <FaCheckCircle className="text-theme-green mt-0.5 shrink-0" />
                                    <span>Scan QR codes for verification</span>
                                </li>
                            </ul>

                            <div className="grid gap-y-2">
                                <Link href="/directory">
                                    <Button variant="outline" className="w-full cursor-pointer active:scale-95 transition-transform duration-300">
                                        <FaSearch className="mr-2" />
                                        Search Directory
                                    </Button>
                                </Link>
                                <Link href="/verify-certificate">
                                    <Button variant="outline" className="w-full cursor-pointer active:scale-95 transition-transform duration-300">
                                        Verify Certificate
                                    </Button>
                                </Link>
                                <p className="text-xs text-gray-500 text-center pt-2">
                                    Open to the public • No login required
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Platform Features Section */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Platform Features</h3>
                        <p className="text-gray-600">Comprehensive tools for efficient procurement management</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {/* Digital Documents */}
                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <FaFileAlt className="text-theme-green text-xl" />
                                </div>
                                <CardTitle className="text-lg">Digital Documents</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Secure upload and storage of compliance certificates
                                </p>
                            </CardContent>
                        </Card>

                        {/* Automated Workflow */}
                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <FaCog className="text-theme-green text-xl" />
                                </div>
                                <CardTitle className="text-lg">Automated Workflow</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Streamlined approval process with SLA tracking
                                </p>
                            </CardContent>
                        </Card>

                        {/* Secure Payments */}
                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <FaShieldAlt className="text-theme-green text-xl" />
                                </div>
                                <CardTitle className="text-lg">Secure Payments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Integrated payment gateway for registration fees
                                </p>
                            </CardContent>
                        </Card>

                        {/* Public Transparency */}
                        <Card className="text-center hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <FaUsers className="text-theme-green text-xl" />
                                </div>
                                <CardTitle className="text-lg">Public Transparency</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Open directory for contractor verification
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
