'use client';

import Link from 'next/link';

const sections = [
    {
        id: 'getting-started',
        title: '🚀 Getting Started',
        content: (
            <>
                <h3 className="text-xl font-bold text-blue-400 mb-4">Creating Your Account</h3>
                <div className="space-y-4">
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                        <span className="inline-block px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold mr-3">1</span>
                        <strong>Visit Rupiya</strong> - Navigate to our secure portal.
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                        <span className="inline-block px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold mr-3">2</span>
                        <strong>Sign Up</strong> - Choose between Email/Password or Google Sign-In for instant access.
                    </div>
                    <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                        <span className="inline-block px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold mr-3">3</span>
                        <strong>Complete Profile</strong> - Personalize your currency and basic preferences.
                    </div>
                </div>
                <div className="mt-6 bg-amber-500/10 border-l-4 border-amber-500 p-6 rounded-r-2xl">
                    <p className="text-amber-200"><strong className="text-amber-400">💡 Pro Tip:</strong> Google Sign-In is highly recommended for cross-device synchronization.</p>
                </div>
            </>
        )
    },
    {
        id: 'expenses',
        title: '📊 Expense Tracking',
        content: (
            <>
                <p className="text-slate-300 mb-6">Track every rupee with millimetric precision using our advanced categorization engine.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {[
                        '🍔 Food & Dining', '🚗 Transportation', '🛍️ Shopping', '🏠 Housing & Utilities',
                        '💊 Healthcare', '🎓 Education', '🎬 Entertainment', '✈️ Travel'
                    ].map((cat, i) => (
                        <div key={i} className="bg-slate-800/30 p-3 rounded-xl border border-slate-700 text-slate-300">
                            {cat}
                        </div>
                    ))}
                </div>
                <div className="bg-green-500/10 border-l-4 border-green-500 p-6 rounded-r-2xl text-green-200">
                    <strong>✅ Best Practice:</strong> Log expenses as they happen to maintain real-time accuracy.
                </div>
            </>
        )
    },
    {
        id: 'budgets',
        title: '💳 Budget Planning',
        content: (
            <>
                <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-700 space-y-6">
                    <h4 className="text-xl font-bold text-blue-400">Smart Budgeting Rules</h4>
                    <p className="text-slate-300">Set hard limits on categories and receive instant alerts before you overspend.</p>
                    <ul className="list-disc list-inside space-y-3 text-slate-400">
                        <li>Custom thresholds (e.g., alert at 80% usage)</li>
                        <li>Rollover feature for continuous saving</li>
                        <li>AI-suggested limits based on history</li>
                    </ul>
                </div>
            </>
        )
    },
    {
        id: 'investments',
        title: '📈 Investment Tracking',
        content: (
            <>
                <div className="flex flex-wrap gap-4 mb-6">
                    {['Stocks', 'Mutual Funds', 'Crypto', 'Fixed Deposits', 'Gold'].map((type) => (
                        <span key={type} className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30 text-sm font-semibold">
                            {type}
                        </span>
                    ))}
                </div>
                <p className="text-slate-300 leading-relaxed">
                    Monitor your cumulative net worth across all asset classes. Rupiya provides real-time ROI calculation and asset allocation visualization.
                </p>
            </>
        )
    }
];

export default function GuidePage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            <div className="max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <Link href="/">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full mb-8 text-blue-400 font-bold hover:bg-slate-800 transition-colors cursor-pointer">
                            ← Back to Home
                        </div>
                    </Link>
                    <h1 className="text-5xl sm:text-7xl font-black text-white mb-6 tracking-tight">
                        User <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Guide</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Master every feature of Rupiya and transform your financial future.
                    </p>
                </div>

                {/* Quick Nav */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-8 mb-16">
                    <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-6 px-2">Navigation</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {sections.map(s => (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                className="px-4 py-3 bg-slate-800/50 hover:bg-blue-500/10 hover:border-blue-500/50 border border-transparent rounded-2xl text-slate-300 font-medium transition-all"
                            >
                                {s.title.split(' ')[1]} {s.title.split(' ')[2] || ''}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-12">
                    {sections.map(s => (
                        <section key={s.id} id={s.id} className="scroll-mt-24 bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-10 lg:p-14 hover:border-slate-700 transition-colors">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 border-b border-slate-800 pb-6">{s.title}</h2>
                            <div className="text-slate-400">
                                {s.content}
                            </div>
                        </section>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-20 text-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 lg:p-20 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                    <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 relative z-10">Start Tracking Today</h2>
                    <Link href="/auth/signup">
                        <button className="bg-white text-blue-700 px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-transform relative z-10 shadow-2xl">
                            Create Free Account
                        </button>
                    </Link>
                </div>

                {/* Footer */}
                <footer className="mt-20 text-center text-slate-600 text-sm">
                    <p>© 2026 Rupiya Financial. All rights reserved.</p>
                    <div className="flex justify-center gap-6 mt-4">
                        <a href="#" className="hover:text-blue-400 transition-colors">Support</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
                    </div>
                </footer>
            </div>
        </div>
    );
}
