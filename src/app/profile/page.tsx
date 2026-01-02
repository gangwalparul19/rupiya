'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import PageWrapper from '@/components/PageWrapper';
import { logout } from '@/lib/authService';
import LoadingState from '@/components/LoadingState';
import { useToast } from '@/lib/toastContext';

export default function ProfilePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const user = useAppStore((state) => state.user);
  const isLoading = useAppStore((state) => state.isLoading);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      showToast('Logged out successfully', 'success');
      router.push('/auth/login');
    } catch (error) {
      showToast('Failed to logout', 'error');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return <LoadingState fullScreen message="Loading profile..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <PageWrapper>
      <div className="py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-block">
          <h1 className="heading-page">Profile</h1>
          <p className="text-secondary">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <div className="card max-w-2xl">
          <div className="flex items-center gap-6 mb-8">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {user.email?.[0].toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {user.displayName || 'User'}
              </h2>
              <p className="text-slate-400">{user.email}</p>
            </div>
          </div>

          {/* Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <label className="form-label text-slate-400">Email Address</label>
              <p className="text-lg font-medium text-white">{user.email}</p>
            </div>

            <div>
              <label className="form-label text-slate-400">Display Name</label>
              <p className="text-lg font-medium text-white">{user.displayName || 'Not set'}</p>
            </div>

            <div>
              <label className="form-label text-slate-400">Account Created</label>
              <p className="text-lg font-medium text-white">
                {user.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, { dateStyle: 'long' })
                  : 'Unknown'}
              </p>
            </div>

            <div>
              <label className="form-label text-slate-400">Currency Preference</label>
              <p className="text-lg font-medium text-white">INR (₹)</p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-slate-700 pt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="btn btn-danger w-full"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4 max-w-2xl mt-block">
          <p className="text-blue-200 text-sm">
            💡 Your data is securely stored in Firebase and synced across all your devices.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}


