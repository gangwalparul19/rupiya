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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-lg' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-center items-center">
            {/* Logo Only - Centered */}
            <div className="relative h-12 w-auto transition-transform duration-300 hover:scale-105 cursor-pointer">
              <Image
                src="/logo.png"
                alt="Rupiya"
                width={120}
                height={48}
                className="object-contain h-12 w-auto"
                priority
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">
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

          <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
            Take control of your finances with intelligent tracking, budgeting, and AI-powered insights. Built for modern professionals.
          </p>

          {/* View Guide Button */}
          <div className="flex justify-center mb-8 animate-slide-up delay-200">
            <a href="/rupiya-guide.html" target="_blank" rel="noopener noreferrer">
              <button className="px-8 py-3 border-2 border-slate-700 hover:border-blue-500 text-white rounded-xl font-semibold text-base hover:bg-slate-800/50 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                View Guide
              </button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto mb-8 animate-slide-up delay-300">
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2 animate-pulse-slow">10K+</div>
              <div className="text-xs sm:text-sm text-slate-400">Active Users</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2 animate-pulse-slow">₹50Cr+</div>
              <div className="text-xs sm:text-sm text-slate-400">Tracked</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-transform duration-300">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2 animate-pulse-slow">4.9★</div>
              <div className="text-xs sm:text-sm text-slate-400">Rating</div>
            </div>
          </div>

          {/* Call to Action - Login & Sign Up - PROMINENT */}
          <div className="relative animate-slide-up delay-400">
            {/* Glowing Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl animate-pulse-glow"></div>

            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-2 border-blue-500/30 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 animate-fade-in">
                  Ready to Transform Your Finances?
                </h3>
                <p className="text-slate-300 text-sm sm:text-base">
                  Join thousands of users managing their money smarter
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch">
                <Link href="/auth/signup" className="flex-1 sm:flex-initial">
                  <button className="w-full px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold text-lg sm:text-xl shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300 hover:scale-105 transform flex items-center justify-center gap-3 group animate-shimmer">
                    <span className="relative z-10">Sign Up Free</span>
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </Link>
                <Link href="/auth/login" className="flex-1 sm:flex-initial">
                  <button className="w-full px-10 py-5 border-2 border-slate-600 hover:border-blue-500 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-xl font-bold text-lg sm:text-xl transition-all duration-300 hover:scale-105 transform flex items-center justify-center gap-3">
                    <span>Login</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </Link>
              </div>

              <p className="text-center text-slate-400 text-xs sm:text-sm mt-4">
                No credit card required • Free forever • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <span className="text-blue-400 text-sm font-semibold">FEATURES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Everything You Need
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Powerful features designed to give you complete control over your financial life
            </p>
          </div>

          {/* Feature Cards - 2 per row on mobile, 2 on tablet, 3 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: '📊',
                title: 'Expense Tracking',
                description: 'Categorize and track every expense with detailed analytics and real-time insights.',
                gradient: 'from-blue-600 to-cyan-600',
                bgGradient: 'from-blue-500/5 to-cyan-500/5',
                borderColor: 'border-blue-500/20 hover:border-blue-500/40'
              },
              {
                icon: '💳',
                title: 'Smart Budgets',
                description: 'Set intelligent budgets with AI-powered recommendations and instant alerts.',
                gradient: 'from-purple-600 to-pink-600',
                bgGradient: 'from-purple-500/5 to-pink-500/5',
                borderColor: 'border-purple-500/20 hover:border-purple-500/40'
              },
              {
                icon: '📈',
                title: 'Investment Tracking',
                description: 'Monitor stocks, mutual funds, and crypto portfolios in real-time.',
                gradient: 'from-green-600 to-emerald-600',
                bgGradient: 'from-green-500/5 to-emerald-500/5',
                borderColor: 'border-green-500/20 hover:border-green-500/40'
              },
              {
                icon: '🎯',
                title: 'Goal Planning',
                description: 'Set financial goals and track progress with visual milestones.',
                gradient: 'from-orange-600 to-red-600',
                bgGradient: 'from-orange-500/5 to-red-500/5',
                borderColor: 'border-orange-500/20 hover:border-orange-500/40'
              },
              {
                icon: '💱',
                title: 'Multi-Currency',
                description: 'Manage finances across currencies with live exchange rates.',
                gradient: 'from-cyan-600 to-blue-600',
                bgGradient: 'from-cyan-500/5 to-blue-500/5',
                borderColor: 'border-cyan-500/20 hover:border-cyan-500/40'
              },
              {
                icon: '🤖',
                title: 'AI Insights',
                description: 'Get personalized recommendations to optimize your spending patterns.',
                gradient: 'from-violet-600 to-purple-600',
                bgGradient: 'from-violet-500/5 to-purple-500/5',
                borderColor: 'border-violet-500/20 hover:border-violet-500/40'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm border ${feature.borderColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-10 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl cursor-pointer overflow-hidden`}
              >
                {/* Gradient Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                {/* Icon and Title on Same Line */}
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <span className="text-2xl sm:text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all duration-300">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm lg:text-base leading-relaxed mb-3 sm:mb-0">
                  {feature.description}
                </p>

                {/* Arrow Icon - Hidden on mobile */}
                <div className="hidden sm:flex mt-4 lg:mt-6 items-center text-slate-500 group-hover:text-blue-400 transition-colors duration-300">
                  <span className="text-sm font-medium mr-2">Learn more</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-block px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4 sm:mb-6">
              <span className="text-cyan-400 text-xs sm:text-sm font-semibold">HOW IT WORKS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4">
              Get Started in Minutes
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto px-4">
              Three simple steps to financial clarity
            </p>
          </div>

          {/* Steps - 2 per row on mobile, 3 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {[
              {
                step: '01',
                title: 'Sign Up',
                description: 'Create your account with email or Google in seconds',
                icon: '👤'
              },
              {
                step: '02',
                title: 'Add Data',
                description: 'Import or manually add your financial transactions',
                icon: '📝'
              },
              {
                step: '03',
                title: 'Get Insights',
                description: 'View analytics and optimize your finances with AI',
                icon: '📊'
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                {/* Connecting Line - Desktop Only */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 z-0">
                    <div className="w-full h-full bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-transparent"></div>
                  </div>
                )}

                {/* Card */}
                <div className="relative z-10 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700 hover:border-blue-500/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
                  {/* Step Number, Icon, and Title on Same Line */}
                  <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    {/* Step Number Badge */}
                    <div className="relative inline-flex items-center justify-center flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-sm sm:text-base font-bold text-white">{item.step}</span>
                      </div>
                    </div>

                    {/* Icon and Title */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                      <div className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm lg:text-base leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
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
        
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, #2563eb 0%, #06b6d4 50%, #2563eb 100%);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
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
        
        .delay-400 {
          animation-delay: 0.4s;
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
