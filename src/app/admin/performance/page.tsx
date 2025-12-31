'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';
import {
  getPerformanceSummary,
  clearMetrics,
  exportMetricsAsJson,
  exportMetricsAsCsv,
} from '@/lib/performance';
import { useToast } from '@/lib/toastContext';

interface PerformanceSummary {
  pageLoadMetrics: any;
  totalMetrics: number;
  totalApiCalls: number;
  averagePageLoadTime: number;
  averageDomContentLoaded: number;
  averageApiResponseTime: number;
  slowestApiCalls: any[];
  sessionDuration: number;
}

export default function PerformancePage() {
  const { showToast } = useToast();
  const [summary, setSummary] = useState<PerformanceSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadPerformanceData();

    if (autoRefresh) {
      const interval = setInterval(loadPerformanceData, 5000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [autoRefresh]);

  const loadPerformanceData = () => {
    try {
      const data = getPerformanceSummary();
      setSummary(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load performance data:', error);
      setIsLoading(false);
    }
  };

  const handleClearMetrics = () => {
    if (confirm('Are you sure you want to clear all metrics?')) {
      clearMetrics();
      setSummary(null);
      showToast('Metrics cleared', 'success');
    }
  };

  const handleExportJson = () => {
    try {
      const json = exportMetricsAsJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-metrics-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Metrics exported as JSON', 'success');
    } catch (error) {
      showToast('Failed to export metrics', 'error');
    }
  };

  const handleExportCsv = () => {
    try {
      const csv = exportMetricsAsCsv();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-metrics-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Metrics exported as CSV', 'success');
    } catch (error) {
      showToast('Failed to export metrics', 'error');
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <main className="min-h-screen bg-slate-900 p-4 md:p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">Loading performance data...</div>
          </div>
        </main>
      </PageWrapper>
    );
  }

  if (!summary) {
    return (
      <PageWrapper>
        <main className="min-h-screen bg-slate-900 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">Performance Monitoring</h1>
            <p className="text-slate-400 mb-8">No performance data available yet</p>
          </div>
        </main>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <main className="min-h-screen bg-slate-900 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Performance Monitoring</h1>
            <p className="text-slate-400">Real-time application performance metrics</p>
          </div>

          {/* Controls */}
          <div className="bg-slate-800 rounded-lg p-4 mb-8 border border-slate-700 flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4"
              />
              <span>Auto-refresh (5s)</span>
            </label>
            <button
              onClick={loadPerformanceData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
            >
              Refresh Now
            </button>
            <button
              onClick={handleExportJson}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm font-medium"
            >
              Export JSON
            </button>
            <button
              onClick={handleExportCsv}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm font-medium"
            >
              Export CSV
            </button>
            <button
              onClick={handleClearMetrics}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-medium"
            >
              Clear Metrics
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Page Load Time */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <p className="text-slate-400 text-sm mb-2">Average Page Load Time</p>
              <p className="text-3xl font-bold text-white mb-1">
                {summary.averagePageLoadTime.toFixed(0)}ms
              </p>
              <p className="text-xs text-slate-500">
                {summary.averagePageLoadTime > 3000 ? '🔴 Slow' : '🟢 Good'}
              </p>
            </div>

            {/* DOM Content Loaded */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <p className="text-slate-400 text-sm mb-2">DOM Content Loaded</p>
              <p className="text-3xl font-bold text-white mb-1">
                {summary.averageDomContentLoaded.toFixed(0)}ms
              </p>
              <p className="text-xs text-slate-500">
                {summary.averageDomContentLoaded > 2000 ? '🔴 Slow' : '🟢 Good'}
              </p>
            </div>

            {/* API Response Time */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <p className="text-slate-400 text-sm mb-2">Average API Response Time</p>
              <p className="text-3xl font-bold text-white mb-1">
                {summary.averageApiResponseTime.toFixed(0)}ms
              </p>
              <p className="text-xs text-slate-500">
                {summary.averageApiResponseTime > 1000 ? '🔴 Slow' : '🟢 Good'}
              </p>
            </div>

            {/* Session Duration */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <p className="text-slate-400 text-sm mb-2">Session Duration</p>
              <p className="text-3xl font-bold text-white mb-1">
                {(summary.sessionDuration / 1000 / 60).toFixed(1)}m
              </p>
              <p className="text-xs text-slate-500">
                {Math.floor(summary.sessionDuration / 1000)}s
              </p>
            </div>
          </div>

          {/* Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Total Metrics */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Metrics Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Metrics Recorded</span>
                  <span className="text-white font-semibold">{summary.totalMetrics}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total API Calls</span>
                  <span className="text-white font-semibold">{summary.totalApiCalls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Average Calls per Minute</span>
                  <span className="text-white font-semibold">
                    {(summary.totalApiCalls / (summary.sessionDuration / 1000 / 60)).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Page Load Metrics */}
            {summary.pageLoadMetrics && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Page Load Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">DOM Content Loaded</span>
                    <span className="text-white font-semibold">
                      {summary.pageLoadMetrics.domContentLoaded}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Page Load Time</span>
                    <span className="text-white font-semibold">
                      {summary.pageLoadMetrics.pageLoadTime}ms
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Slowest API Calls */}
          {summary.slowestApiCalls.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4">Slowest API Calls</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                        Endpoint
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                        Method
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.slowestApiCalls.map((call, idx) => (
                      <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700 transition">
                        <td className="px-4 py-3 text-sm text-slate-200">{call.endpoint}</td>
                        <td className="px-4 py-3 text-sm text-slate-200">{call.method}</td>
                        <td className="px-4 py-3 text-sm text-slate-200">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              call.duration > 2000
                                ? 'bg-red-600 text-white'
                                : call.duration > 1000
                                  ? 'bg-yellow-600 text-white'
                                  : 'bg-green-600 text-white'
                            }`}
                          >
                            {call.duration}ms
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-200">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              call.status >= 400
                                ? 'bg-red-600 text-white'
                                : 'bg-green-600 text-white'
                            }`}
                          >
                            {call.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4 mt-8">
            <p className="text-blue-200 text-sm">
              💡 Performance metrics are collected automatically. Use the export buttons to download
              detailed reports for analysis.
            </p>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}


