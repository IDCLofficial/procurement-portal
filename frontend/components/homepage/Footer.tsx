import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <div className="mb-6">
                            <Image 
                                src="/images/ministry-logo.png" 
                                alt="BPPPI Logo" 
                                width={120}
                                height={120}
                                className="mb-4"
                            />
                            <h3 className="text-white font-bold text-lg mb-2">
                                Bureau of Public Procurement and Price Intelligence
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Ensuring transparency and accountability in public procurement across Imo State.
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-4">Contact Information</h4>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-green-400 shrink-0 mt-1" />
                                <div>
                                    <p className="text-gray-300">+234 803 456 7890</p>
                                    <p className="text-gray-500 text-sm">Mon - Fri, 8AM - 5PM</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-green-400 shrink-0 mt-1" />
                                <div>
                                    <p className="text-gray-300">info@bpppi.imo.gov.ng</p>
                                    <p className="text-gray-500 text-sm">We reply within 24 hours</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-lg mb-4">Our Address</h4>
                        <div className="flex items-start space-x-3">
                            <MapPin className="w-5 h-5 text-green-400 shrink-0 mt-1" />
                            <div>
                                <p className="text-gray-300">Government House</p>
                                <p className="text-gray-300">Owerri, Imo State</p>
                                <p className="text-gray-300">Nigeria</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8">
                    <div className="text-center text-gray-500 text-sm">
                        <p>&copy; {new Date().getFullYear()} Bureau of Public Procurement and Price Intelligence. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
