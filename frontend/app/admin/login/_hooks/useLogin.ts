'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/app/admin/redux/services/adminApi';
import { useAppDispatch, useAppSelector } from '@/app/admin/redux/hooks';
import { setCredentials } from '@/app/admin/redux/slice/authSlice';
import type { LoginResponse } from '@/app/admin/types/api';

export interface UseLoginReturn {
  // Form state
  email: string;
  password: string;
  showPassword: boolean;
  error: string;
  isLoading: boolean;

  // Handlers
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  toggleShowPassword: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;

  // Auth state
  isRedirecting: boolean;
}

export interface UseLoginOptions {
  redirectPath?: 'admin' | 'wallet';
}

export function useLogin(options?: UseLoginOptions): UseLoginReturn {
  const { redirectPath = 'admin' } = options || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const router = useRouter();
  const [login] = useLoginMutation();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, initialized } = useAppSelector((state) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (!initialized) return;

    if (isAuthenticated && user) {
      setIsRedirecting(true);
      let target: string;
      
      if (redirectPath === 'wallet') {
        target = `/admin/wallet/${user.id}`;
      } else {
        target = user.role === 'Admin' ? '/admin/systemadmin' : `/admin/${user.id}`;
      }
      
      router.replace(target);
    }
  }, [initialized, isAuthenticated, user, router, redirectPath]);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }

      setIsLoading(true);

      try {
        const response = (await login({ email, password }).unwrap()) as LoginResponse;
        const { user: apiUser, token } = response;

        if (!apiUser || !token) {
          throw new Error('Invalid login response');
        }

        // Persist to localStorage
        localStorage.setItem('user', JSON.stringify(apiUser));
        localStorage.setItem('token', token);

        const userId = apiUser._id;

        dispatch(
          setCredentials({
            user: {
              id: userId,
              name: apiUser.fullName,
              email: apiUser.email,
              role: apiUser.role,
            },
            token,
          })
        );

        // Redirect based on role and path
        if (redirectPath === 'wallet') {
          router.push(`/admin/wallet/${userId}`);
        } else if (apiUser.role === 'Admin') {
          router.push('/admin/systemadmin');
        } else {
          router.push(`/admin/${userId}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, login, dispatch, router]
  );

  return {
    email,
    password,
    showPassword,
    error,
    isLoading,
    setEmail,
    setPassword,
    toggleShowPassword,
    handleSubmit,
    isRedirecting,
  };
}
