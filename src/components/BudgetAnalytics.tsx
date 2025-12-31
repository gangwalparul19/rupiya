'use client';

import { useMemo } from 'react';
import { Budget, Expense } from '@/lib/store';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface BudgetAnalyticsProps {
  budgets: Budget[];
  expenses: Expense[];
}

export default function BudgetAnalytics({ budgets, expenses }: BudgetAnalyticsProps) {
  const analytics = useMemo(() => {
    if (!budgets || budgets.length === 0) {
      return {
        currentBudget: null,
        categoryData: [],
        budgetVsActual: [],
        budgetTrend: [],
        stats: {
          totalBudget: 0,
          totalSpent: 0,
          remaining: 0,
          percentageUsed: 0,
        },
      };
    }

    // Get current month budget
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentBudget = budgets.find((b) => b.month === currentMonth) || budgets[budgets.length - 1];

    if (!currentBudget) {
      return {
        currentBudget: null,
        categoryData: [],
        budgetVsActual: [],
        budgetTrend: [],
        stats: {
          totalBudget: 0,
          totalSpent: 0,
          remaining: 0,
          percentageUsed: 0,
        },
      };
    }

    // Calculate category-wise spending
    const categorySpending: { [key: string]: number } = {
      food: 0,
      transport: 0,
      utilities: 0,
      entertainment: 0,
      shopping: 0,
      health: 0,
      other: 0,
    };

    const budgetMonth = currentBudget.month;
    expenses.forEach((expense) => {
      const expenseMonth = new Date(expense.date).toISOString().slice(0, 7);
      if (expenseMonth === budgetMonth) {
        const category = expense.category.toLowerCase();
        if (category in categorySpending) {
          categorySpending[category] += expense.amount;
        } else {
          categorySpending.other += expense.amount;
        }
      }
    });

    // Prepare category data for charts
    const categoryData = Object.entries(currentBudget.categories)
      .filter(([_, budget]) => budget !== undefined)
      .map(([category, budget]) => ({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        budget: budget || 0,
        spent: categorySpending[category] || 0,
        remaining: (budget || 0) - (categorySpending[category] || 0),
      }));

    // Budget vs Actual data
    const budgetVsActual = categoryData.map((item) => ({
      category: item.name,
      Budget: item.budget,
      Spent: item.spent,
    }));

    // Budget trend (last 6 months)
    const budgetTrend = budgets.slice(-6).map((budget) => {
      const month = new Date(budget.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const monthExpenses = expenses.filter((e) => new Date(e.date).toISOString().slice(0, 7) === budget.month);
      const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
      return {
        month,
        Budget: budget.totalBudget,
        Spent: totalSpent,
      };
    });

    // Calculate statistics
    const totalBudget = currentBudget.totalBudget;
    const totalSpent = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);
    const remaining = totalBudget - totalSpent;
    const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      currentBudget,
      categoryData,
      budgetVsActual,
      budgetTrend,
      stats: {
        totalBudget,
        totalSpent,
        remaining,
        percentageUsed,
      },
    };
  }, [budgets, expenses]);

  if (!analytics.currentBudget) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">No budget data available</p>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Total Budget</p>
          <p className="text-2xl font-bold text-white">₹{analytics.stats.totalBudget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-red-400">₹{analytics.stats.totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Remaining</p>
          <p className={`text-2xl font-bold ${analytics.stats.remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ₹{analytics.stats.remaining.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-1">Used</p>
          <p className="text-2xl font-bold text-blue-400">{analytics.stats.percentageUsed.toFixed(1)}%</p>
        </div>
      </div>

      {/* Budget Progress Bar */}
      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-gray-300 font-semibold mb-2">Budget Usage</p>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all ${
              analytics.stats.percentageUsed > 100 ? 'bg-red-500' : analytics.stats.percentageUsed > 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(analytics.stats.percentageUsed, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">{analytics.stats.percentageUsed.toFixed(1)}% of budget used</p>
      </div>

      {/* Budget vs Actual Chart */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Budget vs Actual Spending</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.budgetVsActual}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="category" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
            <Legend />
            <Bar dataKey="Budget" fill="#3b82f6" />
            <Bar dataKey="Spent" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown Pie Chart */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Spending by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={analytics.categoryData}
              dataKey="spent"
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

      {/* Budget Trend Chart */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Budget Trend (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.budgetTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
            <Legend />
            <Line type="monotone" dataKey="Budget" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="Spent" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Details Table */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Category Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-3 text-gray-300">Category</th>
                <th className="text-right py-2 px-3 text-gray-300">Budget</th>
                <th className="text-right py-2 px-3 text-gray-300">Spent</th>
                <th className="text-right py-2 px-3 text-gray-300">Remaining</th>
                <th className="text-right py-2 px-3 text-gray-300">Used %</th>
              </tr>
            </thead>
            <tbody>
              {analytics.categoryData.map((item) => (
                <tr key={item.name} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="py-2 px-3 text-white">{item.name}</td>
                  <td className="text-right py-2 px-3 text-gray-300">₹{item.budget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td className="text-right py-2 px-3 text-red-400">₹{item.spent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  <td className={`text-right py-2 px-3 ${item.remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ₹{item.remaining.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </td>
                  <td className="text-right py-2 px-3 text-gray-300">
                    {item.budget > 0 ? ((item.spent / item.budget) * 100).toFixed(1) : 0}%
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
