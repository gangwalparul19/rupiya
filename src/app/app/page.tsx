'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const user = useAppStore((state) => state.user);
  const expenses = useAppStore((state) => state.expenses);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">💰 Rupiya</h1>
          <p className="text-slate-300">Smart Expense Tracker</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-700 rounded-lg p-6 text-white">
            <p className="text-slate-300 text-sm">Total Expenses</p>
            <p className="text-3xl font-bold">
              ₹{expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-slate-700 rounded-lg p-6 text-white">
            <p className="text-slate-300 text-sm">Transactions</p>
            <p className="text-3xl font-bold">{expenses.length}</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-6 text-white">
            <p className="text-slate-300 text-sm">Houses</p>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-6 text-white">
            <p className="text-slate-300 text-sm">Vehicles</p>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/expenses">
            <div className="bg-blue-600 hover:bg-blue-700 rounded-lg p-8 text-white cursor-pointer transition">
              <div className="text-4xl mb-2">📊</div>
              <h2 className="text-xl font-bold">Expenses</h2>
              <p className="text-blue-100 text-sm">Track daily expenses</p>
            </div>
          </Link>

          <Link href="/houses">
            <div className="bg-green-600 hover:bg-green-700 rounded-lg p-8 text-white cursor-pointer transition">
              <div className="text-4xl mb-2">🏠</div>
              <h2 className="text-xl font-bold">Houses</h2>
              <p className="text-green-100 text-sm">Manage properties</p>
            </div>
          </Link>

          <Link href="/vehicles">
            <div className="bg-purple-600 hover:bg-purple-700 rounded-lg p-8 text-white cursor-pointer transition">
              <div className="text-4xl mb-2">🚗</div>
              <h2 className="text-xl font-bold">Vehicles</h2>
              <p className="text-purple-100 text-sm">Track fuel & maintenance</p>
            </div>
          </Link>

          <Link href="/notes">
            <div className="bg-yellow-600 hover:bg-yellow-700 rounded-lg p-8 text-white cursor-pointer transition">
              <div className="text-4xl mb-2">📝</div>
              <h2 className="text-xl font-bold">Notes</h2>
              <p className="text-yellow-100 text-sm">Daily logs & journals</p>
            </div>
          </Link>

          <Link href="/documents">
            <div className="bg-red-600 hover:bg-red-700 rounded-lg p-8 text-white cursor-pointer transition">
              <div className="text-4xl mb-2">📄</div>
              <h2 className="text-xl font-bold">Documents</h2>
              <p className="text-red-100 text-sm">Vault for bills & receipts</p>
            </div>
          </Link>

          <Link href="/analytics">
            <div className="bg-indigo-600 hover:bg-indigo-700 rounded-lg p-8 text-white cursor-pointer transition">
              <div className="text-4xl mb-2">📈</div>
              <h2 className="text-xl font-bold">Analytics</h2>
              <p className="text-indigo-100 text-sm">Insights & reports</p>
            </div>
          </Link>
        </div>

        {/* Auth Section */}
        <div className="mt-12 text-center">
          {!user ? (
            <Link href="/auth/login">
              <button className="bg-white text-slate-900 px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition">
                Sign In
              </button>
            </Link>
          ) : (
            <p className="text-white">Welcome, {user.email}</p>
          )}
        </div>
      </div>
    </main>
  );
}
