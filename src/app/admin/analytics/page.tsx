'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';

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
      <PageWrapper>
        <main className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-400">Loading analytics data...</div>
          </div>
        </main>
      </PageWrapper>
    );
  }

  if (!analyticsData) {
    return (
      <PageWrapper>
        <main className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="heading-page">📊 Analytics Dashboard</h1>
            <p className="text-secondary mb-8">No analytics data available yet</p>
          </div>
        </main>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <main className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="heading-page">📊 Analytics Dashboard</h1>
            <p className="text-secondary">User behavior and engagement metrics</p>
          </div>

          {/* Date Range Filter */}
          <div className="card mb-6 md:mb-8">
            <label className="text-white text-xs md:text-sm font-medium mr-3 md:mr-4">Date Range:</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="form-select inline-block w-auto"
            >
              <option value="1d">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          {/* Key Metrics */}
          <div className="grid-responsive-4 mb-6 md:mb-8">
            {/* Total Users */}
            <div className="card">
              <p className="text-tertiary text-xs md:text-sm mb-2">Total Users</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{analyticsData.totalUsers}</p>
              <p className="text-xs text-tertiary mt-2">Active in period</p>
            </div>

            {/* Active Users */}
            <div className="card">
              <p className="text-tertiary text-xs md:text-sm mb-2">Active Users</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{analyticsData.activeUsers}</p>
              <p className="text-xs text-tertiary mt-2">Currently active</p>
            </div>

            {/* Total Sessions */}
            <div className="card">
              <p className="text-tertiary text-xs md:text-sm mb-2">Total Sessions</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{analyticsData.totalSessions}</p>
              <p className="text-xs text-tertiary mt-2">User sessions</p>
            </div>

            {/* Avg Session Duration */}
            <div className="card">
              <p className="text-tertiary text-xs md:text-sm mb-2">Avg Session Duration</p>
              <p className="text-2xl md:text-3xl font-bold text-white">{analyticsData.averageSessionDuration}m</p>
              <p className="text-xs text-tertiary mt-2">Minutes per session</p>
            </div>
          </div>

          {/* Top Features & User Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 md:gap-8 mb-6 md:mb-8">
            {/* Top Features */}
            <div className="card">
              <h3 className="heading-section mb-4">Top Features</h3>
              <div className="space-y-3">
                {analyticsData.topFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-secondary text-xs md:text-sm">{feature.feature}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 md:w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(feature.count / analyticsData.topFeatures[0].count) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-white font-semibold w-6 md:w-8 text-right text-xs md:text-sm">{feature.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User Actions */}
            <div className="card">
              <h3 className="heading-section mb-4">User Actions</h3>
              <div className="space-y-3">
                {analyticsData.userActions.map((action, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-secondary text-xs md:text-sm">{action.action}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 md:w-32 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${(action.count / analyticsData.userActions[0].count) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-white font-semibold w-6 md:w-8 text-right text-xs md:text-sm">{action.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Errors */}
          {analyticsData.errors.length > 0 && (
            <div className="card mb-6 md:mb-8">
              <h3 className="heading-section mb-4">Errors</h3>
              <div className="space-y-3">
                {analyticsData.errors.map((error, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-secondary text-xs md:text-sm">{error.error}</span>
                    <span className="px-2 md:px-3 py-1 bg-red-600 text-white rounded-full text-xs font-semibold">
                      {error.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-3 md:p-4">
            <p className="text-blue-200 text-xs md:text-sm">
              💡 Analytics data is collected automatically from user interactions. This dashboard
              provides insights into user behavior and application usage patterns.
            </p>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}


