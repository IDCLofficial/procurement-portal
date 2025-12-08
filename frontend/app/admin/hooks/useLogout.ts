'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slice/authSlice';

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }

    dispatch(logout());
    router.replace('/admin/login');
  }, [dispatch, router]);
};
