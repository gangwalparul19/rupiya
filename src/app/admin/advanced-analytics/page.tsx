'use client';

import { useState, useEffect } from 'react';
import PageWrapper from '@/components/PageWrapper';
import {
  getAllCohorts,
  getAllSegments,
  getEventDistribution,
  getTopUsersByActivity,
} from '@/lib/advancedAnalytics';

interface CohortData {
  cohortId: string;
  startDate: string;
  size: number;
  retentionRate: number;
}

interface SegmentData {
  segmentId: string;
  segmentName: string;
  size: number;
}

export default function AdvancedAnalyticsPage() {
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [segments, setSegments] = useState<SegmentData[]>([]);
  const [eventDistribution, setEventDistribution] = useState<Record<string, number>>({});
  const [topUsers, setTopUsers] = useState<Array<{ userId: string; eventCount: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'cohorts' | 'segments' | 'events' | 'users'>(
    'cohorts'
  );

  useEffect(() => {
    loadAdvancedAnalytics();
  }, []);

  const loadAdvancedAnalytics = () => {
    try {
      setIsLoading(true);

      // Load cohorts
      const cohortsData = getAllCohorts().map((c) => ({
        cohortId: c.cohortId,
        startDate: c.startDate.toISOString().split('T')[0],
        size: c.size,
        retentionRate: c.retentionRate,
      }));
      setCohorts(cohortsData);

      // Load segments
      const segmentsData = getAllSegments().map((s) => ({
        segmentId: s.segmentId,
        segmentName: s.segmentName,
        size: s.size,
      }));
      setSegments(segmentsData);

      // Load event distribution
      const events = getEventDistribution();
      setEventDistribution(events);

      // Load top users
      const users = getTopUsersByActivity(10);
      setTopUsers(users);

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load advanced analytics:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <main className="min-h-screen bg-slate-900 p-4 md:p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">Loading advanced analytics...</div>
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
            <h1 className="text-3xl font-bold text-white mb-2">Advanced Analytics</h1>
            <p className="text-slate-400">Cohort analysis, segmentation, and funnel tracking</p>
          </div>

          {/* Tabs */}
          <div className="bg-slate-800 rounded-lg p-4 mb-8 border border-slate-700 flex flex-wrap gap-2">
            {(['cohorts', 'segments', 'events', 'users'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg transition font-medium text-sm ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Cohorts Tab */}
          {activeTab === 'cohorts' && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Cohort Analysis</h2>
              {cohorts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                          Cohort ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                          Start Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                          Size
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                          Retention Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cohorts.map((cohort) => (
                        <tr key={cohort.cohortId} className="border-b border-slate-700 hover:bg-slate-700 transition">
                          <td className="px-4 py-3 text-sm text-slate-200">{cohort.cohortId}</td>
                          <td className="px-4 py-3 text-sm text-slate-200">{cohort.startDate}</td>
                          <td className="px-4 py-3 text-sm text-slate-200">{cohort.size}</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                cohort.retentionRate > 50
                                  ? 'bg-green-600 text-white'
                                  : 'bg-yellow-600 text-white'
                              }`}
                            >
                              {cohort.retentionRate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-400">No cohorts available</p>
              )}
            </div>
          )}

          {/* Segments Tab */}
          {activeTab === 'segments' && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">User Segments</h2>
              {segments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {segments.map((segment) => (
                    <div
                      key={segment.segmentId}
                      className="bg-slate-700 rounded-lg p-4 border border-slate-600"
                    >
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {segment.segmentName}
                      </h3>
                      <p className="text-slate-400 text-sm mb-3">ID: {segment.segmentId}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">Users:</span>
                        <span className="text-white font-bold text-lg">{segment.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No segments available</p>
              )}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Event Distribution</h2>
              {Object.keys(eventDistribution).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(eventDistribution)
                    .sort((a, b) => b[1] - a[1])
                    .map(([event, count]) => (
                      <div key={event} className="flex items-center justify-between">
                        <span className="text-slate-300">{event}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{
                                width: `${
                                  (count /
                                    Math.max(
                                      ...Object.values(eventDistribution)
                                    )) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-white font-semibold w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-slate-400">No events available</p>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-4">Top Users by Activity</h2>
              {topUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                          User ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                          Event Count
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">
                          Activity Level
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topUsers.map((user) => (
                        <tr key={user.userId} className="border-b border-slate-700 hover:bg-slate-700 transition">
                          <td className="px-4 py-3 text-sm text-slate-200">{user.userId}</td>
                          <td className="px-4 py-3 text-sm text-slate-200">{user.eventCount}</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                user.eventCount > 50
                                  ? 'bg-red-600 text-white'
                                  : user.eventCount > 20
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-green-600 text-white'
                              }`}
                            >
                              {user.eventCount > 50 ? 'Very High' : user.eventCount > 20 ? 'High' : 'Medium'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-400">No users available</p>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4 mt-8">
            <p className="text-blue-200 text-sm">
              💡 Advanced analytics provides insights into user cohorts, segments, and behavior patterns.
              Use this data to optimize features and improve user engagement.
            </p>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}


