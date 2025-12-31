/**
 * Analytics Service
 * Tracks user behavior, events, and interactions
 * Uses Firebase Analytics for data collection
 */

import { getAnalytics, logEvent, setUserProperties, setUserId } from 'firebase/analytics';
import { app } from './firebase';

let analytics: any = null;

// Initialize analytics
export const initializeAnalytics = () => {
  try {
    analytics = getAnalytics(app);
    console.log('Analytics initialized');
  } catch (error) {
    console.error('Failed to initialize analytics:', error);
  }
};

// Set user ID for tracking
export const setAnalyticsUserId = (userId: string) => {
  try {
    if (analytics) {
      setUserId(analytics, userId);
    }
  } catch (error) {
    console.error('Failed to set user ID:', error);
  }
};

// Set user properties
export const setAnalyticsUserProperties = (properties: Record<string, any>) => {
  try {
    if (analytics) {
      setUserProperties(analytics, properties);
    }
  } catch (error) {
    console.error('Failed to set user properties:', error);
  }
};

// Track page view
export const trackPageView = (pageName: string, pageTitle?: string) => {
  try {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_name: pageName,
        page_title: pageTitle || pageName,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

// Track user action
export const trackUserAction = (action: string, details?: Record<string, any>) => {
  try {
    if (analytics) {
      logEvent(analytics, 'user_action', {
        action,
        ...details,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Failed to track user action:', error);
  }
};

// Track feature usage
export const trackFeatureUsage = (feature: string, action: string, details?: Record<string, any>) => {
  try {
    if (analytics) {
      logEvent(analytics, 'feature_usage', {
        feature,
        action,
        ...details,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Failed to track feature usage:', error);
  }
};

// Track error
export const trackError = (errorName: string, errorMessage: string, errorStack?: string) => {
  try {
    if (analytics) {
      logEvent(analytics, 'error_event', {
        error_name: errorName,
        error_message: errorMessage,
        error_stack: errorStack,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Failed to track error:', error);
  }
};

// Track transaction
export const trackTransaction = (
  transactionId: string,
  transactionType: string,
  amount: number,
  currency: string,
  details?: Record<string, any>
) => {
  try {
    if (analytics) {
      logEvent(analytics, 'transaction', {
        transaction_id: transactionId,
        transaction_type: transactionType,
        amount,
        currency,
        ...details,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Failed to track transaction:', error);
  }
};

// Track module access
export const trackModuleAccess = (moduleName: string) => {
  try {
    if (analytics) {
      logEvent(analytics, 'module_access', {
        module_name: moduleName,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Failed to track module access:', error);
  }
};

// Track search
export const trackSearch = (searchQuery: string, searchType: string, resultsCount: number) => {
  try {
    if (analytics) {
      logEvent(analytics, 'search', {
        search_query: searchQuery,
        search_type: searchType,
        results_count: resultsCount,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Failed to track search:', error);
  }
};

// Track export
export const trackExport = (exportType: string, dataType: string, recordCount: number) => {
  try {
    if (analytics) {
      logEvent(analytics, 'export', {
        export_type: exportType,
        data_type: dataType,
        record_count: recordCount,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Failed to track export:', error);
  }
};

// Track session duration
export const trackSessionDuration = (durationSeconds: number) => {
  try {
    if (analytics) {
      logEvent(analytics, 'session_duration', {
        duration_seconds: durationSeconds,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Failed to track session duration:', error);
  }
};

// Track feature engagement
export const trackFeatureEngagement = (
  feature: string,
  engagementType: string,
  engagementValue?: number
) => {
  try {
    if (analytics) {
      logEvent(analytics, 'feature_engagement', {
        feature,
        engagement_type: engagementType,
        engagement_value: engagementValue,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Failed to track feature engagement:', error);
  }
};
