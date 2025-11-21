"use client"
import React from 'react';
import { useSelector } from 'react-redux';
import { selectAuthToken, selectAuthIsLoading, selectAuthIsAuthenticated, selectAuthIsLoggingOut } from '@/store/slices/authSlice';
import { selectUserData } from '@/store/slices/userSlice';
import { selectCompanyData } from '@/store/slices/companySlice';

const DebugSlices: React.FC = () => {
    const NEXT_PUBLIC_DEBUG_STATE = process.env.NEXT_PUBLIC_DEBUG_STATE;
    const authToken = useSelector(selectAuthToken);
    const authIsLoading = useSelector(selectAuthIsLoading);
    const authIsAuthenticated = useSelector(selectAuthIsAuthenticated);
    const authIsLoggingOut = useSelector(selectAuthIsLoggingOut);
    
    const userData = useSelector(selectUserData);
    const companyData = useSelector(selectCompanyData);
    
    if (NEXT_PUBLIC_DEBUG_STATE !== 'true') return null;

    return (
        <div style={{ position: 'fixed', bottom: 0, right: 0, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '10px', maxWidth: '400px', maxHeight: '50vh', overflow: 'auto', zIndex: 9999 }}>
            <h4>Slice Data</h4>
            <div>
                <strong>Auth:</strong>
                <pre>{JSON.stringify({ token: authToken ? '***' : null, isLoading: authIsLoading, isAuthenticated: authIsAuthenticated, isLoggingOut: authIsLoggingOut }, null, 2)}</pre>
            </div>
            <div>
                <strong>User:</strong>
                <pre>{JSON.stringify(userData, null, 2)}</pre>
            </div>
            <div>
                <strong>Company:</strong>
                <pre>{JSON.stringify(companyData, null, 2)}</pre>
            </div>
        </div>
    );
};

export default DebugSlices;
