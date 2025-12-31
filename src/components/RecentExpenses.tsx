'use client';

import { useAppStore } from '@/lib/store';
import Link from 'next/link';

const categoryEmojis: Record<string, string> = {
  food: '🍔',
  transport: '🚗',
  utilities: '💡',
  entertainment: '🎬',
  shopping: '🛍️',
  health: '🏥',
  other: '📌',
};

export default function RecentExpenses() {
  const expenses = useAppStore((state) => state.expenses);
  const recentExpenses = [...expenses].reverse().slice(0, 5);

  if (expenses.length === 0) {
    return (
      <div className="bg-slate-700 rounded-lg p-8 text-center text-slate-300">
        <p className="text-lg">No expenses yet</p>
        <p className="text-sm mt-2">Add your first expense to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentExpenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-slate-700 rounded-lg p-4 flex justify-between items-center hover:bg-slate-600 transition"
        >
          <div className="flex items-center gap-4 flex-1">
            <span className="text-2xl">
              {categoryEmojis[expense.category] || '📌'}
            </span>
            <div className="flex-1">
              <p className="font-semibold text-white">{expense.description}</p>
              <p className="text-sm text-slate-400">
                {expense.category} • {expense.paymentMethod}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-white">₹{expense.amount}</p>
            <p className="text-xs text-slate-400">
              {new Date(expense.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
      {expenses.length > 5 && (
        <Link href="/expenses">
          <button className="w-full bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-lg transition">
            View All Expenses
          </button>
        </Link>
      )}
    </div>
  );
}
