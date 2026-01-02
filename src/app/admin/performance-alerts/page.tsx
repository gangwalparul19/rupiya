'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';
import {
  getActiveAlerts,
  getAlertStatistics,
  getOptimizationRecommendations,
  getPerformanceBudgetStatus,
  resolveAlert,
} from '@/lib/performanceAlerts';
import { useToast } from '@/lib/toastContext';

interface AlertData {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  metric: string;
  currentValue: number;
  threshold: number;
  recommendation: string;
  timestamp: number;
}

export default function PerformanceAlertsPage() {
  const { showToast } = useToast();
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [budgetStatus, setBudgetStatus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'warning' | 'info'>(
    'all'
  );

  useEffect(() => {
    loadAlertData();
    const interval = setInterval(loadAlertData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAlertData = () => {
    try {
      const activeAlerts = getActiveAlerts();
      setAlerts(activeAlerts);

      const stats = getAlertStatistics();
      setStatistics(stats);

      const recs = getOptimizationRecommendations();
      setRecommendations(recs);

      // Mock budget status
      const budgetData = getPerformanceBudgetStatus({
        pageLoadTime: 2500,
        domContentLoaded: 1800,
        apiResponseTime: 800,
        bundleSize: 450 * 1024,
      });
      setBudgetStatus(budgetData);

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load alert data:', error);
      setIsLoading(false);
    }
  };

  const handleResolveAlert = (alertId: string) => {
    if (resolveAlert(alertId)) {
      setAlerts(alerts.filter((a) => a.id !== alertId));
      showToast('Alert resolved', 'success');
    }
  };

  const filteredAlerts =
    filterSeverity === 'all' ? alerts : alerts.filter((a) => a.severity === filterSeverity);

  if (isLoading) {
    return (
      <PageWrapper>
        <main className="min-h-screen bg-slate-900 p-4 md:p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">Loading performance alerts...</div>
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
            <h1 className="text-3xl font-bold text-white mb-2">Performance Alerts</h1>
            <p className="text-slate-400">Monitor and optimize application performance</p>
          </div>

          {/* Alert Statistics */}
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {/* Total Alerts */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Total Alerts</p>
                <p className="text-3xl font-bold text-white">{statistics.totalAlerts}</p>
              </div>

              {/* Active Alerts */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Active Alerts</p>
                <p className="text-3xl font-bold text-red-400">{statistics.activeAlerts}</p>
              </div>

              {/* Critical */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Critical</p>
                <p className="text-3xl font-bold text-red-500">{statistics.criticalAlerts}</p>
              </div>

              {/* Warnings */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Warnings</p>
                <p className="text-3xl font-bold text-yellow-500">{statistics.warningAlerts}</p>
              </div>

              {/* Info */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">Info</p>
                <p className="text-3xl font-bold text-blue-400">{statistics.infoAlerts}</p>
              </div>
            </div>
          )}

          {/* Performance Budget Status */}
          {budgetStatus.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Performance Budget Status</h2>
              <div className="space-y-4">
                {budgetStatus.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">{item.budget.description}</span>
                      <span
                        className={`text-sm font-semibold ${
                          item.status === 'ok'
                            ? 'text-green-400'
                            : item.status === 'warning'
                              ? 'text-yellow-400'
                              : 'text-red-400'
                        }`}
                      >
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.status === 'ok'
                            ? 'bg-green-500'
                            : item.status === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(item.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Filter */}
          <div className="bg-slate-800 rounded-lg p-4 mb-8 border border-slate-700">
            <label className="text-white text-sm font-medium mr-4">Filter by Severity:</label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as any)}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          {/* Alerts List */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Active Alerts</h2>
            {filteredAlerts.length > 0 ? (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      alert.severity === 'critical'
                        ? 'bg-red-900 bg-opacity-20 border-red-600'
                        : alert.severity === 'warning'
                          ? 'bg-yellow-900 bg-opacity-20 border-yellow-600'
                          : 'bg-blue-900 bg-opacity-20 border-blue-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{alert.title}</h3>
                        <p className="text-slate-300 text-sm mt-1">{alert.message}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          alert.severity === 'critical'
                            ? 'bg-red-600 text-white'
                            : alert.severity === 'warning'
                              ? 'bg-yellow-600 text-white'
                              : 'bg-blue-600 text-white'
                        }`}
                      >
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-3 text-sm">
                      <div>
                        <p className="text-slate-400">Current Value</p>
                        <p className="text-white font-semibold">{alert.currentValue.toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Threshold</p>
                        <p className="text-white font-semibold">{alert.threshold.toFixed(0)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Metric</p>
                        <p className="text-white font-semibold">{alert.metric}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Time</p>
                        <p className="text-white font-semibold">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-700 bg-opacity-50 rounded p-3 mb-3">
                      <p className="text-slate-300 text-sm">
                        <strong>Recommendation:</strong> {alert.recommendation}
                      </p>
                    </div>

                    <button
                      onClick={() => handleResolveAlert(alert.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm font-medium"
                    >
                      Resolve Alert
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">No alerts for the selected severity level</p>
            )}
          </div>

          {/* Optimization Recommendations */}
          {recommendations.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Optimization Recommendations</h2>
              <ul className="space-y-2">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span className="text-slate-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4 mt-8">
            <p className="text-blue-200 text-sm">
              💡 Performance alerts help identify optimization opportunities. Review recommendations
              and implement improvements to enhance application performance.
            </p>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}


