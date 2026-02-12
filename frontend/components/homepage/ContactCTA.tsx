'use client';

import { Phone, Mail, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function ContactCTA() {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const contactInfo = [
        {
            icon: Phone,
            title: 'Call Us',
            detail: '+234 7063 028 377',
            subtext: 'Mon - Fri, 8AM - 5PM',
            href: 'tel:+2347063028377',
            color: 'from-green-400 to-emerald-500'
        },
        {
            icon: Mail,
            title: 'Email Us',
            detail: 'bpppiimostatedueprocess@gmail.com',
            subtext: 'We reply within 24 hours',
            href: 'mailto:bpppiimostatedueprocess@gmail.com',
            color: 'from-emerald-400 to-teal-500'
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            detail: 'Government House, Owerri',
            subtext: 'Imo State, Nigeria',
            href: '#',
            color: 'from-teal-400 to-green-500'
        }
    ];

    return (
        <section className="relative py-32 bg-linear-to-b from-white via-gray-50 to-white overflow-hidden">
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full" 
                     style={{
                         backgroundImage: 'radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)',
                         backgroundSize: '40px 40px'
                     }}>
                </div>
            </div>

            <div className="absolute top-20 right-20 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-5 py-2.5 rounded-full text-sm font-bold mb-6 shadow-lg">
                        <Sparkles className="w-4 h-4" />
                        <span>Get In Touch</span>
                    </div>
                    
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                        Want to{' '}
                        <span className="bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Contact Us?
                        </span>
                    </h2>
                    
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Our team is ready to assist you with any inquiries about procurement processes, contractor registration, or general information.
                    </p>
                </div>

             
                <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 rounded-[40px] blur-2xl opacity-20"></div>
                    
                    <div className="relative bg-linear-to-br from-green-600 via-emerald-600 to-green-700 rounded-[40px] p-12 md:p-16 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-800/30 rounded-full blur-3xl"></div>
                        
                        <div className="absolute inset-0 opacity-10">
                            {[...Array(40)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 3}s`,
                                        animationDuration: `${2 + Math.random() * 3}s`
                                    }}
                                />
                            ))}
                        </div>

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-xl border border-white/30 text-white px-5 py-2.5 rounded-full text-sm font-bold mb-6">
                                    <Clock className="w-4 h-4" />
                                    <span>Office Hours</span>
                                </div>

                                <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                                    We're Here to Help
                                </h3>

                                <p className="text-xl text-green-50 mb-8 leading-relaxed">
                                    Have questions about procurement processes, need assistance with contractor registration, or want to learn more about our services? Our dedicated team is ready to assist you.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start space-x-4 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                                        <Clock className="w-6 h-6 text-green-300 shrink-0 mt-1" />
                                        <div>
                                            <p className="text-white font-bold mb-1">Working Hours</p>
                                            <p className="text-green-100">Monday - Friday: 8:00 AM - 5:00 PM</p>
                                            <p className="text-green-100">Saturday - Sunday: Closed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-4">
                                <a 
                                    href="tel:+2347063028377"
                                    className="group relative bg-white text-green-700 px-10 py-6 rounded-2xl font-bold text-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl flex items-center justify-between overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    
                                    <div className="relative z-10 flex items-center space-x-4">
                                        <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Phone className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm text-gray-600 font-semibold">Call Us Now</p>
                                            <p className="text-2xl font-black text-green-700">+234 706 302 8377, +234 803 321 8142</p>
                                        </div>
                                    </div>
                                    
                                    <ArrowRight className="relative z-10 w-6 h-6 text-green-600 group-hover:translate-x-2 transition-transform duration-300" />
                                </a>

                                <a 
                                    href="/contact"
                                    className="group relative bg-white/10 backdrop-blur-xl border border-white/30 text-white px-10 py-6 rounded-2xl font-bold text-xl transition-all duration-300 hover:bg-white/20 hover:scale-105 flex items-center justify-between"
                                >
                                    <span>Visit Contact Page</span>
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
