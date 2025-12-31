'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      const errorCode = err.code || '';
      if (errorCode === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else if (errorCode === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 md:p-8 text-white">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="heading-page">🔐 Reset Password</h1>
            <p className="text-secondary text-xs md:text-sm">Enter your email to receive a password reset link</p>
          </div>

          {success ? (
            <div className="space-y-4">
              <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-lg p-3 md:p-4">
                <p className="text-green-200 text-xs md:text-sm">
                  ✓ Password reset email sent! Check your inbox for instructions.
                </p>
              </div>
              <a href="/auth/login">
                <button className="btn btn-primary w-full">
                  Back to Login
                </button>
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-600 bg-opacity-20 border border-red-600 rounded px-3 md:px-4 py-2 text-red-200 text-xs md:text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Reset Email'}
              </button>

              <div className="text-center">
                <p className="text-secondary text-xs md:text-sm">
                  Remember your password?{' '}
                  <a href="/auth/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                    Sign in
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
