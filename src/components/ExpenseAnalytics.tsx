'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
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

interface ExpenseAnalyticsProps {
  expenses: any[];
}

export default function ExpenseAnalytics({ expenses }: ExpenseAnalyticsProps) {
  const categories = useAppStore((state) => state.categories);

  const analytics = useMemo(() => {
    if (expenses.length === 0) {
      return {
        totalExpenses: 0,
        averageExpense: 0,
        highestExpense: 0,
        lowestExpense: 0,
        categoryBreakdown: [],
        paymentMethodBreakdown: [],
        monthlyTrend: [],
        topCategories: [],
      };
    }

    // Basic stats
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const averageExpense = totalExpenses / expenses.length;
    const amounts = expenses.map((e) => e.amount);
    const highestExpense = Math.max(...amounts);
    const lowestExpense = Math.min(...amounts);

    // Category breakdown
    const categoryBreakdown: { [key: string]: number } = {};
    expenses.forEach((exp) => {
      const cat = exp.category || 'Other';
      categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + exp.amount;
    });

    // Payment method breakdown
    const paymentMethodBreakdown: { [key: string]: number } = {};
    expenses.forEach((exp) => {
      const method = exp.paymentMethod || 'Other';
      paymentMethodBreakdown[method] = (paymentMethodBreakdown[method] || 0) + exp.amount;
    });

    // Monthly trend
    const monthlyData: { [key: string]: number } = {};
    expenses.forEach((exp) => {
      const month = new Date(exp.date).toISOString().slice(0, 7);
      monthlyData[month] = (monthlyData[month] || 0) + exp.amount;
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

    // Top categories
    const topCategories = Object.entries(categoryBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({
        name,
        value,
      }));

    return {
      totalExpenses,
      averageExpense,
      highestExpense,
      lowestExpense,
      categoryBreakdown: Object.entries(categoryBreakdown).map(([name, value]) => ({
        name,
        value,
      })),
      paymentMethodBreakdown: Object.entries(paymentMethodBreakdown).map(([name, value]) => ({
        name,
        value,
      })),
      monthlyTrend,
      topCategories,
    };
  }, [expenses]);

  const getCategoryEmoji = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.emoji || '📌';
  };

  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-slate-800 p-4 md:p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-xs md:text-sm mb-2">Total Expenses</p>
          <p className="text-2xl md:text-3xl font-bold text-red-400">
            ₹{analytics.totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="bg-slate-800 p-4 md:p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-xs md:text-sm mb-2">Average Expense</p>
          <p className="text-2xl md:text-3xl font-bold text-blue-400">
            ₹{analytics.averageExpense.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="bg-slate-800 p-4 md:p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-xs md:text-sm mb-2">Highest Expense</p>
          <p className="text-2xl md:text-3xl font-bold text-orange-400">
            ₹{analytics.highestExpense.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="bg-slate-800 p-4 md:p-6 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-xs md:text-sm mb-2">Lowest Expense</p>
          <p className="text-2xl md:text-3xl font-bold text-green-400">
            ₹{analytics.lowestExpense.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Category Breakdown */}
        <div className="bg-slate-800 rounded-lg p-4 md:p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Category Breakdown</h3>
          {analytics.categoryBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analytics.categoryBreakdown}
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

        {/* Payment Method Breakdown */}
        <div className="bg-slate-800 rounded-lg p-4 md:p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Payment Method</h3>
          {analytics.paymentMethodBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.paymentMethodBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  formatter={(value) => `₹${value}`}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                />
                <Bar dataKey="value" fill="#3b82f6" name="Amount" />
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
          <h3 className="text-lg font-bold text-white mb-4">Monthly Trend</h3>
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
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 4 }}
                activeDot={{ r: 6 }}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Categories */}
      {analytics.topCategories.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-4 md:p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Top Categories</h3>
          <div className="space-y-3">
            {analytics.topCategories.map((cat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{getCategoryEmoji(cat.name)}</span>
                  <span className="text-white font-medium">{cat.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">
                    ₹{cat.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-slate-400">
                    {((cat.value / analytics.totalExpenses) * 100).toFixed(1)}%
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
