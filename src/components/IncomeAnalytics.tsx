'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import type { Income } from '@/lib/store';

interface IncomeAnalyticsProps {
  income: Income[];
}

export default function IncomeAnalytics({ income }: IncomeAnalyticsProps) {
  const analytics = useMemo(() => {
    if (income.length === 0) {
      return {
        totalIncome: 0,
        averageIncome: 0,
        highestIncome: 0,
        lowestIncome: 0,
        sourceBreakdown: [],
        monthlyTrend: [],
        topSources: [],
      };
    }

    // Basic stats
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const averageIncome = totalIncome / income.length;
    const amounts = income.map((i) => i.amount);
    const highestIncome = Math.max(...amounts);
    const lowestIncome = Math.min(...amounts);

    // Source breakdown
    const sourceBreakdown: { [key: string]: number } = {};
    income.forEach((inc) => {
      const source = inc.source || 'Other';
      sourceBreakdown[source] = (sourceBreakdown[source] || 0) + inc.amount;
    });

    // Monthly trend
    const monthlyData: { [key: string]: number } = {};
    income.forEach((inc) => {
      const month = new Date(inc.date).toISOString().slice(0, 7);
      monthlyData[month] = (monthlyData[month] || 0) + inc.amount;
    });

    const monthlyTrend = Object.entries(monthlyData)
      .sort()
      .map(([month, amount]) => ({
        month: new Date(month + '-01').toLocaleDateString('en-IN', {
          month: 'short',
          year: '2-digit',
        }),
        amount,
      }));

    // Top sources
    const topSources = Object.entries(sourceBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));

    return {
      totalIncome,
      averageIncome,
      highestIncome,
      lowestIncome,
      sourceBreakdown: Object.entries(sourceBreakdown).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      })),
      monthlyTrend,
      topSources,
    };
  }, [income]);

  const colors = ['#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-slate-800 p-4 md:p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-xs md:text-sm mb-2">Total Income</p>
          <p className="text-2xl md:text-3xl font-bold text-green-400">
            ₹{analytics.totalIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="bg-slate-800 p-4 md:p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-xs md:text-sm mb-2">Average Income</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-400">
            ₹{analytics.averageIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="bg-slate-800 p-4 md:p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-xs md:text-sm mb-2">Highest Income</p>
          <p className="text-2xl md:text-3xl font-bold text-cyan-400">
            ₹{analytics.highestIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="bg-slate-800 p-4 md:p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-xs md:text-sm mb-2">Lowest Income</p>
          <p className="text-2xl md:text-3xl font-bold text-purple-400">
            ₹{analytics.lowestIncome.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Source Breakdown */}
        <div className="bg-slate-800 rounded-lg p-4 md:p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Income Sources</h3>
          {analytics.sourceBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics.sourceBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ₹${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {colors.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">
              No data available
            </div>
          )}
        </div>

        {/* Top Sources */}
        <div className="bg-slate-800 rounded-lg p-4 md:p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Top Income Sources</h3>
          {analytics.topSources.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.topSources}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  formatter={(value) => `₹${value}`}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                />
                <Bar dataKey="value" fill="#22c55e" name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trend */}
      {analytics.monthlyTrend.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-4 md:p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Monthly Income Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                formatter={(value) => `₹${value}`}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e', r: 4 }}
                activeDot={{ r: 6 }}
                name="Income"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Income Entries */}
      {analytics.topSources.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-4 md:p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Income Breakdown</h3>
          <div className="space-y-3">
            {analytics.topSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">
                    {source.name === 'Salary'
                      ? '💼'
                      : source.name === 'Freelance'
                      ? '🎨'
                      : source.name === 'Investment'
                      ? '📈'
                      : source.name === 'Gift'
                      ? '🎁'
                      : source.name === 'Bonus'
                      ? '🏆'
                      : '📌'}
                  </span>
                  <span className="text-white font-medium">{source.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">
                    ₹{source.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-slate-400">
                    {((source.value / analytics.totalIncome) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
