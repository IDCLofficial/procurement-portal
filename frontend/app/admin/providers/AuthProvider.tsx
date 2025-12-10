'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/admin/redux/hooks';
import { setCredentials, logout } from '@/app/admin/redux/slice/authSlice';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { initialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (initialized) return;

    const bootstrapAuth = () => {
      if (typeof window === 'undefined') return;

      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (!storedUser || !storedToken) {
          // Mark as initialized even if there is no auth info
          dispatch(logout());
          return;
        }

        const parsedUser = JSON.parse(storedUser);

        const id = parsedUser._id ?? parsedUser.id;
        const name = parsedUser.fullName ?? parsedUser.name;
        const email = parsedUser.email;
        const role = parsedUser.role;

        if (!id || !email || !role) {
          throw new Error('Invalid stored user');
        }

        dispatch(
          setCredentials({
            user: { id, name, email, role },
            token: storedToken,
          })
        );
      } catch {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
        dispatch(logout());
      }
    };

    bootstrapAuth();
  }, [dispatch, initialized]);

  return <>{children}</>;
};
