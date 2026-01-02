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
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

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
      <section className="relative py-24 sm:py-32 lg:py-48 px-4 sm:px-6 lg:px-8 bg-slate-950/30">
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
          <div className="relative animate-slide-up delay-400 max-w-4xl mx-auto">
            {/* Glowing Background Effect */}
            <div className="absolute inset-x-0 -top-24 -bottom-24 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 blur-[120px] animate-pulse-glow opacity-50"></div>

            <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="text-center mb-10">
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Experience the <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Future</span> of Finance
                </h3>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                  Join a community of professionals who have mastered their money with AI-driven insights and effortless tracking.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/auth/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:px-12 py-5 bg-white text-slate-950 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 group">
                    <span>Get Started Free</span>
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </Link>
                <Link href="/auth/login" className="w-full sm:w-auto">
                  <button className="w-full sm:px-12 py-5 bg-slate-800/50 backdrop-blur-md border border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
                    <span>Sign In</span>
                    <svg className="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                    </svg>
                  </button>
                </Link>
              </div>

              <div className="flex justify-center items-center gap-8 mt-10 pt-10 border-t border-white/5">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                      <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" width={40} height={40} className="opacity-80" />
                    </div>
                  ))}
                </div>
                <p className="text-slate-500 text-sm font-medium italic">
                  Trusted by 10,000+ modern professionals
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 sm:py-32 lg:py-48 px-4 sm:px-6 lg:px-8 bg-slate-950/30 border-t border-slate-800/50">
        <div className="container-responsive">
          {/* Section Header */}
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Capabilities</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Master Your <span className="text-blue-500">Wealth</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              A comprehensive suite of tools designed to simplify your financial life and accelerate your journey to financial freedom.
            </p>
          </div>

          {/* Feature Cards - 2 per row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                icon: '📊',
                title: 'Expense Tracking',
                shortDesc: 'Categorize and track every rupee with military precision.',
                details: 'Gain full visibility into your spending habits. Our advanced categorization engine automatically groups your transactions, while interactive heatmaps and trend lines help you identify where your money goes. Export reports in multiple formats for tax season or personal audits.',
                gradient: 'from-blue-600 to-indigo-600',
                borderColor: 'border-blue-500/30'
              },
              {
                icon: '💳',
                title: 'Smart Budgets',
                shortDesc: 'Set budgets that actually work with AI-powered forecasting.',
                details: 'Stop guessing and start planning. Create categorical budgets with custom limits and receive real-time notifications before you overspend. Our rollover feature lets you carry forward savings to the next month, encouraging long-term financial discipline.',
                gradient: 'from-purple-600 to-fuchsia-600',
                borderColor: 'border-purple-500/30'
              },
              {
                icon: '📈',
                title: 'Investment Portfolio',
                shortDesc: 'Monitor your net worth across stocks, mutual funds, and more.',
                details: 'Your entire portfolio in one dashboard. Track stocks, mutual funds, and cash assets in real-time. Visualize your asset allocation to ensure a balanced portfolio and monitor your total net worth growth over time with professional-grade analysis.',
                gradient: 'from-emerald-600 to-teal-600',
                borderColor: 'border-emerald-500/30'
              },
              {
                icon: '🎯',
                title: 'Goal Planning',
                shortDesc: 'Turn your dreams into achievable financial milestones.',
                details: 'Whether it\'s buying a home or planning a vacation, our goal tracker breaks down large objectives into manageable monthly savings targets. Get visual feedback on your progress and automated suggestions on how to reach your targets faster.',
                gradient: 'from-orange-600 to-rose-600',
                borderColor: 'border-orange-500/30'
              },
              {
                icon: '💱',
                title: 'Multi-Currency Support',
                shortDesc: 'Manage finances globally with real-time exchange rates.',
                details: 'Perfect for travelers and expats. Track expenses in any currency and see them converted to your base currency automatically using live market rates. Manage multiple bank accounts across different countries with ease.',
                gradient: 'from-cyan-600 to-sky-600',
                borderColor: 'border-cyan-500/30'
              },
              {
                icon: '🤖',
                title: 'AI Financial Insights',
                shortDesc: 'Personalized recommendations to optimize your spending.',
                details: 'Leverage the power of Gemini AI to analyze your financial behavior. Receive weekly summaries, detect anomalous spending patterns, and get actionable advice on where to cut back to maximize your savings without sacrificing your lifestyle.',
                gradient: 'from-violet-600 to-purple-600',
                borderColor: 'border-violet-500/30'
              },
              {
                icon: '🧹',
                title: 'House Help Management',
                shortDesc: 'Track staff wages and mid-month advances effortlessly.',
                details: 'A dedicated module for managing household staff. Keep a directory of help, record monthly wages, and track mid-month advances. All payments are automatically categorized as expenses for a unified financial overview.',
                gradient: 'from-amber-600 to-yellow-600',
                borderColor: 'border-amber-500/30'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-slate-900/60 backdrop-blur-2xl border-2 ${feature.borderColor} rounded-[2rem] p-10 lg:p-14 transition-all duration-500 hover:scale-[1.02] hover:bg-slate-900/80 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-8 cursor-default`}
              >
                {/* Icon */}
                <div className={`shrink-0 w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.gradient} shadow-2xl shadow-blue-500/20 flex items-center justify-center text-4xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {feature.icon}
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-lg lg:text-xl leading-relaxed mb-8">
                    {feature.shortDesc}
                  </p>
                  <button
                    onClick={() => setSelectedFeature(feature)}
                    className="inline-flex items-center text-blue-400 font-bold text-sm uppercase tracking-widest group/btn cursor-pointer"
                  >
                    <span>View Methodology</span>
                    <svg className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 sm:py-32 lg:py-48 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900/50 to-slate-950 border-t border-slate-800/50">
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
                description: 'Set up your secure profile in seconds. We use bank-grade encryption to keep your data safe.',
                icon: '👤',
                color: 'from-blue-500 to-indigo-600'
              },
              {
                step: '02',
                title: 'Input Data',
                description: 'Add your income, expenses, and investments manually or via automated imports.',
                icon: '📥',
                color: 'from-cyan-500 to-blue-600'
              },
              {
                step: '03',
                title: 'Gain Insights',
                description: 'Let our AI analyze your habits and provide tailored recommendations for wealth growth.',
                icon: '💡',
                color: 'from-indigo-500 to-purple-600'
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="relative z-10 bg-slate-900/40 backdrop-blur-xl border border-white/5 hover:border-blue-500/30 rounded-[2.5rem] p-10 lg:p-12 transition-all duration-500 hover:translate-y-[-10px] shadow-2xl">
                  {/* Step Number */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl mb-8 transform group-hover:rotate-6 transition-transform`}>
                    {item.step}
                  </div>

                  <div className="text-5xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">{item.icon}</div>
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
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6 text-sm">
              <span className="text-slate-500">Built with ❤️ for modern professionals</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Feature Detail Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedFeature(null)}
          ></div>
          <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-blue-500/30 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.15)] animate-slide-up">
            {/* Modal Header/Hero */}
            <div className={`pt-12 pb-8 px-8 sm:px-12 bg-gradient-to-br ${selectedFeature.gradient} relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 z-10"
              >
                ✕
              </button>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="text-6xl mb-4 bg-white/20 backdrop-blur-xl w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl">
                  {selectedFeature.icon}
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{selectedFeature.title}</h2>
                <div className="h-1 w-20 bg-white/40 rounded-full"></div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 sm:p-12">
              <div className="space-y-6">
                <div>
                  <h4 className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">The Objective</h4>
                  <p className="text-white text-lg sm:text-xl font-medium leading-relaxed">
                    {selectedFeature.shortDesc}
                  </p>
                </div>

                <div className="h-px bg-slate-800"></div>

                <div>
                  <h4 className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-3">How it helps you</h4>
                  <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                    {selectedFeature.details}
                  </p>
                </div>

                <div className="pt-6">
                  <Link href="/auth/signup" onClick={() => setSelectedFeature(null)}>
                    <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-[1.02]">
                      Start using {selectedFeature.title}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
        <div className="mb-block animate-fade-in">
          <h1 className="heading-page text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">Dashboard</h1>
          <p className="text-slate-400 text-base md:text-lg">Your complete financial management dashboard</p>
        </div>

        {/* KPI Cards with staggered animation */}
        <div className="grid-responsive-4 mb-section">
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



        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 animate-slide-in-right">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-section animate-slide-in-right">
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
