"use client"

import React, { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import { VendorSteps } from "@/store/api/enum";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const value = useAuth();
    const { isLoading, isAuthenticated, isLoggingOut, user, token, clearToken } = value;
    const router = useRouter();
    const pathname = usePathname();
    const allowedPathsWhenNotComplete = React.useMemo(() => ["/dashboard/complete-registration", "/dashboard/playground"], []);


    const NEXT_PUBLIC_CAN_SKIP_COMPLETE_REGISTRATION = process.env.NEXT_PUBLIC_CAN_SKIP;

    useEffect(() => {
        if (!isLoading && !token) {
            clearToken();
            router.replace('/vendor-login')
            return;
        }

        // If logging out, don't do anything
        if (isLoggingOut) {
            return;
        }

        // If user is not verified, redirect to register
        if (user && !user.isVerified) {
            const params = new URLSearchParams();
            params.set('vrf', '1');
            params.set('uid', btoa(user.email)); // Note: using btoa for simplicity, adjust if needed
            router.replace(`/register?${params.toString()}`);
            return;
        }

        if (NEXT_PUBLIC_CAN_SKIP_COMPLETE_REGISTRATION !== 'true' && !allowedPathsWhenNotComplete.includes(pathname)) {
            if (user && user.companyForm !== "complete"){
                router.replace('/dashboard/complete-registration');
                return;
            }
        }

    }, [isAuthenticated, isLoading, router, isLoggingOut, user, token, clearToken, NEXT_PUBLIC_CAN_SKIP_COMPLETE_REGISTRATION, allowedPathsWhenNotComplete, pathname]);

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
    
    if (!isAuthenticated || !user || !user.isVerified) {
        return null;
    }

    if (NEXT_PUBLIC_CAN_SKIP_COMPLETE_REGISTRATION !== 'true' && !allowedPathsWhenNotComplete.includes(pathname) && user.companyForm !== VendorSteps.COMPLETE) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting to complete registration...</p>
                </div>
            </div>
        )
    }

    return (
        <>{children}</>
    )
}
