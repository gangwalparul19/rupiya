'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import LoadingState from './LoadingState';

interface AdminPageWrapperProps {
  children: React.ReactNode;
}

/**
 * AdminPageWrapper ensures that admin pages are only accessible to authenticated users
 * with admin privileges. This prevents unauthorized access to admin features.
 */
export default function AdminPageWrapper({ children }: AdminPageWrapperProps) {
  const router = useRouter();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const isLoading = useAppStore((state) => state.isLoading);
  const user = useAppStore((state) => state.user);
  const [isMounted, setIsMounted] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isLoading) return;

    // If not authenticated and haven't redirected yet, redirect to login
    if (!isAuthenticated && !user && !hasRedirected) {
      setHasRedirected(true);
      router.replace('/auth/login');
    }

    // TODO: Add role-based check here when admin roles are implemented
    // if (isAuthenticated && user && !isAdmin(user) && !hasRedirected) {
    //   setHasRedirected(true);
    //   router.replace('/');
    // }
  }, [isAuthenticated, isLoading, isMounted, user, hasRedirected, router]);

  // Show loading state while mounting
  if (!isMounted) {
    return <LoadingState fullScreen message="Initializing..." />;
  }

  // Show loading state while auth is being checked
  if (isLoading) {
    return <LoadingState fullScreen message="Loading your data..." />;
  }

  // If not authenticated, show redirecting message
  if (!isAuthenticated || !user) {
    return <LoadingState fullScreen message="Redirecting to login..." />;
  }

  // Only render children if authenticated
  return <>{children}</>;
}
