interface ComingSoonSectionProps {
    title: string;
    description: string;
}

export default function ComingSoonSection({ title, description }: ComingSoonSectionProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
                <svg 
                    className="w-8 h-8 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                    />
                </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 text-center max-w-md">{description}</p>
            <div className="mt-4 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                Coming Soon
            </div>
        </div>
    );
}
