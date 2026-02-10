'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FileCheck, Shield, Database, Users, BookOpen, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

interface ServiceCardProps {
    service: {
        icon: React.ReactNode;
        title: string;
        description: string;
        color: string;
        bgColor: string;
        accentColor: string;
    };
    index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const rotations = [-8, 4, -6, 5, -4, 6];
    const rotation = rotations[index % rotations.length];

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePosition({ x, y });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative bg-white p-6 overflow-hidden transition-all duration-700 hover:scale-110 hover:z-50 cursor-pointer`}
            style={{
                animationDelay: `${index * 100}ms`,
                transform: `rotate(${rotation}deg)`,
                boxShadow: isHovered 
                    ? `0 30px 60px -15px ${service.accentColor}60, 0 0 0 8px white, 0 0 0 10px ${service.accentColor}30`
                    : '0 15px 35px -10px rgba(0,0,0,0.2), 0 0 0 8px white, 0 0 0 10px rgba(0,0,0,0.05)',
                transition: 'all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
        >
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${service.accentColor}15, transparent 40%)`
                }}
            />

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 rounded-full animate-pulse"
                        style={{
                            background: service.accentColor,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                <div className={`bg-linear-to-br ${service.color} p-8 -m-6 mb-6 flex items-center justify-center min-h-[200px] transform transition-all duration-500 group-hover:scale-105`}>
                    <div className="transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                        {service.icon}
                    </div>
                </div>

                <div className="px-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 transform transition-all duration-500 group-hover:translate-x-2">
                        {service.title}
                    </h3>

                    <p className="text-gray-700 text-sm leading-relaxed mb-4 transform transition-all duration-500 group-hover:translate-x-1">
                        {service.description}
                    </p>

                    <div className="flex items-center text-gray-900 font-bold text-xs transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <span>Explore Service</span>
                        <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-500 group-hover:translate-x-2" />
                    </div>
                </div>
            </div>

            <div 
                className="absolute w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-all duration-700"
                style={{
                    background: service.accentColor,
                    top: mousePosition.y - 64,
                    left: mousePosition.x - 64,
                }}
            />
        </div>
    );
}

export default function ServicesSection() {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect();
                setCursorPosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const services = [
        {
            icon: <FileCheck className="h-10 w-10" />,
            title: "Procurement Oversight",
            description: "Comprehensive monitoring and regulation of all public procurement processes",
            color: "from-amber-400 to-amber-500",
            bgColor: "bg-linear-to-br from-amber-50 to-amber-100",
            accentColor: "#f59e0b"
        },
        {
            icon: <Shield className="h-10 w-10" />,
            title: "Compliance Certification",
            description: "Certification and verification of procurement compliance standards",
            color: "from-green-500 to-green-600",
            bgColor: "bg-linear-to-br from-green-50 to-green-100",
            accentColor: "#10b981"
        },
        {
            icon: <Database className="h-10 w-10" />,
            title: "Vendor Database",
            description: "Comprehensive registry of certified contractors and service providers",
            color: "from-stone-400 to-stone-500",
            bgColor: "bg-linear-to-br from-stone-50 to-stone-100",
            accentColor: "#78716c"
        },
        {
            icon: <Users className="h-10 w-10" />,
            title: "Professional Training",
            description: "Capacity building and certification programs for procurement officers",
            color: "from-yellow-400 to-yellow-500",
            bgColor: "bg-linear-to-br from-yellow-50 to-yellow-100",
            accentColor: "#eab308"
        },
        {
            icon: <BookOpen className="h-10 w-10" />,
            title: "Policy Development",
            description: "Formulation and implementation of procurement policies and guidelines",
            color: "from-orange-400 to-orange-500",
            bgColor: "bg-linear-to-br from-orange-50 to-orange-100",
            accentColor: "#f97316"
        },
        {
            icon: <TrendingUp className="h-10 w-10" />,
            title: "Price Intelligence",
            description: "Market analysis and price benchmarking for informed procurement decisions",
            color: "from-lime-500 to-lime-600",
            bgColor: "bg-linear-to-br from-lime-50 to-lime-100",
            accentColor: "#84cc16"
        }
    ];

    return (
        <section ref={sectionRef} className="py-24 bg-linear-to-b from-white via-gray-50 to-white relative px-6 overflow-hidden">
            <div 
                className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20 transition-all duration-1000"
                style={{
                    background: 'radial-gradient(circle, #10b981 0%, transparent 70%)',
                    top: cursorPosition.y - 250,
                    left: cursorPosition.x - 250,
                    pointerEvents: 'none'
                }}
            />

            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full" 
                     style={{
                         backgroundImage: 'radial-gradient(circle at 2px 2px, #16a34a 1px, transparent 0)',
                         backgroundSize: '40px 40px'
                     }}>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-5 py-2 rounded-full text-sm font-semibold mb-6">
                        <span>What We Do</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Our <span className="text-green-600">Services</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Comprehensive solutions for transparent and efficient public procurement
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </div>

                <div className="flex flex-col items-center space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-linear-to-r from-green-400 to-green-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                        <a 
                            href="/about" 
                            className="relative inline-flex items-center px-8 py-4 bg-linear-to-r from-green-600 to-green-700 text-white font-bold text-lg rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-xl group-hover:shadow-2xl group-hover:scale-105"
                        >
                            <span>View Full List of Departments</span>
                            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                        </a>
                    </div>
                    
                    <p className="text-sm text-gray-500">
                        Discover how we can help streamline your procurement process
                    </p>
                </div>
            </div>

            <div className="absolute top-20 right-20 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
        </section>
    );
}
