'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import LoadingState from './LoadingState';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const isLoading = useAppStore((state) => state.isLoading);
  const user = useAppStore((state) => state.user);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // While mounting or loading, show loading state
  if (!isMounted || isLoading) {
    return <LoadingState fullScreen message="Loading your data..." />;
  }

  // If not authenticated, redirect immediately
  if (!isAuthenticated || !user) {
    // Redirect to login
    router.replace('/auth/login');
    // Show loading state while redirecting
    return <LoadingState fullScreen message="Redirecting to login..." />;
  }

  // Only render children if authenticated and user exists
  return <>{children}</>;
}
