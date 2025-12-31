'use client';

import { useMemo } from 'react';
import { Goal } from '@/lib/store';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GoalAnalyticsProps {
  goals: Goal[];
}

export default function GoalAnalytics({ goals }: GoalAnalyticsProps) {
  const analytics = useMemo(() => {
    if (!goals || goals.length === 0) {
      return {
        categoryData: [],
        progressData: [],
        stats: {
          totalTarget: 0,
          totalSaved: 0,
          totalRemaining: 0,
          completionPercent: 0,
          completedGoals: 0,
          activeGoals: 0,
        },
      };
    }

    // Calculate category-wise data
    const categoryMap: { [key: string]: { target: number; saved: number; count: number } } = {};
    goals.forEach((goal) => {
      if (!categoryMap[goal.category]) {
        categoryMap[goal.category] = { target: 0, saved: 0, count: 0 };
      }
      categoryMap[goal.category].target += goal.targetAmount;
      categoryMap[goal.category].saved += goal.currentAmount;
      categoryMap[goal.category].count += 1;
    });

    const categoryData = Object.entries(categoryMap).map(([category, data]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      target: data.target,
      saved: data.saved,
      remaining: data.target - data.saved,
    }));

    // Calculate progress data
    const progressData = goals.map((goal) => {
      const remaining = goal.targetAmount - goal.currentAmount;
      const progressPercent = (goal.currentAmount / goal.targetAmount) * 100;
      const daysRemaining = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        name: goal.name,
        target: goal.targetAmount,
        saved: goal.currentAmount,
        remaining,
        progressPercent,
        daysRemaining,
        isCompleted: goal.currentAmount >= goal.targetAmount,
      };
    });

    // Calculate statistics
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    const totalRemaining = totalTarget - totalSaved;
    const completionPercent = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
    const completedGoals = goals.filter((g) => g.currentAmount >= g.targetAmount).length;
    const activeGoals = goals.length - completedGoals;

    return {
      categoryData,
      progressData,
      stats: {
        totalTarget,
        totalSaved,
        totalRemaining,
        completionPercent,
        completedGoals,
        activeGoals,
      },
    };
  }, [goals]);

  if (!goals || goals.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">No goal data available</p>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Total Target</p>
          <p className="text-2xl font-bold text-white">₹{analytics.stats.totalTarget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Total Saved</p>
          <p className="text-2xl font-bold text-green-400">₹{analytics.stats.totalSaved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Remaining</p>
          <p className="text-2xl font-bold text-blue-400">₹{analytics.stats.totalRemaining.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Completion</p>
          <p className="text-2xl font-bold text-yellow-400">{analytics.stats.completionPercent.toFixed(1)}%</p>
        </div>
      </div>

      {/* Goal Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Active Goals</p>
          <p className="text-3xl font-bold text-blue-400">{analytics.stats.activeGoals}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Completed Goals</p>
          <p className="text-3xl font-bold text-green-400">{analytics.stats.completedGoals}</p>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-gray-300 font-semibold mb-2">Overall Progress</p>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all"
            style={{ width: `${Math.min(analytics.stats.completionPercent, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">{analytics.stats.completionPercent.toFixed(1)}% of all goals completed</p>
      </div>

      {/* Category Breakdown Chart */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Goals by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
            <Legend />
            <Bar dataKey="target" fill="#ef4444" name="Target" />
            <Bar dataKey="saved" fill="#10b981" name="Saved" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Distribution Pie Chart */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Target Distribution by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={analytics.categoryData}
              dataKey="target"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {analytics.categoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Goals Progress Table */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Goal Progress Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3 text-gray-300">Goal</th>
                <th className="text-left py-2 px-3 text-gray-300">Category</th>
                <th className="text-right py-2 px-3 text-gray-300">Target</th>
                <th className="text-right py-2 px-3 text-gray-300">Saved</th>
                <th className="text-right py-2 px-3 text-gray-300">Remaining</th>
                <th className="text-right py-2 px-3 text-gray-300">Progress</th>
              </tr>
            </thead>
            <tbody>
              {analytics.progressData.map((item) => (
                <tr key={item.name} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-2 px-3 text-white font-medium">{item.name}</td>
                  <td className="py-2 px-3 text-gray-300">{item.name.split(' ')[0]}</td>
                  <td className="text-right py-2 px-3 text-gray-300">₹{item.target.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td className="text-right py-2 px-3 text-green-400">₹{item.saved.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td className="text-right py-2 px-3 text-blue-400">₹{item.remaining.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td className="text-right py-2 px-3">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(item.progressPercent, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold">{item.progressPercent.toFixed(0)}%</span>
                    </div>
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
