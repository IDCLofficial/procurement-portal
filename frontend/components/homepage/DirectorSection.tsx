'use client';

import Image from 'next/image';
import { Quote, Award, Briefcase, GraduationCap } from 'lucide-react';

export default function DirectorSection() {
    return (
        <section className="relative py-24 bg-linear-to-br from-green-600 via-green-700 to-green-800 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-300 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-semibold mb-6 border border-white/30">
                        <Award className="h-4 w-4" />
                        <span>Leadership</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Meet Our <span className="text-green-200">Director General</span>
                    </h2>
                    <p className="text-green-100 text-lg max-w-2xl mx-auto">
                        Leading the charge towards transparent and efficient public procurement
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-linear-to-br from-green-400 to-green-300 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                        
                        <div className="relative bg-white/10 backdrop-blur-xl rounded-[40px] p-8 border border-white/20 shadow-2xl">
                            <div className="relative h-[500px] rounded-[32px] overflow-hidden mb-6">
                                <Image 
                                    src="/images/director.png" 
                                    alt="Director General" 
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-green-900/60 via-transparent to-transparent"></div>
                                
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-1">Chief Okoro Clifford Kelechi</h3>
                                        <p className="text-green-600 font-semibold">Director General, BPPPI</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <Briefcase className="h-6 w-6 text-green-200 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-white">40+</p>
                                    <p className="text-xs text-green-100">Years Experience</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <Award className="h-6 w-6 text-green-200 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-white">2023</p>
                                    <p className="text-xs text-green-100">Retired GM</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl text-center border border-white/20 hover:bg-white/20 transition-all duration-300">
                                    <GraduationCap className="h-6 w-6 text-green-200 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-white">MBA</p>
                                    <p className="text-xs text-green-100">Finance</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                            <Quote className="h-10 w-10 text-green-200 mb-4" />
                            <p className="text-xl text-white leading-relaxed italic mb-4">
                                "Our mission is to build a procurement system that serves the people with integrity, transparency, and unwavering commitment to excellence. Every contract awarded is a promise to the citizens of Imo State."
                            </p>
                            <div className="h-1 w-20 bg-green-300 rounded-full"></div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-4">Professional Background</h3>
                                <p className="text-green-50 leading-relaxed mb-3">
                                    Chief Okoro Clifford Kelechi, born July 28, 1963, in Omuma, Oru East LGA of Imo State, is a distinguished financial expert and public servant. He earned a B.Sc. in Economics from the University of Liberia (1983) and an MBA in Finance from Atlanta, Georgia, USA (1985).
                                </p>
                                <p className="text-green-50 leading-relaxed">
                                    With over 40 years of experience spanning international banking and public service, Chief Okoro has worked with prestigious institutions including First City Commercial Bank (Liberia), Citizen Bank, Sterling Bank, Ecobank, and served as General Manager at the Nigerian Meteorological Agency (NiMet) before retiring in July 2023.
                                </p>
                            </div>

                            <div className="border-t border-white/20 pt-6">
                                <h4 className="text-lg font-bold text-white mb-3">Career Highlights</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-300 rounded-full mt-2 shrink-0"></div>
                                        <p className="text-green-50">Extensive banking career across multiple continents (USA, Liberia, Nigeria)</p>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-300 rounded-full mt-2 shrink-0"></div>
                                        <p className="text-green-50">Rose from Senior Bank Officer to Branch Manager and General Manager</p>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-300 rounded-full mt-2 shrink-0"></div>
                                        <p className="text-green-50">Served as Deputy General Manager at Nigerian Meteorological Agency (NiMet)</p>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-300 rounded-full mt-2 shrink-0"></div>
                                        <p className="text-green-50">Currently serving as DG of Bureau of Public Procurement and Price Intelligence, Imo State</p>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <div className="w-2 h-2 bg-green-300 rounded-full mt-2 shrink-0"></div>
                                        <p className="text-green-50">Continuous professional development in economics, accounting, and procurement</p>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <a 
                                href="/about/director" 
                                className="inline-flex items-center px-6 py-3 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors duration-200 shadow-lg"
                            >
                                Full Biography
                                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                            <a 
                                href="/contact" 
                                className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-colors duration-200 border border-white/30"
                            >
                                Contact Office
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-white to-transparent"></div>
        </section>
    );
}
