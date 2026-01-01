'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import Image from 'next/image';
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
                <Image 
                  src="/logo.png" 
                  alt="Rupiya Logo" 
                  width={40} 
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Rupiya</span>
            </div>
            <div className="flex gap-3">
              <Link href="/auth/login">
                <button className="px-5 py-2 text-slate-300 hover:text-white transition-all duration-300 text-sm font-medium hover:bg-slate-800/50 rounded-lg">
                  Login
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-all duration-300 font-semibold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-5xl mx-auto text-center z-10">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-blue-300 text-sm font-medium">AI-Powered Financial Management</span>
          </div>

          {/* Main Heading with Animation */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight animate-slide-up">
            Smart Money
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              Management
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
            Take control of your finances with intelligent tracking, budgeting, and AI-powered insights. Built for modern professionals.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-200">
            <Link href="/auth/signup">
              <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold text-base shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                Get Started Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>
            <a href="/rupiya-guide.html" target="_blank" rel="noopener noreferrer">
              <button className="w-full sm:w-auto px-8 py-4 border-2 border-slate-700 hover:border-slate-500 text-white rounded-xl font-semibold text-base hover:bg-slate-800/50 transition-all duration-300 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                View Guide
              </button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto animate-slide-up delay-300">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-sm text-slate-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">₹50Cr+</div>
              <div className="text-sm text-slate-400">Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-2">4.9★</div>
              <div className="text-sm text-slate-400">Rating</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Everything You Need
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Powerful features designed to give you complete control over your financial life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '📊',
                title: 'Expense Tracking',
                description: 'Categorize and track every expense with detailed analytics and real-time insights.',
                color: 'from-blue-500/10 to-cyan-500/10',
                border: 'border-blue-500/20'
              },
              {
                icon: '💳',
                title: 'Smart Budgets',
                description: 'Set intelligent budgets with AI-powered recommendations and instant alerts.',
                color: 'from-purple-500/10 to-pink-500/10',
                border: 'border-purple-500/20'
              },
              {
                icon: '📈',
                title: 'Investment Tracking',
                description: 'Monitor stocks, mutual funds, and crypto portfolios in real-time.',
                color: 'from-green-500/10 to-emerald-500/10',
                border: 'border-green-500/20'
              },
              {
                icon: '🎯',
                title: 'Goal Planning',
                description: 'Set financial goals and track progress with visual milestones.',
                color: 'from-orange-500/10 to-red-500/10',
                border: 'border-orange-500/20'
              },
              {
                icon: '💱',
                title: 'Multi-Currency',
                description: 'Manage finances across currencies with live exchange rates.',
                color: 'from-cyan-500/10 to-blue-500/10',
                border: 'border-cyan-500/20'
              },
              {
                icon: '🤖',
                title: 'AI Insights',
                description: 'Get personalized recommendations to optimize your spending patterns.',
                color: 'from-violet-500/10 to-purple-500/10',
                border: 'border-violet-500/20'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br ${feature.color} border ${feature.border} rounded-2xl p-8 hover:scale-105 transition-all duration-300 hover:shadow-2xl cursor-pointer`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Get Started in Minutes
            </h2>
            <p className="text-lg text-slate-400">
              Three simple steps to financial clarity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Sign Up', description: 'Create your account with email or Google in seconds' },
              { step: '02', title: 'Add Data', description: 'Import or manually add your financial transactions' },
              { step: '03', title: 'Get Insights', description: 'View analytics and optimize your finances with AI' }
            ].map((item, index) => (
              <div key={index} className="relative text-center group">
                {/* Connecting Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                )}
                
                <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity blur-xl"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-bold text-white">{item.step}</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-3xl p-12 sm:p-16 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                Ready to Take Control?
              </h2>
              <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                Join thousands of users managing their finances smarter with Rupiya
              </p>
              <Link href="/auth/signup">
                <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold text-lg shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
                  Start Free Today
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-800 bg-slate-950/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-500 text-sm">© 2025 Rupiya. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
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
