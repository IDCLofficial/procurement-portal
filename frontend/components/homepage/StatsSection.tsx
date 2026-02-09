'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, FileText, DollarSign, CheckCircle, Clock } from 'lucide-react';

interface StatCardProps {
    value: number;
    label: string;
    prefix?: string;
    suffix?: string;
    bgColor: string;
    textColor: string;
    icon: React.ReactNode;
    description?: string;
    size?: 'small' | 'medium' | 'large';
}

function StatCard({ value, label, prefix = '', suffix = '', bgColor, textColor, icon, description, size = 'medium' }: StatCardProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true);
                        
                        let startValue = 0;
                        const duration = 2000;
                        const increment = value / (duration / 16);
                        
                        const timer = setInterval(() => {
                            startValue += increment;
                            if (startValue >= value) {
                                setDisplayValue(value);
                                clearInterval(timer);
                            } else {
                                setDisplayValue(Math.floor(startValue));
                            }
                        }, 16);
                        
                        return () => clearInterval(timer);
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, [value, hasAnimated]);

    const sizeClasses = {
        small: 'p-8 min-h-[200px]',
        medium: 'p-8 min-h-[280px]',
        large: 'p-8 min-h-[280px]'
    };

    return (
        <div ref={cardRef} className={`group relative ${bgColor} rounded-[32px] ${sizeClasses[size]} overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl cursor-pointer`}>
            <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                    <h3 className={`text-2xl md:text-3xl font-bold ${textColor} leading-tight max-w-[80%]`}>
                        {label}
                    </h3>
                </div>
                
                <div className="mt-auto">
                    <div className={`text-5xl md:text-6xl lg:text-7xl font-black ${textColor} leading-none`}>
                        {prefix}{displayValue.toLocaleString()}{suffix}
                    </div>
                    {description && (
                        <p className={`text-sm ${textColor} opacity-70 mt-3`}>{description}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function StatsSection() {
    const [stats, setStats] = useState({
        totalVendors: 1247,
        activeTenders: 89,
        completedProjects: 456,
        totalValue: 2.4,
        approvedContracts: 342,
        pendingReviews: 23
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                totalVendors: prev.totalVendors + Math.floor(Math.random() * 3),
                activeTenders: 85 + Math.floor(Math.random() * 10),
                completedProjects: prev.completedProjects + Math.floor(Math.random() * 2),
                totalValue: +(prev.totalValue + (Math.random() * 0.1)).toFixed(1),
                approvedContracts: prev.approvedContracts + Math.floor(Math.random() * 2),
                pendingReviews: 20 + Math.floor(Math.random() * 8)
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-20 bg-linear-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <TrendingUp className="h-4 w-4" />
                        <span>Live Statistics</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Bureau Performance <span className="text-green-600">Metrics</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Real-time insights into our procurement activities and achievements
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        icon={<Users className="h-16 w-16" />}
                        value={stats.totalVendors}
                        label="Registered Vendors"
                        bgColor="bg-[#E8F5E9]"
                        textColor="text-[#1B5E20]"
                        description="Active participants in procurement"
                        size="medium"
                    />
                    
                    <StatCard
                        icon={<FileText className="h-12 w-12" />}
                        value={stats.activeTenders}
                        label="Active Tenders"
                        bgColor="bg-[#C8E6C9]"
                        textColor="text-[#2E7D32]"
                        description="Currently open for bidding"
                        size="medium"
                    />
                    
                    <StatCard
                        icon={<CheckCircle className="h-12 w-12" />}
                        value={stats.completedProjects}
                        label="Completed Projects"
                        bgColor="bg-[#A5D6A7]"
                        textColor="text-[#1B5E20]"
                        description="Successfully delivered"
                        size="medium"
                    />
                    
                    <StatCard
                        icon={<DollarSign className="h-16 w-16" />}
                        value={stats.totalValue}
                        label="Total Contract Value"
                        prefix="₦"
                        suffix="B"
                        bgColor="bg-[#1B5E20]"
                        textColor="text-white"
                        description="Cumulative value of all contracts"
                        size="medium"
                    />
                    
                    <StatCard
                        icon={<CheckCircle className="h-12 w-12" />}
                        value={stats.approvedContracts}
                        label="Approved Contracts"
                        bgColor="bg-[#81C784]"
                        textColor="text-[#1B5E20]"
                        description="Ready for execution"
                        size="medium"
                    />
                    
                    <StatCard
                        icon={<Clock className="h-12 w-12" />}
                        value={stats.pendingReviews}
                        label="Pending Reviews"
                        bgColor="bg-[#FFF9C4]"
                        textColor="text-[#F57F17]"
                        description="Awaiting evaluation"
                        size="medium"
                    />
                </div>

                <div className="mt-16 bg-linear-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-8 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">99.8%</div>
                            <div className="text-green-100">Transparency Rate</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <div className="text-green-100">Portal Availability</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">48hrs</div>
                            <div className="text-green-100">Average Response Time</div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .bg-grid-pattern {
                    background-image: 
                        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
                    background-size: 40px 40px;
                }
            `}</style>
        </section>
    );
}
