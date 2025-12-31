'use client';

import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Client-side Error Boundary using React Error Boundary pattern
 * Catches errors in child components and displays fallback UI
 */
export default class ClientErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback?.(this.state.error, this.resetError) || (
          <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-red-500 mb-2">Something went wrong</h1>
                <p className="text-gray-300 text-sm mb-4">
                  An unexpected error occurred. Please try again or contact support.
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-3 bg-gray-900 rounded border border-red-600 text-xs">
                  <p className="text-red-400 font-mono mb-2">Error:</p>
                  <p className="text-gray-300 font-mono break-words">{this.state.error.message}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={this.resetError}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  aria-label="Try again"
                >
                  Try Again
                </button>
                <button
                  onClick={() => (window.location.href = '/')}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium text-sm"
                  aria-label="Go to home page"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
