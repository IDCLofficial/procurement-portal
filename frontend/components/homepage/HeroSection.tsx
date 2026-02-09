import Image from 'next/image';

export default function HeroSection() {
    return (
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-linear-to-br from-gray-50 to-white px-4 sm:px-6 lg:px-8 py-20">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
                    <Image src="/images/ministry-logo.png" alt="Ministry Logo" width={600} height={600} className="object-contain " />
                </div>
                <div className="absolute top-20 left-10 opacity-30">
                    <Image src="/images/ministry-logo.png" alt="Ministry Logo" width={64} height={64} className="object-contain" />
                </div>
                <div className="absolute bottom-32 left-1/4 opacity-20">
                    <Image src="/images/ministry-logo.png" alt="Ministry Logo" width={48} height={48} className="object-contain" />
                </div>
                <div className="absolute top-40 right-20 opacity-25">
                    <Image src="/images/ministry-logo.png" alt="Ministry Logo" width={80} height={80} className="object-contain" />
                </div>
                <div className="absolute bottom-40 right-32 opacity-30">
                    <Image src="/images/ministry-logo.png" alt="Ministry Logo" width={40} height={40} className="object-contain" />
                </div>
                <div className="absolute top-1/2 left-1/3 opacity-20">
                    <Image src="/images/ministry-logo.png" alt="Ministry Logo" width={24} height={24} className="object-contain" />
                </div>
            </div>

            <div className="relative max-w-6xl mx-auto text-center z-10">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
                    Ensuring <span className="text-green-600">transparency</span> and
                    <br />
                    <span className="text-green-600">accountability</span> in public
                    <br />
                    procurement for <span className="text-green-600">Imo State</span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mb-12">
                    The Bureau of Public Procurement and Price Intelligence is committed to
                    <br />
                    establishing a <span className="font-semibold">fair, transparent, and efficient</span> procurement system that delivers value for money
                </p>

                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    <div className="group cursor-pointer">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-green-600 transition-all duration-300 hover:scale-110">
                            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="mt-3 text-sm font-medium text-gray-700">Transparency</p>
                    </div>

                    <div className="group cursor-pointer">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-green-600 transition-all duration-300 hover:scale-110">
                            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <p className="mt-3 text-sm font-medium text-gray-700">Efficiency</p>
                    </div>

                    <div className="group cursor-pointer">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-green-600 transition-all duration-300 hover:scale-110">
                            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 group-hover:text-green-800 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <p className="mt-3 text-sm font-medium text-gray-700">Accountability</p>
                    </div>
                </div>
            </div>
        </section>
    );
}