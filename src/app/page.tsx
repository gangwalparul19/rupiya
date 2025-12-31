'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            💰 Rupiya
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <button className="px-4 py-2 text-slate-300 hover:text-white transition">
                Login
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition font-semibold">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Take Control of Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Financial Life</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Rupiya is your all-in-one personal finance management platform. Track expenses, manage budgets, invest wisely, and achieve your financial goals.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/signup">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition font-semibold text-lg">
                Get Started Free
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="px-8 py-3 border border-slate-600 hover:border-slate-400 text-white rounded-lg transition font-semibold text-lg">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Why Choose Rupiya?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Expense Tracking</h3>
            <p className="text-slate-300">
              Track every rupee you spend with detailed categorization, payment methods, and receipt scanning with OCR technology.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-bold text-white mb-2">Budget Management</h3>
            <p className="text-slate-300">
              Set monthly budgets by category, get real-time alerts when you're approaching limits, and stay in control of your spending.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold text-white mb-2">Investment Tracking</h3>
            <p className="text-slate-300">
              Monitor your stocks, mutual funds, crypto, real estate, and other investments in one place with performance analytics.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">Goal Planning</h3>
            <p className="text-slate-300">
              Set financial goals (emergency fund, vacation, home, education) and track your progress towards achieving them.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition">
            <div className="text-4xl mb-4">💱</div>
            <h3 className="text-xl font-bold text-white mb-2">Multi-Currency Support</h3>
            <p className="text-slate-300">
              Manage finances in multiple currencies with real-time exchange rates and automatic conversion capabilities.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-white mb-2">Expense Splitting</h3>
            <p className="text-slate-300">
              Split expenses with friends and family, track who owes whom, and settle up easily with built-in settlement tracking.
            </p>
          </div>

          {/* Feature 7 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-white mb-2">Receipt Scanning</h3>
            <p className="text-slate-300">
              Scan receipts with your camera, extract expense details automatically, and organize all your bills in one place.
            </p>
          </div>

          {/* Feature 8 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-white mb-2">Calendar & Reminders</h3>
            <p className="text-slate-300">
              Get reminders for bill payments, recurring transactions, and goal milestones so you never miss important dates.
            </p>
          </div>

          {/* Feature 9 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Advanced Analytics</h3>
            <p className="text-slate-300">
              Get AI-powered insights, spending trends, savings recommendations, and detailed financial reports to make better decisions.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          How to Use Rupiya
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Create Account</h3>
            <p className="text-slate-300">
              Sign up with your email and create a secure account in seconds.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Add Transactions</h3>
            <p className="text-slate-300">
              Log your income and expenses, or scan receipts for automatic entry.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Set Goals</h3>
            <p className="text-slate-300">
              Define budgets, financial goals, and investment targets.
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">4</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Get Insights</h3>
            <p className="text-slate-300">
              View analytics, reports, and AI recommendations to improve finances.
            </p>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Key Benefits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="text-3xl flex-shrink-0">✅</div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Complete Financial Overview</h3>
              <p className="text-slate-300">See all your income, expenses, investments, and goals in one unified dashboard.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-3xl flex-shrink-0">✅</div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Smart Budget Alerts</h3>
              <p className="text-slate-300">Get notified when you're approaching budget limits so you can adjust spending.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-3xl flex-shrink-0">✅</div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Investment Performance Tracking</h3>
              <p className="text-slate-300">Monitor gains/losses across all your investments with detailed analytics.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-3xl flex-shrink-0">✅</div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Goal Achievement Tracking</h3>
              <p className="text-slate-300">Stay motivated by tracking progress towards your financial goals.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-3xl flex-shrink-0">✅</div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Secure & Private</h3>
              <p className="text-slate-300">Your financial data is encrypted and stored securely with enterprise-grade security.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="text-3xl flex-shrink-0">✅</div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">AI-Powered Insights</h3>
              <p className="text-slate-300">Get personalized recommendations to optimize your spending and savings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Master Your Finances?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are taking control of their financial future with Rupiya.
          </p>
          <Link href="/auth/signup">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition font-semibold text-lg">
              Start Your Free Account Today
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-12 md:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-slate-400">
          <p>&copy; 2025 Rupiya. All rights reserved. Your personal finance companion.</p>
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
  const investments = useAppStore((state) => state.investments);
  const goals = useAppStore((state) => state.goals);
  const budgets = useAppStore((state) => state.budgets);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Calculate metrics
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
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

  const totalInvested = investments.reduce((sum, inv) => sum + inv.initialAmount, 0);
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
  const investmentGain = totalCurrentValue - totalInvested;

  const totalGoalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalGoalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentBudget = budgets.find((b) => b.month === currentMonth);
  const budgetAdherence = currentBudget
    ? (thisMonthExpenses / currentBudget.totalBudget) * 100
    : 0;

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="heading-page">Dashboard</h1>
          <p className="text-secondary">Your complete financial management dashboard</p>
        </div>

        {/* Key Financial Metrics - Compact Cards */}
        <div className="grid-responsive-4 mb-6 md:mb-8">
          {/* This Month Income */}
          <div className="card bg-gradient-to-br from-green-900 to-green-800 border-green-700">
            <p className="text-green-200 text-xs mb-1 font-medium">This Month Income</p>
            <p className="text-lg md:text-2xl font-bold text-white">₹{(thisMonthIncome / 1000).toFixed(0)}K</p>
            <p className="text-xs text-green-300 mt-1">{income.filter(i => {
              const d = new Date(i.date);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length} entries</p>
          </div>

          {/* This Month Expenses */}
          <div className="card bg-gradient-to-br from-red-900 to-red-800 border-red-700">
            <p className="text-red-200 text-xs mb-1 font-medium">This Month Expenses</p>
            <p className="text-lg md:text-2xl font-bold text-white">₹{(thisMonthExpenses / 1000).toFixed(0)}K</p>
            <p className="text-xs text-red-300 mt-1">{expenses.filter(e => {
              const d = new Date(e.date);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length} entries</p>
          </div>

          {/* Cash Flow */}
          <div className={`card bg-gradient-to-br ${cashFlow >= 0 ? 'from-blue-900 to-blue-800 border-blue-700' : 'from-orange-900 to-orange-800 border-orange-700'}`}>
            <p className={`${cashFlow >= 0 ? 'text-blue-200' : 'text-orange-200'} text-xs mb-1 font-medium`}>Cash Flow</p>
            <p className={`text-lg md:text-2xl font-bold ${cashFlow >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              ₹{(cashFlow / 1000).toFixed(0)}K
            </p>
            <p className={`text-xs mt-1 ${cashFlow >= 0 ? 'text-blue-300' : 'text-orange-300'}`}>
              {savingsRate.toFixed(0)}% saved
            </p>
          </div>

          {/* Net Worth */}
          <div className="card bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700">
            <p className="text-purple-200 text-xs mb-1 font-medium">Net Worth</p>
            <p className="text-lg md:text-2xl font-bold text-white">₹{((totalCurrentValue + totalGoalSaved - totalExpenses) / 1000).toFixed(0)}K</p>
            <p className="text-xs text-purple-300 mt-1">Assets + Goals</p>
          </div>
        </div>

        {/* Secondary Metrics - 2x2 on mobile, 3 cols on desktop */}
        <div className="grid-responsive-3 mb-6 md:mb-8">
          {/* Budget Status */}
          {currentBudget && (
            <div className={`card ${
              budgetAdherence > 100
                ? 'bg-red-900 border-red-700'
                : budgetAdherence > 80
                ? 'bg-yellow-900 border-yellow-700'
                : 'bg-slate-800 border-slate-700'
            }`}>
              <p className="text-slate-300 text-xs font-medium mb-2">Budget Status</p>
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-white font-semibold text-xs sm:text-sm">₹{(thisMonthExpenses / 1000).toFixed(0)}K</span>
                  <span className="text-slate-400 text-xs">/ ₹{(currentBudget.totalBudget / 1000).toFixed(0)}K</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition ${
                      budgetAdherence > 100
                        ? 'bg-red-500'
                        : budgetAdherence > 80
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budgetAdherence, 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-xs font-semibold ${
                  budgetAdherence > 100
                    ? 'text-red-400'
                    : budgetAdherence > 80
                    ? 'text-yellow-400'
                    : 'text-green-400'
                }`}>
                  {budgetAdherence.toFixed(0)}% Used
                </p>
                {budgetAdherence > 80 && (
                  <span className={`text-xs px-2 py-1 rounded font-bold ${
                    budgetAdherence > 100
                      ? 'bg-red-600 text-white'
                      : 'bg-yellow-600 text-white'
                  }`}>
                    {budgetAdherence > 100 ? '⚠️ EXCEEDED' : '⚠️ WARNING'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Investment Performance */}
          {investments.length > 0 && (
            <div className="card">
              <p className="text-slate-300 text-xs font-medium mb-2">Investment Performance</p>
              <div className="space-y-1">
                <div>
                  <p className="text-slate-400 text-xs">Current Value</p>
                  <p className="text-white font-semibold text-xs sm:text-sm">₹{(totalCurrentValue / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className={`text-xs font-semibold ${investmentGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {investmentGain >= 0 ? '+' : ''}₹{(investmentGain / 1000).toFixed(0)}K ({((investmentGain / totalInvested) * 100).toFixed(1)}%)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Goals Progress */}
          {goals.length > 0 && (
            <div className="card">
              <p className="text-slate-300 text-xs font-medium mb-2">Goals Progress</p>
              <div className="mb-2">
                <div className="flex justify-between mb-1">
                  <span className="text-white font-semibold text-xs sm:text-sm">₹{(totalGoalSaved / 1000).toFixed(0)}K</span>
                  <span className="text-slate-400 text-xs">/ ₹{(totalGoalTarget / 1000).toFixed(0)}K</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-cyan-500"
                    style={{ width: `${Math.min((totalGoalSaved / totalGoalTarget) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <p className="text-xs font-semibold text-cyan-400">
                {((totalGoalSaved / totalGoalTarget) * 100).toFixed(0)}% Complete
              </p>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
          {/* Recent Expenses Section */}
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

          {/* Expense Breakdown Pie Chart */}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
          {/* Income vs Expense Comparison */}
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

          {/* 6-Month Spending Trend */}
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
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Spending"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-52 flex items-center justify-center text-slate-400 text-xs">
                No expense data available
              </div>
            )}
          </div>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
          {/* Income Sources */}
          {income.length > 0 && (
            <div className="card">
              <h3 className="heading-section">Income Sources</h3>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={(() => {
                      const sources: { [key: string]: number } = {};
                      income.forEach((inc) => {
                        sources[inc.source] = (sources[inc.source] || 0) + inc.amount;
                      });
                      return Object.entries(sources).map(([name, value]) => ({
                        name: name.charAt(0).toUpperCase() + name.slice(1),
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
                      '#22c55e',
                      '#06b6d4',
                      '#3b82f6',
                      '#8b5cf6',
                      '#ec4899',
                      '#f59e0b',
                    ].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Investment Performance */}
          {investments.length > 0 && (
            <div className="card">
              <h3 className="heading-section">Investment Performance</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart
                  data={investments.map((inv) => ({
                    name: inv.name.substring(0, 10),
                    initial: inv.initialAmount,
                    current: inv.currentValue,
                  }))}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    formatter={(value) => `₹${value}`}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                  />
                  <Legend />
                  <Bar dataKey="initial" fill="#94a3b8" name="Initial" />
                  <Bar dataKey="current" fill="#22c55e" name="Current" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
