'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { logout } from '@/lib/authService';
import ProtectedRoute from '@/components/ProtectedRoute';
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
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-900 p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
            <p className="text-slate-400">Manage your account settings</p>
          </div>

          {/* Profile Card */}
          <div className="bg-slate-800 rounded-lg p-8 mb-6">
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
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Email Address
                </label>
                <p className="text-white">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Display Name
                </label>
                <p className="text-white">{user.displayName || 'Not set'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Account Created
                </label>
                <p className="text-white">
                  {user.metadata?.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="border-t border-slate-700 pt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium disabled:opacity-50"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4">
            <p className="text-blue-200 text-sm">
              💡 Your data is securely stored in Firebase and synced across all your devices.
            </p>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
