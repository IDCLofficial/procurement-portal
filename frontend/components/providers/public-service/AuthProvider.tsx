"use client"
import { decrypt, encrypt } from '@/lib/crypto';
import { CompanyDetailsResponse, User } from '@/store/api/types';
import { useGetCompanyDetailsQuery, useGetProfileQuery } from '@/store/api/vendor.api';
import { useRouter } from 'next/navigation';
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthIsLoading, selectAuthIsAuthenticated, selectAuthIsLoggingOut, login, logout, clearToken, refresh } from '@/store/slices/authSlice';
import { selectUserData } from '@/store/slices/userSlice';
import { selectCompanyData } from '@/store/slices/companySlice';

interface AuthContextType {
    user: User | null;
    company: CompanyDetailsResponse | null;
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
    const router = useRouter();
    const dispatch = useDispatch();

    // Sync slice on mount if token exists
    React.useEffect(() => {
        if (token) {
            dispatch(login(token));
        }
    }, [token, dispatch]);

    // Keep queries for fetching data
    const { refetch: refetchProfile } = useGetProfileQuery(undefined, {
        skip: !token || token === 'n/a',
    });
    const { refetch: refetchCompanyDetails } = useGetCompanyDetailsQuery(undefined, {
        skip: !token || token === 'n/a',
    });

    // Use slice data
    const user = useSelector(selectUserData);
    const isAuthenticated = useSelector(selectAuthIsAuthenticated);
    const isLoading = useSelector(selectAuthIsLoading);
    const isLoggingOut = useSelector(selectAuthIsLoggingOut);
    const company = useSelector(selectCompanyData);

    const handleClearToken = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');
        dispatch(clearToken());
    }, [dispatch]);

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

    const handleLogin = useCallback((token: string) => {
        const enc_token = encrypt(token);
        setToken(token);
        localStorage.setItem('token', enc_token);
        dispatch(login(token));
        // User will be fetched automatically by useGetProfileQuery
        router.replace('/dashboard');
    }, [router, dispatch]);

    const handleLogout = useCallback(() => {
        dispatch(logout());
        handleClearToken();
        router.replace('/vendor-login');
    }, [router, handleClearToken, dispatch]);

    const handleRefresh = useCallback(() => {
        dispatch(refresh());
        if (token) {
            refetchProfile();
            refetchCompanyDetails();
        }
    }, [token, refetchProfile, refetchCompanyDetails, dispatch]);

    const value = useMemo(() => ({
        user,
        company,
        token,
        isLoading,
        isAuthenticated,
        isLoggingOut,
        refresh: handleRefresh,
        login: handleLogin,
        logout: handleLogout,
        clearToken: handleClearToken,
    }), [user, token, isLoading, isAuthenticated, isLoggingOut, handleRefresh, handleLogin, handleLogout, handleClearToken, company]);

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