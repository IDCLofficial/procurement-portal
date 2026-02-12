'use client';

import Image from 'next/image';
import { Sparkles, Shield, TrendingUp, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AboutSection() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const images = [
        { src: '/images/bpppi.png', alt: 'Bureau of Public Procurement and Price Intelligence' },
        { src: '/images/bpppi1.png', alt: 'BPPPI Office Building' },
        { src: '/images/bpppi2.png', alt: 'BPPPI Team' }
    ];

    useEffect(() => {
        setIsVisible(true);
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section className="relative py-32 bg-linear-to-br from-slate-950 via-slate-900 to-green-950 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
            
            <div className="absolute top-20 left-10 w-96 h-96 bg-green-500/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div 
                className="absolute w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none transition-all duration-300"
                style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                    left: mousePosition.x - 300,
                    top: mousePosition.y - 300,
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
                        <div className="relative group">
                            <div className="rounded-3xl  group-hover:opacity-50 transition-opacity duration-700 animate-pulse"></div>
                            
                            <div className="relative h-[550px] rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5">
                                {images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-all duration-1000 ${
                                            index === currentSlide
                                                ? 'translate-x-0'
                                                : index < currentSlide
                                                ? 'opacity-0 -translate-x-full'
                                                : 'opacity-0 translate-x-full'
                                        }`}
                                    >
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            fill
                                            className="object-cover transition-all duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                ))}
                                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                                
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    {[...Array(30)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-1 h-1 bg-green-400 rounded-full animate-pulse"
                                            style={{
                                                top: `${Math.random() * 100}%`,
                                                left: `${Math.random() * 100}%`,
                                                animationDelay: `${Math.random() * 3}s`,
                                                animationDuration: `${2 + Math.random() * 3}s`
                                            }}
                                        />
                                    ))}
                                </div>

                                <div className="absolute top-6 right-6 flex gap-2">
                                    {images.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`w-3 h-3 rounded-full transition-all duration-500 ${
                                                index === currentSlide
                                                    ? 'bg-green-400 scale-125 ring-2 ring-green-400/50'
                                                    : 'bg-white/30 hover:bg-white/50'
                                            }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                                
                                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
                                    {[
                                        { icon: Shield, value: '2019', label: 'Established' },
                                        { icon: TrendingUp, value: '100%', label: 'Transparent' },
                                        { icon: Zap, value: '24/7', label: 'Available' }
                                    ].map((stat, idx) => (
                                        <div 
                                            key={idx}
                                            className="relative bg-slate-900/80 backdrop-blur-xl border border-green-500/30 p-4 rounded-2xl transition-all duration-500 hover:bg-slate-900/90 hover:border-green-400/50 hover:scale-105 hover:-translate-y-2 group/card"
                                        >
                                            <div className="absolute inset-0 bg-linear-to-br from-green-500/10 to-transparent rounded-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                                            <stat.icon className="w-5 h-5 text-green-400 mb-2 transition-transform duration-500 group-hover/card:rotate-12" />
                                            <h3 className="text-2xl font-bold bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1">{stat.value}</h3>
                                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-linear-to-br from-green-500/20 to-emerald-500/20 rounded-3xl -z-10 blur-2xl"></div>
                            <div className="absolute -top-8 -left-8 w-48 h-48 bg-linear-to-br from-teal-500/20 to-green-500/20 rounded-3xl -z-10 blur-2xl"></div>
                        </div>
                    </div>

                    <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
                        <div className="inline-flex items-center space-x-2 bg-linear-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/30 text-green-400 px-5 py-2.5 rounded-full text-sm font-bold mb-8 group hover:border-green-400/50 transition-all duration-300">
                            <Sparkles className="w-4 h-4 animate-pulse" />
                            <span>About Us</span>
                        </div>
                        
                        <h2 className="text-2xl md:text-4xl font-black text-white mb-8 leading-tight">
                            Bureau of Public Procurement and{' '}
                            <span className="bg-linear-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-pulse">
                                Price Intelligence
                            </span>
                        </h2>
                        
                        <div className="space-y-6 mb-10">
                            <p className="text-lg text-gray-300 leading-relaxed backdrop-blur-sm">
                                The Bureau of Public Procurement and Price Intelligence (BPPPI) is the regulatory body responsible for overseeing and monitoring public procurement processes in Imo State. Established to ensure transparency, accountability, and value for money in government contracts, we serve as the cornerstone of fiscal responsibility in the state.
                            </p>
                            
                            <p className="text-lg text-gray-300 leading-relaxed backdrop-blur-sm">
                                Through our e-procurement platform, we have revolutionized the way government contracts are awarded, making the process more accessible, transparent, and efficient. We are committed to upholding the highest standards of integrity and professionalism in all our operations.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <a 
                                href="/about" 
                                className="group relative inline-flex items-center px-8 py-4 bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50"
                            >
                                <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative z-10">Learn More About Us</span>
                                <svg className="relative z-10 ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    {[...Array(10)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute w-1 h-1 bg-white rounded-full"
                                            style={{
                                                top: `${Math.random() * 100}%`,
                                                left: `${Math.random() * 100}%`,
                                                animation: `pulse ${2 + Math.random() * 2}s infinite`,
                                                animationDelay: `${Math.random() * 2}s`
                                            }}
                                        />
                                    ))}
                                </div>
                            </a>
                            
                            <a 
                                href="/e-procurement" 
                                className="group relative inline-flex items-center px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-bold rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-green-400/50 hover:scale-105"
                            >
                                <span className="relative z-10">Visit E-Portal</span>
                                <Zap className="relative z-10 ml-2 w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                            </a>
                        </div>

                        <div className="mt-10 grid grid-cols-3 gap-4">
                            {[
                                { label: 'Active Projects', value: '150+' },
                                { label: 'Contractors', value: '500+' },
                                { label: 'Success Rate', value: '98%' }
                            ].map((metric, idx) => (
                                <div key={idx} className="text-center p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:border-green-400/30 transition-all duration-300">
                                    <div className="text-2xl font-bold bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">{metric.value}</div>
                                    <div className="text-xs text-gray-400 mt-1">{metric.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
