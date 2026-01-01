'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import PageWrapper from '@/components/PageWrapper';
import RecentExpenses from '@/components/RecentExpenses';
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
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
          <div className="text-xl sm:text-2xl font-bold text-white">
            💰 Rupiya
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Link href="/auth/login">
              <button className="px-4 sm:px-5 py-2 text-slate-300 hover:text-white transition text-sm font-medium">
                Login
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold text-sm">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-28 md:py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            Smart Money Management
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-10 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
            Track expenses, manage budgets, and achieve financial goals with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <button className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition">
                Get Started Free
              </button>
            </Link>
            <a href="/rupiya-guide.html" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-3 border border-slate-600 hover:border-slate-400 text-white rounded-lg font-semibold hover:bg-slate-800/50 transition text-center">
              📥 User Guide
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-28 md:py-32 lg:py-40 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-16 sm:mb-20">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-3">Expense Tracking</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Categorize and track every expense with detailed analytics and insights.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-bold text-white mb-3">Budget Management</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Set budgets and get alerts when approaching limits.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-white mb-3">Investment Tracking</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Monitor stocks, mutual funds, and crypto in one place.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-3">Goal Planning</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Set and track financial goals with progress visualization.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-4xl mb-4">💱</div>
              <h3 className="text-xl font-bold text-white mb-3">Multi-Currency</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Manage finances in multiple currencies with live rates.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-white mb-3">AI Insights</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Get personalized recommendations to optimize spending.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-28 md:py-32 lg:py-40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-16 sm:mb-20">
            Get Started in 3 Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Sign Up</h3>
              <p className="text-slate-400 text-sm">
                Create your account in seconds with email or Google.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Add Data</h3>
              <p className="text-slate-400 text-sm">
                Log expenses, income, and investments easily.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Get Insights</h3>
              <p className="text-slate-400 text-sm">
                View analytics and optimize your finances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-28 md:py-32 lg:py-40 bg-slate-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Take Control?
          </h2>
          <p className="text-slate-400 mb-10 text-base sm:text-lg">
            Join thousands managing their finances smarter with Rupiya.
          </p>
          <Link href="/auth/signup">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition">
              Start Free Today
            </button>
          </Link>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>&copy; 2025 Rupiya. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const expenses = useAppStore((state) => state.expenses);
  const income = useAppStore((state) => state.income);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  const thisMonthExpenses = expenses
    .filter((e) => {
      const expenseDate = new Date(e.date);
      const now = new Date();
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const thisMonthIncome = income
    .filter((i) => {
      const incomeDate = new Date(i.date);
      const now = new Date();
      return (
        incomeDate.getMonth() === now.getMonth() &&
        incomeDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, i) => sum + i.amount, 0);

  const cashFlow = thisMonthIncome - thisMonthExpenses;
  const savingsRate = thisMonthIncome > 0 ? (cashFlow / thisMonthIncome) * 100 : 0;

  return (
    <PageWrapper>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <h1 className="heading-page">Dashboard</h1>
            <p className="text-secondary">Your complete financial management dashboard</p>
          </div>

          <div className="grid-responsive-4 mb-6 md:mb-8">
            <div className="card bg-gradient-to-br from-green-900 to-green-800 border-green-700">
              <p className="text-green-200 text-xs mb-1 font-medium">This Month Income</p>
              <p className="text-lg md:text-2xl font-bold text-white">₹{(thisMonthIncome / 1000).toFixed(0)}K</p>
              <p className="text-xs text-green-300 mt-1">{income.filter(i => {
                const d = new Date(i.date);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length} entries</p>
            </div>

            <div className="card bg-gradient-to-br from-red-900 to-red-800 border-red-700">
              <p className="text-red-200 text-xs mb-1 font-medium">This Month Expenses</p>
              <p className="text-lg md:text-2xl font-bold text-white">₹{(thisMonthExpenses / 1000).toFixed(0)}K</p>
              <p className="text-xs text-red-300 mt-1">{expenses.filter(e => {
                const d = new Date(e.date);
                const now = new Date();
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
              }).length} entries</p>
            </div>

            <div className={`card bg-gradient-to-br ${cashFlow >= 0 ? 'from-blue-900 to-blue-800 border-blue-700' : 'from-orange-900 to-orange-800 border-orange-700'}`}>
              <p className={`${cashFlow >= 0 ? 'text-blue-200' : 'text-orange-200'} text-xs mb-1 font-medium`}>Cash Flow</p>
              <p className={`text-lg md:text-2xl font-bold ${cashFlow >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                ₹{(cashFlow / 1000).toFixed(0)}K
              </p>
              <p className={`text-xs mt-1 ${cashFlow >= 0 ? 'text-blue-300' : 'text-orange-300'}`}>
                {savingsRate.toFixed(0)}% saved
              </p>
            </div>

            <div className="card bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700">
              <p className="text-purple-200 text-xs mb-1 font-medium">Net Worth</p>
              <p className="text-lg md:text-2xl font-bold text-white">₹{((thisMonthIncome - thisMonthExpenses) / 1000).toFixed(0)}K</p>
              <p className="text-xs text-purple-300 mt-1">Assets + Goals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 md:mb-4 gap-2">
                <h2 className="heading-section">Recent Transactions</h2>
                <Link href="/expenses">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 md:px-4 py-2 rounded-lg transition font-semibold text-xs md:text-sm whitespace-nowrap">
                    + Add Expense
                  </button>
                </Link>
              </div>
              <RecentExpenses />
            </div>

            <div className="card">
              <h3 className="heading-section">Expense Breakdown</h3>
              {expenses.length > 0 ? (
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={(() => {
                        const breakdown: { [key: string]: number } = {};
                        expenses.forEach((exp) => {
                          const cat = exp.category || 'Other';
                          breakdown[cat] = (breakdown[cat] || 0) + exp.amount;
                        });
                        return Object.entries(breakdown).map(([name, value]) => ({
                          name,
                          value,
                        }));
                      })()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ₹${value}`}
                      outerRadius={50}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        '#ef4444',
                        '#f97316',
                        '#eab308',
                        '#22c55e',
                        '#06b6d4',
                        '#3b82f6',
                        '#8b5cf6',
                      ].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `₹${value}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-40 flex items-center justify-center text-slate-400 text-xs">
                  No expense data available
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="card">
              <h3 className="heading-section">Income vs Expense Trend</h3>
              {income.length > 0 || expenses.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={(() => {
                      const months: { [key: string]: { income: number; expense: number } } = {};
                      
                      income.forEach((inc) => {
                        const month = inc.date.toISOString().slice(0, 7);
                        if (!months[month]) months[month] = { income: 0, expense: 0 };
                        months[month].income += inc.amount;
                      });
                      
                      expenses.forEach((exp) => {
                        const month = exp.date.toISOString().slice(0, 7);
                        if (!months[month]) months[month] = { income: 0, expense: 0 };
                        months[month].expense += exp.amount;
                      });
                      
                      return Object.entries(months)
                        .sort()
                        .slice(-6)
                        .map(([month, data]) => ({
                          month: new Date(month + '-01').toLocaleDateString('en-IN', {
                            month: 'short',
                          }),
                          ...data,
                        }));
                    })()}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      formatter={(value) => `₹${value}`}
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#22c55e" name="Income" />
                    <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-52 flex items-center justify-center text-slate-400 text-xs">
                  No data available
                </div>
              )}
            </div>

            <div className="card">
              <h3 className="heading-section">6-Month Spending Trend</h3>
              {expenses.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={(() => {
                      const months: { [key: string]: number } = {};
                      
                      expenses.forEach((exp) => {
                        const month = exp.date.toISOString().slice(0, 7);
                        months[month] = (months[month] || 0) + exp.amount;
                      });
                      
                      return Object.entries(months)
                        .sort()
                        .slice(-6)
                        .map(([month, amount]) => ({
                          month: new Date(month + '-01').toLocaleDateString('en-IN', {
                            month: 'short',
                          }),
                          amount,
                        }));
                    })()}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
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
                      dot={{ fill: '#f59e0b', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-52 flex items-center justify-center text-slate-400 text-xs">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  );
}
