"use client"
import { decrypt, encrypt } from '@/lib/crypto';
import { User } from '@/store/api/types';
import { useGetProfileQuery } from '@/store/api/vendor.api';
import { useRouter } from 'next/navigation';
import React, { useCallback, useContext, useMemo, useState } from 'react'

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isLoggingOut: boolean;
    clearToken: () => void;
    refresh: () => void;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

// Helper function to retrieve stored token
const getStoredToken = () => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) return null;
        const dec_token = decrypt(storedToken);
        
        if (dec_token && dec_token !== 'n/a') {
            return dec_token;
        }
        
        return null;
    } catch (error) {
        console.error('Failed to retrieve stored token:', error);
        localStorage.removeItem('token');
        return null;
    }
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(() => getStoredToken());
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    // Fetch profile when token is available
    const { data, isLoading, isError, refetch } = useGetProfileQuery(undefined, {
        skip: !token || token === 'n/a',
    });

    // Derive user and isAuthenticated directly from query data
    const user = useMemo(() => {
        if (!token) return null;
        return data ? (data as User) : null;
    }, [data, token]);

    const isAuthenticated = useMemo(() => {
        return !!(token && user && !isError);
    }, [token, user, isError]);

    const clearToken = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');
    }, []);

    React.useEffect(() => {
        if (!user) return;

        if (!user.isVerified) {
            localStorage.removeItem('token');

            const params = new URLSearchParams();
            params.set('vrf', '1');
            params.set('uid', encrypt(user.email));
            
            router.replace(`/register?${params.toString()}`);
        }
    }, [user, router]);

    const login = useCallback((token: string) => {
        const enc_token = encrypt(token);
        setToken(token);
        localStorage.setItem('token', enc_token);
        // User will be fetched automatically by useGetProfileQuery
        router.replace('/dashboard');
    }, [router]);

    const logout = useCallback(() => {
        setIsLoggingOut(true);
        clearToken();
        setIsLoggingOut(false);
        router.replace('/vendor-login');
    }, [router, clearToken]);

    const refresh = useCallback(() => {
        if (token) {
            refetch();
        }
    }, [token, refetch]);

    const value = useMemo(() => ({
        user,
        token,
        isLoading,
        isAuthenticated,
        isLoggingOut,
        refresh,
        login,
        logout,
        clearToken,
    }), [user, token, isLoading, isAuthenticated, isLoggingOut, refresh, login, logout, clearToken]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}