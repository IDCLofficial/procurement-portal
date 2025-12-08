'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/app/admin/redux/hooks';

interface ProtectedRouteOptions {
  requiredRoles?: string[];
  redirectTo?: string;
}

export function withProtectedRoute<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: ProtectedRouteOptions = {}
) {
  const { requiredRoles, redirectTo = '/admin/login' } = options;

  const ComponentWithAuth = (props: P) => {
    const router = useRouter();
    const { user, isAuthenticated, initialized } = useAppSelector((state) => state.auth);

    const isAuthorized =
      initialized &&
      isAuthenticated &&
      !!user &&
      (!requiredRoles ||
        requiredRoles.length === 0 ||
        requiredRoles.includes(user.role));

    useEffect(() => {
      if (!initialized) {
        return;
      }

      if (!isAuthorized) {
        router.replace(redirectTo);
      }
    }, [initialized, isAuthorized, router]);

    if (!isAuthorized) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithAuth.displayName =
    `WithProtectedRoute(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithAuth;
}
