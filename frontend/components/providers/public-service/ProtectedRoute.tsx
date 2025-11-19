"use client"

import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const value = useAuth();
    const { isLoading, isAuthenticated, isLoggingOut } = value;
    const router = useRouter();


    useEffect(() => {
        console.log("ProtectedRoute", value);
    }, [value])

    useEffect(() => {
        if (isLoggingOut) return;
        if (!isLoading && !isAuthenticated) {
            // Not authenticated, redirect to login
            router.replace('/vendor-login')
        }
    }, [isAuthenticated, isLoading, router, isLoggingOut])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>{children}</>
    )
}
