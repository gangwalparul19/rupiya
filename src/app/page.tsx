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
        <div className="container-responsive py-4">
          <div className="flex justify-start items-center">
            {/* Logo Aligned to Container Left */}
            <div className="relative h-10 w-auto transition-transform duration-300 hover:scale-105 cursor-pointer">
              <Image
                src="/logo.png"
                alt="Rupiya"
                width={100}
                height={40}
                className="object-contain h-10 w-auto"
                priority
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-48 pb-24 md:pt-56 md:pb-32">
        <div className="container-responsive text-center z-10">
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
      <section className="relative py-24 sm:py-32 lg:py-48 px-4 sm:px-6 lg:px-8 bg-slate-950/30">
        <div className="container-responsive">
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

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: '📊',
                title: 'Expense Tracking',
                description: 'Categorize and track every expense with detailed analytics and real-time insights.',
                gradient: 'from-blue-600 to-cyan-600',
                bgGradient: 'from-blue-500/10 to-cyan-500/10',
                borderColor: 'border-blue-500/20 hover:border-blue-500/40'
              },
              {
                icon: '💳',
                title: 'Smart Budgets',
                description: 'Set intelligent budgets with AI-powered recommendations and instant alerts.',
                gradient: 'from-purple-600 to-pink-600',
                bgGradient: 'from-purple-500/10 to-pink-500/10',
                borderColor: 'border-purple-500/20 hover:border-purple-500/40'
              },
              {
                icon: '📈',
                title: 'Investment Tracking',
                description: 'Monitor stocks, mutual funds, and crypto portfolios in real-time.',
                gradient: 'from-green-600 to-emerald-600',
                bgGradient: 'from-green-500/10 to-emerald-500/10',
                borderColor: 'border-green-500/20 hover:border-green-500/40'
              },
              {
                icon: '🎯',
                title: 'Goal Planning',
                description: 'Set financial goals and track progress with visual milestones.',
                gradient: 'from-orange-600 to-red-600',
                bgGradient: 'from-orange-500/10 to-red-500/10',
                borderColor: 'border-orange-500/20 hover:border-orange-500/40'
              },
              {
                icon: '💱',
                title: 'Multi-Currency',
                description: 'Manage finances across currencies with live exchange rates.',
                gradient: 'from-cyan-600 to-blue-600',
                bgGradient: 'from-cyan-500/10 to-blue-500/10',
                borderColor: 'border-cyan-500/20 hover:border-cyan-500/40'
              },
              {
                icon: '🤖',
                title: 'AI Insights',
                description: 'Get personalized recommendations to optimize your spending patterns.',
                gradient: 'from-violet-600 to-purple-600',
                bgGradient: 'from-violet-500/10 to-purple-500/10',
                borderColor: 'border-violet-500/20 hover:border-violet-500/40'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-slate-900/40 backdrop-blur-xl border-2 ${feature.borderColor} rounded-3xl p-8 lg:p-10 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] cursor-pointer overflow-hidden`}
              >
                {/* Accent Glow */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`}></div>

                {/* Icon Container */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-2xl shadow-blue-500/20 mb-8 transform group-hover:rotate-6 transition-transform duration-300`}>
                  <span className="text-3xl lg:text-4xl">{feature.icon}</span>
                </div>

                <h3 className="text-xl lg:text-2xl font-extrabold text-white mb-4 group-hover:translate-x-1 transition-transform">
                  {feature.title}
                </h3>

                <p className="text-slate-400 text-base lg:text-lg leading-relaxed mb-8">
                  {feature.description}
                </p>

                <div className="flex items-center text-blue-400 font-semibold text-sm uppercase tracking-wider group/link">
                  <span>Learn more</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover/link:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 sm:py-32 lg:py-48 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="container-responsive">
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

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '01',
                title: 'Create Account',
                description: 'Set up your secure profile in seconds with simple email or social login.',
                icon: '👤'
              },
              {
                step: '02',
                title: 'Sync Transactions',
                description: 'Securely link or manually add your data to get a bird\'s eye view of your wealth.',
                icon: '�'
              },
              {
                step: '03',
                title: 'Optimize Wealth',
                description: 'Leverage AI to uncover hidden patterns and achieve your savings goals faster.',
                icon: '�'
              }
            ].map((item, index) => (
              <div key={index} className="relative group p-1">
                {/* Connecting Arrow - Desktop */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-[20%] -right-10 w-20 h-10 z-0">
                    <svg className="w-full h-full text-blue-500/30 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}

                <div className="relative z-10 bg-slate-900/40 backdrop-blur-xl border-2 border-slate-800 hover:border-blue-500/50 rounded-3xl p-10 transition-all duration-500 hover:translate-y-[-8px] hover:shadow-2xl">
                  {/* Step Number Badge */}
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg mb-8 group-hover:rotate-12 transition-transform duration-300">
                    {item.step}
                  </div>

                  <div className="text-4xl mb-6">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-slate-400 text-lg leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-800 bg-slate-950/80 backdrop-blur-xl py-12 md:py-20">
        <div className="container-responsive px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="relative h-10 w-auto mb-6">
                <Image
                  src="/logo.png"
                  alt="Rupiya"
                  width={100}
                  height={40}
                  className="object-contain h-10 w-auto"
                />
              </div>
              <p className="text-slate-400 text-base max-w-sm leading-relaxed mb-6">
                Redefining financial management with AI-powered tracking, intuitive budgeting, and professional-grade insights for the modern era.
              </p>
              <div className="flex gap-4">
                {/* Social Icons Placeholder */}
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all cursor-pointer">𝕏</div>
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all cursor-pointer">in</div>
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all cursor-pointer">ig</div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-4">
                <li><Link href="/features" className="text-slate-400 hover:text-blue-400 transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-slate-400 hover:text-blue-400 transition-colors">Pricing</Link></li>
                <li><Link href="/guide" className="text-slate-400 hover:text-blue-400 transition-colors">User Guide</Link></li>
                <li><Link href="/support" className="text-slate-400 hover:text-blue-400 transition-colors">Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-slate-400 hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link href="/privacy" className="text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-slate-400 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© 2025 Rupiya. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <span className="text-slate-500">Built with ❤️ for modern professionals</span>
            </div>
          </div>
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
      <div className="py-4 sm:py-6 md:py-8">
        {/* Header with fade-in animation */}
        <div className="mb-8 md:mb-10 animate-fade-in">
          <h1 className="heading-page text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">Dashboard</h1>
          <p className="text-slate-400 text-base md:text-lg">Your complete financial management dashboard</p>
        </div>

        {/* KPI Cards with staggered animation */}
        <div className="grid-responsive-4 mb-10 md:mb-16">
          <div className="kpi-card animate-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="kpi-label text-green-400">Income</p>
                <p className="kpi-value">₹{(thisMonthIncome / 1000).toFixed(1)}K</p>
                <p className="kpi-subtitle text-green-400/60">{income.filter(i => {
                  const d = new Date(i.date);
                  const now = new Date();
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).length} entries this month</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-xl">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="kpi-card animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="kpi-label text-red-400">Expenses</p>
                <p className="kpi-value">₹{(thisMonthExpenses / 1000).toFixed(1)}K</p>
                <p className="kpi-subtitle text-red-400/60">{expenses.filter(e => {
                  const d = new Date(e.date);
                  const now = new Date();
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).length} entries this month</p>
              </div>
              <div className="bg-red-500/10 p-3 rounded-xl">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="kpi-card animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="kpi-label text-blue-400">Cash Flow</p>
                <p className={`kpi-value ${cashFlow >= 0 ? 'text-blue-400' : 'text-orange-400'}`}>
                  {cashFlow >= 0 ? '+' : ''}₹{(cashFlow / 1000).toFixed(1)}K
                </p>
                <p className="kpi-subtitle text-blue-400/60">{savingsRate.toFixed(1)}% savings rate</p>
              </div>
              <div className={`${cashFlow >= 0 ? 'bg-blue-500/10' : 'bg-orange-500/10'} p-3 rounded-xl`}>
                <svg className={`w-6 h-6 ${cashFlow >= 0 ? 'text-blue-400' : 'text-orange-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="kpi-card animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="kpi-label text-purple-400">Net Worth</p>
                <p className="kpi-value text-white">₹{((thisMonthIncome - thisMonthExpenses) / 1000).toFixed(1)}K</p>
                <p className="kpi-subtitle text-purple-400/60">Total assets + goals</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-xl">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0h2a2 2 0 012 2v6a2 2 0 01-2 2h-2a2 2 0 01-2-2v-6z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 md:mb-4 gap-2">
              <h2 className="heading-section">Recent Transactions</h2>
              <Link href="/expenses">
                <button className="btn btn-primary shadow-lg shadow-blue-500/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Expense
                </button>
              </Link>
            </div>
            <RecentExpenses />
          </div>

          <div className="card space-y-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white">Expense Breakdown</h3>
              <p className="text-slate-400 text-sm mt-1">Category distribution</p>
            </div>
            {expenses.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
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
                    outerRadius={70}
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
              <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
                <p className="text-sm">No expense data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Charts Grid with animation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 animate-slide-in-right">
          <div className="card space-y-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white">Income vs Expense Trend</h3>
              <p className="text-slate-400 text-sm mt-1">Last 6 months comparison</p>
            </div>
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

          <div className="card space-y-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-white">6-Month Spending Trend</h3>
              <p className="text-slate-400 text-sm mt-1">Monthly expense pattern</p>
            </div>
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
              <div className="h-52 flex flex-col items-center justify-center text-slate-400">
                <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <p className="text-sm">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
