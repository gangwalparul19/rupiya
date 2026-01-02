'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { loginWithEmail, loginWithGoogle } from '@/lib/authService';

// Validation utilities
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getErrorMessage = (code: string): string => {
  const messages: Record<string, string> = {
    'auth/user-not-found': 'Email not found. Please sign up first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-email': 'Invalid email format.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
  };
  return messages[code] || 'Failed to sign in. Please try again.';
};

export default function LoginPage() {
  const router = useRouter();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await loginWithEmail(email, password);
      router.push('/');
    } catch (err: any) {
      const errorCode = err.code || '';
      const errorMessage = getErrorMessage(errorCode);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      await loginWithGoogle();
      router.push('/');
    } catch (err: any) {
      console.error('Google Sign-in Error:', err);
      const errorCode = err.code || '';
      const errorMessage = err.message || '';
      
      // Provide specific error messages based on error code
      let displayError = 'Failed to sign in with Google. Please try again.';
      
      if (errorCode === 'auth/popup-closed-by-user') {
        displayError = 'Sign-in popup was closed. Please try again.';
      } else if (errorCode === 'auth/popup-blocked-by-browser') {
        displayError = 'Sign-in popup was blocked by your browser. Please allow popups and try again.';
      } else if (errorCode === 'auth/cancelled-popup-request') {
        displayError = 'Sign-in was cancelled. Please try again.';
      } else if (errorCode === 'auth/invalid-api-key') {
        displayError = 'Firebase configuration error. Please contact support.';
      } else if (errorMessage.includes('OAuth')) {
        displayError = 'Google OAuth is not properly configured. Please contact support.';
      }
      
      setError(displayError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-3 sm:px-4 py-4">
      <div className="w-full max-w-sm">
        <div className="card">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2 text-white">💰 Rupiya</h1>
            <p className="text-secondary">Smart Expense Tracker</p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleEmailLogin} className="space-y-3 sm:space-y-4 mb-6">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                required
              />
            </div>

            {error && (
              <div className="bg-red-600 bg-opacity-20 border border-red-600 rounded px-3 sm:px-4 py-2 text-red-200 text-xs sm:text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center">
              <Link href="/auth/forgot-password" className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium">
                Forgot password?
              </Link>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 sm:gap-4 mb-6">
            <div className="flex-1 h-px bg-slate-600"></div>
            <span className="text-slate-400 text-xs">or</span>
            <div className="flex-1 h-px bg-slate-600"></div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="btn btn-secondary w-full flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="hidden sm:inline">Sign in with Google</span>
            <span className="sm:hidden">Google</span>
          </button>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-300 text-xs sm:text-sm">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
