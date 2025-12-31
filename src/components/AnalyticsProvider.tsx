'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import {
  initializeAnalytics,
  setAnalyticsUserId,
  setAnalyticsUserProperties,
  trackPageView,
  trackUserAction,
} from '@/lib/analytics';
import { performanceMonitor } from '@/lib/performance';

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAppStore((state) => state.user);

  // Initialize analytics on mount
  useEffect(() => {
    initializeAnalytics();
    performanceMonitor; // Initialize performance monitor
  }, []);

  // Set user ID when user logs in
  useEffect(() => {
    if (user?.uid) {
      setAnalyticsUserId(user.uid);

      // Set user properties
      setAnalyticsUserProperties({
        email: user.email,
        display_name: user.displayName,
        user_id: user.uid,
        login_time: new Date().toISOString(),
      });

      // Track user action
      trackUserAction('user_login', {
        email: user.email,
        login_method: user.providerData?.[0]?.providerId || 'email',
      });
    }
  }, [user?.uid]);

  // Track page views
  useEffect(() => {
    if (pathname) {
      const pageName = pathname.split('/').filter(Boolean).join('/') || 'home';
      trackPageView(pageName, `Rupiya - ${pageName}`);
    }
  }, [pathname]);

  return <>{children}</>;
}
