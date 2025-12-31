'use client';

import React, { ReactNode, useState, useEffect } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary component to catch and handle errors in child components
 * Prevents entire app from crashing when an error occurs
 */
export default function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
    errorInfo: null,
  });

  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setState({
        hasError: true,
        error: new Error(event.reason?.message || 'Unhandled promise rejection'),
        errorInfo: null,
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);

  // Reset error state
  const resetError = () => {
    setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  if (state.hasError) {
    return (
      fallback || (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-red-500 mb-2">Oops! Something went wrong</h1>
              <p className="text-gray-300 text-sm mb-4">
                We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && state.error && (
              <div className="mb-4 p-3 bg-gray-900 rounded border border-red-600 text-xs">
                <p className="text-red-400 font-mono mb-2">Error Details:</p>
                <p className="text-gray-300 font-mono break-words">{state.error.toString()}</p>
                {state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-gray-400 cursor-pointer">Stack Trace</summary>
                    <pre className="text-gray-400 text-xs mt-2 overflow-auto max-h-40">
                      {state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={resetError}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium text-sm"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
