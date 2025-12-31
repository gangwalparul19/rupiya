'use client';

import { useMemo } from 'react';
import { Investment } from '@/lib/store';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InvestmentAnalyticsProps {
  investments: Investment[];
}

export default function InvestmentAnalytics({ investments }: InvestmentAnalyticsProps) {
  const analytics = useMemo(() => {
    if (!investments || investments.length === 0) {
      return {
        typeData: [],
        performanceData: [],
        gainLossData: [],
        stats: {
          totalInvested: 0,
          totalCurrentValue: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          bestPerformer: null,
          worstPerformer: null,
        },
      };
    }

    // Calculate type-wise distribution
    const typeMap: { [key: string]: { invested: number; current: number; count: number } } = {};
    investments.forEach((inv) => {
      if (!typeMap[inv.type]) {
        typeMap[inv.type] = { invested: 0, current: 0, count: 0 };
      }
      typeMap[inv.type].invested += inv.initialAmount;
      typeMap[inv.type].current += inv.currentValue;
      typeMap[inv.type].count += 1;
    });

    const typeData = Object.entries(typeMap).map(([type, data]) => ({
      name: type.replace('_', ' ').toUpperCase(),
      value: data.current,
      invested: data.invested,
    }));

    // Calculate performance data
    const performanceData = investments.map((inv) => {
      const gainLoss = inv.currentValue - inv.initialAmount;
      const gainLossPercent = (gainLoss / inv.initialAmount) * 100;
      return {
        name: inv.name,
        invested: inv.initialAmount,
        current: inv.currentValue,
        gainLoss,
        gainLossPercent,
      };
    });

    // Sort by gain/loss for chart
    const gainLossData = performanceData
      .sort((a, b) => b.gainLossPercent - a.gainLossPercent)
      .slice(0, 10);

    // Calculate statistics
    const totalInvested = investments.reduce((sum, inv) => sum + inv.initialAmount, 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalGainLoss = totalCurrentValue - totalInvested;
    const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    // Find best and worst performers
    const bestPerformer = performanceData.reduce((best, current) =>
      current.gainLossPercent > (best?.gainLossPercent || -Infinity) ? current : best
    );
    const worstPerformer = performanceData.reduce((worst, current) =>
      current.gainLossPercent < (worst?.gainLossPercent || Infinity) ? current : worst
    );

    return {
      typeData,
      performanceData,
      gainLossData,
      stats: {
        totalInvested,
        totalCurrentValue,
        totalGainLoss,
        totalGainLossPercent,
        bestPerformer,
        worstPerformer,
      },
    };
  }, [investments]);

  if (!investments || investments.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">No investment data available</p>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Total Invested</p>
          <p className="text-2xl font-bold text-white">₹{analytics.stats.totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Current Value</p>
          <p className="text-2xl font-bold text-blue-400">₹{analytics.stats.totalCurrentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Gain/Loss</p>
          <p className={`text-2xl font-bold ${analytics.stats.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ₹{analytics.stats.totalGainLoss.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Return %</p>
          <p className={`text-2xl font-bold ${analytics.stats.totalGainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {analytics.stats.totalGainLossPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Portfolio Allocation Pie Chart */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Portfolio Allocation by Type</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={analytics.typeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {analytics.typeData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Investment Performance Chart */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Investment Performance (Top 10)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.gainLossData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
            <Bar dataKey="gainLossPercent" fill="#3b82f6" name="Return %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Invested vs Current Value Chart */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Invested vs Current Value</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.performanceData.slice(0, 10)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={100} />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
            <Legend />
            <Bar dataKey="invested" fill="#ef4444" name="Invested" />
            <Bar dataKey="current" fill="#10b981" name="Current Value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Best and Worst Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analytics.stats.bestPerformer && (
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Best Performer</p>
            <p className="text-lg font-semibold text-white mb-1">{analytics.stats.bestPerformer.name}</p>
            <p className="text-green-400 font-bold">{analytics.stats.bestPerformer.gainLossPercent.toFixed(2)}% return</p>
            <p className="text-gray-400 text-sm mt-2">
              ₹{analytics.stats.bestPerformer.invested.toLocaleString('en-IN', { maximumFractionDigits: 0 })} → ₹{analytics.stats.bestPerformer.current.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </div>
        )}
        {analytics.stats.worstPerformer && (
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Worst Performer</p>
            <p className="text-lg font-semibold text-white mb-1">{analytics.stats.worstPerformer.name}</p>
            <p className={`font-bold ${analytics.stats.worstPerformer.gainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {analytics.stats.worstPerformer.gainLossPercent.toFixed(2)}% return
            </p>
            <p className="text-gray-400 text-sm mt-2">
              ₹{analytics.stats.worstPerformer.invested.toLocaleString('en-IN', { maximumFractionDigits: 0 })} → ₹{analytics.stats.worstPerformer.current.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </div>
        )}
      </div>

      {/* Detailed Investment Table */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">All Investments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3 text-gray-300">Name</th>
                <th className="text-left py-2 px-3 text-gray-300">Type</th>
                <th className="text-right py-2 px-3 text-gray-300">Invested</th>
                <th className="text-right py-2 px-3 text-gray-300">Current</th>
                <th className="text-right py-2 px-3 text-gray-300">Gain/Loss</th>
                <th className="text-right py-2 px-3 text-gray-300">Return %</th>
              </tr>
            </thead>
            <tbody>
              {analytics.performanceData.map((item) => (
                <tr key={item.name} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-2 px-3 text-white">{item.name}</td>
                  <td className="py-2 px-3 text-gray-300">{item.name.split(' ')[0]}</td>
                  <td className="text-right py-2 px-3 text-gray-300">₹{item.invested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td className="text-right py-2 px-3 text-blue-400">₹{item.current.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td className={`text-right py-2 px-3 ${item.gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ₹{item.gainLoss.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </td>
                  <td className={`text-right py-2 px-3 font-semibold ${item.gainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.gainLossPercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
