'use client';

import { ArrowRight, Shield, CheckCircle, Zap, Users } from 'lucide-react';
import { useState } from 'react';

export default function ContractorCTA() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section className="relative py-24 bg-linear-to-br from-slate-950 via-green-950 to-slate-950 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
            
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="relative">
                    <div 
                        className="absolute inset-0 bg-linear-to-r from-green-500 via-emerald-500 to-teal-500 rounded-[40px] blur-3xl opacity-20 transition-opacity duration-700"
                        style={{ opacity: isHovered ? 0.4 : 0.2 }}
                    ></div>
                    
                    <div className="relative bg-linear-to-br from-white/5 to-white/10 backdrop-blur-2xl rounded-[40px] border border-white/20 p-12 md:p-16 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-green-400/20 to-transparent rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-emerald-400/20 to-transparent rounded-full blur-3xl"></div>
                        
                        <div className="absolute inset-0 opacity-10">
                            {[...Array(50)].map((_, i) => (
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

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-flex items-center space-x-2 bg-green-500/20 backdrop-blur-xl border border-green-400/30 text-green-400 px-5 py-2.5 rounded-full text-sm font-bold mb-6">
                                    <Users className="w-4 h-4" />
                                    <span>For Contractors</span>
                                </div>

                                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                                    Are You a{' '}
                                    <span className="bg-linear-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                        Contractor?
                                    </span>
                                </h2>

                                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                    Access exclusive opportunities, manage your applications, and grow your business with Imo State's premier procurement platform.
                                </p>

                                <div className="space-y-4 mb-10">
                                    {[
                                        { icon: CheckCircle, text: 'Access to government contracts' },
                                        { icon: Shield, text: 'Secure and transparent process' },
                                        { icon: Zap, text: 'Real-time application tracking' }
                                    ].map((benefit, idx) => (
                                        <div key={idx} className="flex items-center space-x-3 group">
                                            <div className="shrink-0 w-10 h-10 bg-green-500/20 backdrop-blur-xl border border-green-400/30 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-all duration-300">
                                                <benefit.icon className="w-5 h-5 text-green-400" />
                                            </div>
                                            <span className="text-gray-200 text-lg">{benefit.text}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <a 
                                        href="/contractor/login"
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                        className="group relative inline-flex items-center px-10 py-5 bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            {[...Array(20)].map((_, i) => (
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

                                        <span className="relative z-10">Login to Portal</span>
                                        <ArrowRight className="relative z-10 ml-3 w-6 h-6 transition-transform duration-500 group-hover:translate-x-2" />
                                    </a>

                                    <a 
                                        href="/contractor/register"
                                        className="group relative inline-flex items-center px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/20 text-white font-bold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-green-400/50 hover:scale-105"
                                    >
                                        <span className="relative z-10">Register Now</span>
                                        <ArrowRight className="relative z-10 ml-3 w-6 h-6 transition-transform duration-300 group-hover:translate-x-2" />
                                    </a>
                                </div>

                                <p className="text-sm text-gray-400 mt-6">
                                    New to the platform?{' '}
                                    <a href="/contractor/register" className="text-green-400 hover:text-green-300 underline transition-colors duration-200">
                                        Create your account
                                    </a>
                                    {' '}in minutes
                                </p>
                            </div>

                            <div className="relative hidden lg:block">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-linear-to-br from-green-500/30 to-emerald-500/30 rounded-3xl blur-2xl animate-pulse"></div>
                                    
                                    <div className="relative bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 space-y-6">
                                        <div className="flex items-center justify-between pb-6 border-b border-white/10">
                                            <h3 className="text-2xl font-bold text-white">Quick Stats</h3>
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                                                <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                                            </div>
                                        </div>

                                        {[
                                            { label: 'Active Contractors', value: '500+', color: 'from-green-400 to-emerald-400' },
                                            { label: 'Available Contracts', value: '150+', color: 'from-emerald-400 to-teal-400' },
                                            { label: 'Success Rate', value: '98%', color: 'from-teal-400 to-green-400' }
                                        ].map((stat, idx) => (
                                            <div 
                                                key={idx}
                                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-green-400/30 transition-all duration-300 hover:scale-105"
                                            >
                                                <p className="text-white text-sm font-semibold uppercase tracking-wider mb-2">{stat.label}</p>
                                                <p className={`text-4xl font-black bg-linear-to-r ${stat.color} bg-clip-text text-transparent`}>
                                                    {stat.value}
                                                </p>
                                            </div>
                                        ))}

                                        <div className="pt-6 border-t border-white/10">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-green-500/20 backdrop-blur-xl border border-green-400/30 rounded-xl flex items-center justify-center">
                                                    <Shield className="w-6 h-6 text-green-400" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">Verified Platform</p>
                                                    <p className="text-gray-400 text-sm">Secure & Trusted</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
