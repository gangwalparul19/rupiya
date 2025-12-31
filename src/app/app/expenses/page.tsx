'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

export default function ExpensesPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'food',
    description: '',
    paymentMethod: 'cash' as const,
  });

  const expenses = useAppStore((state) => state.expenses);
  const addExpense = useAppStore((state) => state.addExpense);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) return;

    addExpense({
      id: Date.now().toString(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: new Date(),
      paymentMethod: formData.paymentMethod,
    });

    setFormData({
      amount: '',
      category: 'food',
      description: '',
      paymentMethod: 'cash',
    });
    setShowForm(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">📊 Expenses</h1>
          <Link href="/">
            <button className="text-slate-300 hover:text-white">← Back</button>
          </Link>
        </div>

        {/* Add Expense Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mb-6 transition"
        >
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-slate-700 rounded-lg p-6 mb-8 text-white"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="bg-slate-600 rounded px-4 py-2 text-white placeholder-slate-400"
                required
              />
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="bg-slate-600 rounded px-4 py-2 text-white"
              >
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="utilities">Utilities</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="bg-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 md:col-span-2"
                required
              />
              <select
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentMethod: e.target.value as any,
                  })
                }
                className="bg-slate-600 rounded px-4 py-2 text-white"
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="wallet">Wallet</option>
              </select>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 rounded px-4 py-2 transition"
              >
                Save Expense
              </button>
            </div>
          </form>
        )}

        {/* Expenses List */}
        <div className="space-y-4">
          {expenses.length === 0 ? (
            <p className="text-slate-300 text-center py-8">No expenses yet</p>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-slate-700 rounded-lg p-4 text-white flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{expense.description}</p>
                  <p className="text-slate-400 text-sm">
                    {expense.category} • {expense.paymentMethod}
                  </p>
                </div>
                <p className="text-xl font-bold">₹{expense.amount}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
