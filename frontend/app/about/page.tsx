import ContractorCTA from "@/components/homepage/ContractorCTA";
import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";
import OfficeHours from "@/components/homepage/OfficeHours";
import { Target, Eye, Building2, Users, FileText, Shield, Briefcase, TrendingUp } from "lucide-react";

export default function About() {
    return (
        <>
            <Navbar />
              <OfficeHours />                                                                                               
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">About BPPPI</h1>
                        <p className="text-xl text-green-100 max-w-3xl mx-auto">
                            Bureau of Public Procurement and Price Intelligence - Imo State
                        </p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Bureau</h2>
                            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                                The Bureau of Public Procurement and Price Intelligence (BPPPI), Imo State is the central regulatory 
                                authority responsible for overseeing and enforcing transparency, accountability, efficiency, and 
                                value-for-money in public procurement across Ministries, Departments, and Agencies (MDAs) of the 
                                Imo State Government.
                            </p>
                            <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                                The Bureau was established in October 2010 to regulate procurement processes, standardize pricing, 
                                prevent waste of public funds, and ensure compliance with approved procurement laws, policies, and 
                                ethical standards. It serves as the government's professional and technical backbone for procurement 
                                planning, tendering, contract award, monitoring, and price intelligence.
                            </p>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Through policy guidance, procurement audits, capacity building, and price benchmarking, the Bureau 
                                ensures that public resources are utilized prudently and in the best interest of Imo State citizens.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl shadow-lg">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileText className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">1000+</h3>
                                    <p className="text-sm text-gray-600">Contracts Processed</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">500+</h3>
                                    <p className="text-sm text-gray-600">Registered Vendors</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                                    <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Building2 className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">50+</h3>
                                    <p className="text-sm text-gray-600">MDAs Served</p>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Shield className="h-8 w-8 text-orange-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">100%</h3>
                                    <p className="text-sm text-gray-600">Transparency</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Mission */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-green-600 hover:shadow-2xl transition-shadow">
                            <div className="flex items-center mb-6">
                                <div className="bg-green-100 p-4 rounded-full mr-4">
                                    <Target className="h-8 w-8 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                            </div>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                To provide reliable, accessible and innovative platform which promote transparency, accountability 
                                and value-driven public procurement practices in Imo State through effective regulation, pricing, 
                                professional oversight, and capacity building.
                            </p>
                            <div className="mt-6 space-y-3">
                                <div className="flex items-start">
                                    <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600">Promote transparency and accountability</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600">Ensure value for money in public spending</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                                        <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600">Foster fair competition among vendors</p>
                                </div>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-600 hover:shadow-2xl transition-shadow">
                            <div className="flex items-center mb-6">
                                <div className="bg-blue-100 p-4 rounded-full mr-4">
                                    <Eye className="h-8 w-8 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                            </div>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                To be a leading public procurement regulatory institution that guarantees transparency, accountability, 
                                efficiency, and value for money in the utilization of public resources for sustainable development in 
                                Imo State.
                            </p>
                            <div className="mt-6 space-y-3">
                                <div className="flex items-start">
                                    <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                                        <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600">Excellence in service delivery</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                                        <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600">Innovation in procurement processes</p>
                                </div>
                                <div className="flex items-start">
                                    <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                                        <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600">Sustainable economic development</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Departments Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Departments</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Specialized teams working together to ensure excellence in public procurement
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Procurement Department */}
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="bg-green-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                <Briefcase className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Procurement Department</h3>
                            <p className="text-gray-700 mb-4">
                                Manages the entire procurement process, from planning to contract award, ensuring compliance 
                                with regulations and best practices.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                                    Contract Management
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                                    Vendor Registration
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                                    Bid Evaluation
                                </li>
                            </ul>
                        </div>

                        {/* Price Intelligence Department */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="bg-blue-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                <TrendingUp className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Price Intelligence</h3>
                            <p className="text-gray-700 mb-4">
                                Monitors market prices, conducts research, and provides data-driven insights to ensure 
                                competitive pricing in public procurement.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                                    Market Analysis
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                                    Price Benchmarking
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                                    Cost Analysis
                                </li>
                            </ul>
                        </div>

                        {/* Compliance & Monitoring */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="bg-purple-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                <Shield className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Compliance & Monitoring</h3>
                            <p className="text-gray-700 mb-4">
                                Ensures adherence to procurement laws, monitors contract execution, and investigates 
                                irregularities to maintain integrity.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                                    Regulatory Compliance
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                                    Audit & Review
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></span>
                                    Quality Assurance
                                </li>
                            </ul>
                        </div>

                        {/* Legal Department */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="bg-orange-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                <FileText className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Legal Department</h3>
                            <p className="text-gray-700 mb-4">
                                Provides legal guidance, reviews contracts, handles disputes, and ensures all procurement 
                                activities comply with legal frameworks.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-2"></span>
                                    Legal Advisory
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-2"></span>
                                    Contract Review
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-2"></span>
                                    Dispute Resolution
                                </li>
                            </ul>
                        </div>

                        {/* Finance Department */}
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="bg-indigo-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                <TrendingUp className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Finance Department</h3>
                            <p className="text-gray-700 mb-4">
                                Manages budgets, processes payments, maintains financial records, and ensures fiscal 
                                responsibility in all procurement activities.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>
                                    Budget Management
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>
                                    Payment Processing
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mr-2"></span>
                                    Financial Reporting
                                </li>
                            </ul>
                        </div>

                        {/* ICT Department */}
                        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="bg-teal-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                <Building2 className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">ICT and E-Procurement Support Unit</h3>
                            <p className="text-gray-700 mb-4">
                                Develops and maintains digital infrastructure, manages the procurement portal, and ensures 
                                cybersecurity across all systems.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full mr-2"></span>
                                    System Development
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full mr-2"></span>
                                    E-Procurement Support
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-full mr-2"></span>
                                    Technical Support
                                </li>
                            </ul>
                        </div>

                        {/* Monitoring and Evaluation */}
                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="bg-pink-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                <Eye className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Monitoring and Evaluation Department</h3>
                            <p className="text-gray-700 mb-4">
                                Tracks project implementation, evaluates procurement outcomes, and ensures performance 
                                standards are met across all contracts.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-pink-600 rounded-full mr-2"></span>
                                    Project Monitoring
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-pink-600 rounded-full mr-2"></span>
                                    Performance Evaluation
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-pink-600 rounded-full mr-2"></span>
                                    Impact Assessment
                                </li>
                            </ul>
                        </div>

                        {/* Capacity Building */}
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="bg-yellow-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                <Users className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Capacity Building and Professional Development</h3>
                            <p className="text-gray-700 mb-4">
                                Provides training programs, workshops, and professional development opportunities to enhance 
                                procurement skills across MDAs.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2"></span>
                                    Training Programs
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2"></span>
                                    Workshops & Seminars
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-2"></span>
                                    Skill Development
                                </li>
                            </ul>
                        </div>

                        {/* Research and Documentation */}
                        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="bg-cyan-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                <FileText className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Research, Statistics, and Documentation</h3>
                            <p className="text-gray-700 mb-4">
                                Conducts procurement research, maintains statistical records, and manages comprehensive 
                                documentation of all procurement activities.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mr-2"></span>
                                    Research & Analysis
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mr-2"></span>
                                    Statistical Records
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-cyan-600 rounded-full mr-2"></span>
                                    Documentation
                                </li>
                            </ul>
                        </div>

                        {/* Administration and HR */}
                        <div className="bg-gradient-to-br from-lime-50 to-lime-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="bg-lime-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                <Users className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Administration and Human Resources</h3>
                            <p className="text-gray-700 mb-4">
                                Manages personnel, administrative operations, staff welfare, and ensures smooth organizational 
                                functioning across the Bureau.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mr-2"></span>
                                    Personnel Management
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mr-2"></span>
                                    Staff Development
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-lime-600 rounded-full mr-2"></span>
                                    Administrative Support
                                </li>
                            </ul>
                        </div>

                        {/* Public Relations */}
                        <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="bg-rose-600 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                                <Users className="h-7 w-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Public Relations</h3>
                            <p className="text-gray-700 mb-4">
                                Manages communication with stakeholders, handles media relations, and promotes transparency 
                                in Bureau activities to the public.
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-rose-600 rounded-full mr-2"></span>
                                    Media Relations
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-rose-600 rounded-full mr-2"></span>
                                    Stakeholder Engagement
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-rose-600 rounded-full mr-2"></span>
                                    Public Communication
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Services Offered</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Comprehensive services to MDAs, contractors, consultants, and stakeholders
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start">
                                <div className="bg-green-100 rounded-lg p-3 mr-4">
                                    <FileText className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Review and Approval of Procurement Plans</h3>
                                    <p className="text-gray-600">Comprehensive review and approval of procurement plans for all MDAs</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start">
                                <div className="bg-blue-100 rounded-lg p-3 mr-4">
                                    <TrendingUp className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Price Intelligence and Benchmarking</h3>
                                    <p className="text-gray-600">Market analysis for goods, works, and services to ensure competitive pricing</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start">
                                <div className="bg-purple-100 rounded-lg p-3 mr-4">
                                    <Shield className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Vetting and Certification of Tender Documents</h3>
                                    <p className="text-gray-600">Thorough review and certification of all tender documentation</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start">
                                <div className="bg-orange-100 rounded-lg p-3 mr-4">
                                    <Eye className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Monitoring of Bid Openings and Evaluations</h3>
                                    <p className="text-gray-600">Oversight of bid openings, evaluations, and contract awards</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start">
                                <div className="bg-indigo-100 rounded-lg p-3 mr-4">
                                    <FileText className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Issuance of Due Process Certification</h3>
                                    <p className="text-gray-600">Official certification for procurement processes that meet due process requirements</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start">
                                <div className="bg-red-100 rounded-lg p-3 mr-4">
                                    <Shield className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Procurement Audits and Compliance Checks</h3>
                                    <p className="text-gray-600">Regular audits to ensure adherence to procurement laws and policies</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start">
                                <div className="bg-teal-100 rounded-lg p-3 mr-4">
                                    <Users className="h-6 w-6 text-teal-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Capacity Building and Training</h3>
                                    <p className="text-gray-600">Training and sensitization programs on procurement best practices</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start">
                                <div className="bg-yellow-100 rounded-lg p-3 mr-4">
                                    <Briefcase className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Advisory Services</h3>
                                    <p className="text-gray-600">Expert guidance on procurement law and policy interpretation</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start">
                                <div className="bg-pink-100 rounded-lg p-3 mr-4">
                                    <Eye className="h-6 w-6 text-pink-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Project Execution Monitoring</h3>
                                    <p className="text-gray-600">Continuous monitoring of project execution and contract performance</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start">
                                <div className="bg-cyan-100 rounded-lg p-3 mr-4">
                                    <Building2 className="h-6 w-6 text-cyan-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">E-Procurement Support</h3>
                                    <p className="text-gray-600">Technical support and infrastructure for electronic procurement processes</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-start">
                                <div className="bg-lime-100 rounded-lg p-3 mr-4">
                                    <FileText className="h-6 w-6 text-lime-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Data and Records Management</h3>
                                    <p className="text-gray-600">Maintenance of comprehensive procurement data, records, and price database</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
<ContractorCTA/>
<Footer/>
          
        </>
    );
}