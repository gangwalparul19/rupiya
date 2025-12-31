'use client';

import Link from 'next/link';

export default function HousesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">🏠 Houses</h1>
          <Link href="/">
            <button className="text-slate-300 hover:text-white">← Back</button>
          </Link>
        </div>
        <div className="bg-slate-700 rounded-lg p-8 text-center text-slate-300">
          <p>House management coming soon...</p>
        </div>
      </div>
    </main>
  );
}
