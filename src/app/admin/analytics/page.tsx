'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  averageSessionDuration: number;
  topFeatures: Array<{ feature: string; count: number }>;
  userActions: Array<{ action: string; count: number }>;
  errors: Array<{ error: string; count: number }>;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would fetch from Firebase Analytics
      // For now, we'll show a placeholder
      setAnalyticsData({
        totalUsers: 1,
        activeUsers: 1,
        totalSessions: 5,
        averageSessionDuration: 12.5,
        topFeatures: [
          { feature: 'Expense Tracking', count: 45 },
          { feature: 'Dashboard', count: 38 },
          { feature: 'Analytics', count: 28 },
          { feature: 'Budget Management', count: 22 },
          { feature: 'Investment Tracking', count: 18 },
        ],
        userActions: [
          { action: 'Add Expense', count: 42 },
          { action: 'View Dashboard', count: 38 },
          { action: 'Search', count: 25 },
          { action: 'Export Data', count: 12 },
          { action: 'Edit Entry', count: 18 },
        ],
        errors: [
          { error: 'Network Error', count: 2 },
          { error: 'Validation Error', count: 1 },
        ],
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-slate-900 p-4 md:p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">Loading analytics data...</div>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  if (!analyticsData) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-slate-900 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-slate-400 mb-8">No analytics data available yet</p>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-900 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-slate-400">User behavior and engagement metrics</p>
          </div>

          {/* Date Range Filter */}
          <div className="bg-slate-800 rounded-lg p-4 mb-8 border border-slate-700">
            <label className="text-white text-sm font-medium mr-4">Date Range:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Users */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <p className="text-slate-400 text-sm mb-2">Total Users</p>
              <p className="text-3xl font-bold text-white">{analyticsData.totalUsers}</p>
              <p className="text-xs text-slate-500 mt-2">Active in period</p>
            </div>

            {/* Active Users */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <p className="text-slate-400 text-sm mb-2">Active Users</p>
              <p className="text-3xl font-bold text-white">{analyticsData.activeUsers}</p>
              <p className="text-xs text-slate-500 mt-2">Currently active</p>
            </div>

            {/* Total Sessions */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <p className="text-slate-400 text-sm mb-2">Total Sessions</p>
              <p className="text-3xl font-bold text-white">{analyticsData.totalSessions}</p>
              <p className="text-xs text-slate-500 mt-2">User sessions</p>
            </div>

            {/* Avg Session Duration */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <p className="text-slate-400 text-sm mb-2">Avg Session Duration</p>
              <p className="text-3xl font-bold text-white">{analyticsData.averageSessionDuration}m</p>
              <p className="text-xs text-slate-500 mt-2">Minutes per session</p>
            </div>
          </div>

          {/* Top Features & User Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Features */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Top Features</h3>
              <div className="space-y-3">
                {analyticsData.topFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-slate-300">{feature.feature}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(feature.count / analyticsData.topFeatures[0].count) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-white font-semibold w-8 text-right">{feature.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Actions */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">User Actions</h3>
              <div className="space-y-3">
                {analyticsData.userActions.map((action, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-slate-300">{action.action}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${(action.count / analyticsData.userActions[0].count) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-white font-semibold w-8 text-right">{action.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Errors */}
          {analyticsData.errors.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Errors</h3>
              <div className="space-y-3">
                {analyticsData.errors.map((error, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-slate-300">{error.error}</span>
                    <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-semibold">
                      {error.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4">
            <p className="text-blue-200 text-sm">
              💡 Analytics data is collected automatically from user interactions. This dashboard
              provides insights into user behavior and application usage patterns.
            </p>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
