'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function ReportsPage() {
  const router = useRouter();
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const expenses = useAppStore((state) => state.expenses);
  const income = useAppStore((state) => state.income);
  const investments = useAppStore((state) => state.investments);
  const goals = useAppStore((state) => state.goals);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  // Calculate metrics
  const monthExpenses = expenses.filter(
    (exp) => exp.date.toISOString().slice(0, 7) === selectedMonth
  );
  const monthIncome = income.filter(
    (inc) => inc.date.toISOString().slice(0, 7) === selectedMonth
  );

  const totalExpenses = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncome = monthIncome.reduce((sum, inc) => sum + inc.amount, 0);
  const cashFlow = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (cashFlow / totalIncome) * 100 : 0;

  // Investment metrics
  const totalInvested = investments.reduce((sum, inv) => sum + inv.initialAmount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const investmentGain = totalCurrentValue - totalInvested;
  const investmentReturn = totalInvested > 0 ? (investmentGain / totalInvested) * 100 : 0;

  // Goals metrics
  const totalGoalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalGoalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const goalsProgress = totalGoalTarget > 0 ? (totalGoalSaved / totalGoalTarget) * 100 : 0;

  // Net worth
  const netWorth = totalCurrentValue + totalGoalSaved - totalExpenses;

  // Expense breakdown by category
  const expensesByCategory: { [key: string]: number } = {};
  monthExpenses.forEach((exp) => {
    const cat = exp.category || 'Other';
    expensesByCategory[cat] = (expensesByCategory[cat] || 0) + exp.amount;
  });

  // Income breakdown by source
  const incomeBySource: { [key: string]: number } = {};
  monthIncome.forEach((inc) => {
    incomeBySource[inc.source] = (incomeBySource[inc.source] || 0) + inc.amount;
  });


  // Helper function to abbreviate numbers
  const formatCompact = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <PageWrapper>
      <div className="py-4 sm:py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="heading-page">📑 Financial Reports</h1>
          <p className="text-secondary">Comprehensive financial insights and analysis</p>
        </div>

        {/* Month Selector - Compact */}
        <div className="mb-6 md:mb-8">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full md:w-48 form-input"
          />
        </div>

        {/* Key Metrics - Compact Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 md:mb-16">
          <div className="kpi-card">
            <p className="kpi-label text-blue-400">Net Worth</p>
            <p className={`kpi-value ${netWorth >= 0 ? 'text-white' : 'text-red-400'}`}>
              ₹{formatCompact(netWorth)}
            </p>
            <p className="kpi-subtitle text-slate-400">Total valuation</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-label text-slate-400">Cash Flow</p>
            <p className={`kpi-value ${cashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ₹{formatCompact(cashFlow)}
            </p>
            <p className="kpi-subtitle text-slate-400">Income vs Spent</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-label text-purple-400">Savings Rate</p>
            <p className="kpi-value text-white">
              {savingsRate.toFixed(0)}%
            </p>
            <p className="kpi-subtitle text-slate-400">Portion preserved</p>
          </div>
          <div className="kpi-card">
            <p className="kpi-label text-blue-500">Inv. Return</p>
            <p className={`kpi-value ${investmentReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {investmentReturn.toFixed(1)}%
            </p>
            <p className="kpi-subtitle text-slate-400">Portfolio growth</p>
          </div>
        </div>

        {/* Summary Cards Grid - 2x2 on mobile, 4x1 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-8">
          {/* Income */}
          <div className="card">
            <h4 className="text-xs md:text-sm font-bold mb-3">💵 Income</h4>
            <p className="text-green-400 text-base md:text-lg font-bold">₹{formatCompact(totalIncome)}</p>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
              <div
                className="h-1.5 rounded-full bg-green-500"
                style={{
                  width: `${Math.min((totalIncome / Math.max(totalIncome, totalExpenses)) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Expense */}
          <div className="card">
            <h4 className="text-xs md:text-sm font-bold mb-3">💰 Expense</h4>
            <p className="text-red-400 text-base md:text-lg font-bold">₹{formatCompact(totalExpenses)}</p>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
              <div
                className="h-1.5 rounded-full bg-red-500"
                style={{
                  width: `${Math.min((totalExpenses / Math.max(totalIncome, totalExpenses)) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Investment Summary */}
          <div className="card">
            <h4 className="text-xs md:text-sm font-bold mb-3">📈 Invested</h4>
            <p className="text-blue-400 text-base md:text-lg font-bold">₹{formatCompact(totalInvested)}</p>
            <p className="text-xs text-slate-400 mt-1">{investments.length} investments</p>
          </div>

          {/* Goals Summary */}
          <div className="card">
            <h4 className="text-xs md:text-sm font-bold mb-3">🎯 Goals</h4>
            <p className="text-purple-400 text-base md:text-lg font-bold">{goalsProgress.toFixed(0)}%</p>
            <p className="text-xs text-slate-400 mt-1">₹{formatCompact(totalGoalSaved)} saved</p>
          </div>
        </div>

        {/* Detailed Breakdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8">
          {/* Expense Breakdown */}
          <div className="card">
            <h3 className="text-xs md:text-sm font-bold mb-3">💰 Expense Breakdown</h3>
            {Object.keys(expensesByCategory).length === 0 ? (
              <p className="text-slate-400 text-xs md:text-sm">No expenses this month</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(expensesByCategory)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([category, amount]) => {
                    const percentage = (amount / totalExpenses) * 100;
                    return (
                      <div key={category}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs md:text-sm capitalize">{category}</span>
                          <span className="text-xs md:text-sm font-semibold">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-red-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Income Breakdown */}
          <div className="card">
            <h3 className="text-xs md:text-sm font-bold mb-3">💵 Income Breakdown</h3>
            {Object.keys(incomeBySource).length === 0 ? (
              <p className="text-slate-400 text-xs md:text-sm">No income this month</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(incomeBySource)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([source, amount]) => {
                    const percentage = (amount / totalIncome) * 100;
                    return (
                      <div key={source}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs md:text-sm capitalize">{source}</span>
                          <span className="text-xs md:text-sm font-semibold">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full bg-green-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-4 md:space-y-6">
          {/* 6-Month Trend */}
          <div className="card">
            <h3 className="text-xs md:text-sm font-bold text-white mb-3">📊 6-Month Trend</h3>
            {income.length > 0 || expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={(() => {
                    const months: { [key: string]: { income: number; expense: number; cashFlow: number } } = {};

                    income.forEach((inc) => {
                      const month = inc.date.toISOString().slice(0, 7);
                      if (!months[month]) months[month] = { income: 0, expense: 0, cashFlow: 0 };
                      months[month].income += inc.amount;
                    });

                    expenses.forEach((exp) => {
                      const month = exp.date.toISOString().slice(0, 7);
                      if (!months[month]) months[month] = { income: 0, expense: 0, cashFlow: 0 };
                      months[month].expense += exp.amount;
                    });

                    return Object.entries(months)
                      .sort()
                      .slice(-6)
                      .map(([month, data]) => ({
                        month: new Date(month + '-01').toLocaleDateString('en-IN', {
                          month: 'short',
                        }),
                        income: data.income,
                        expense: data.expense,
                        cashFlow: data.income - data.expense,
                      }));
                  })()}
                  margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => `₹${value}`}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                No data available
              </div>
            )}
          </div>

          {/* Category Trends */}
          <div className="card">
            <h3 className="text-xs md:text-sm font-bold text-white mb-3">📈 Category Trends</h3>
            {expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={(() => {
                    const categoryMonths: { [key: string]: { [key: string]: number } } = {};

                    expenses.forEach((exp) => {
                      const month = exp.date.toISOString().slice(0, 7);
                      const cat = exp.category || 'Other';

                      if (!categoryMonths[month]) categoryMonths[month] = {};
                      categoryMonths[month][cat] = (categoryMonths[month][cat] || 0) + exp.amount;
                    });

                    return Object.entries(categoryMonths)
                      .sort()
                      .slice(-6)
                      .map(([month, categories]) => ({
                        month: new Date(month + '-01').toLocaleDateString('en-IN', {
                          month: 'short',
                        }),
                        ...categories,
                      }));
                  })()}
                  margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => `₹${value}`}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', fontSize: '12px' }}
                  />
                  {(() => {
                    const allCategories = new Set<string>();
                    expenses.forEach((exp) => {
                      allCategories.add(exp.category || 'Other');
                    });
                    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'];
                    return Array.from(allCategories).map((cat, idx) => (
                      <Bar key={cat} dataKey={cat} fill={colors[idx % colors.length]} />
                    ));
                  })()}
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
                No expense data available
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}



