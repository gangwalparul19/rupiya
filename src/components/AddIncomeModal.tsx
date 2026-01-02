'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import type { Income } from '@/lib/store';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIncome: (income: Income) => void;
}

export default function AddIncomeModal({
  isOpen,
  onClose,
  onAddIncome,
}: AddIncomeModalProps) {
  const categories = useAppStore((state) => state.categories);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    source: 'salary' as const,
    date: new Date().toISOString().split('T')[0],
    category: '',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? value : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    const income: Income = {
      id: Date.now().toString(),
      amount: parseFloat(formData.amount),
      source: formData.source,
      description: formData.description,
      date: new Date(formData.date),
      category: formData.category || 'General',
    };

    onAddIncome(income);
    setFormData({
      description: '',
      amount: '',
      source: 'salary',
      date: new Date().toISOString().split('T')[0],
      category: '',
    });
    onClose();
  };

  return (
    <div className="w-full animate-slide-up">
      <div className="card p-4 md:p-6 border-2 border-green-500/50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 w-full max-w-2xl mx-auto">
        <div className="border-b border-slate-700 pb-4 mb-4 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-white">💰 Add Income</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-green-500"
              placeholder="e.g., Monthly Salary"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-green-500"
              placeholder="0"
              step="0.01"
              required
            />
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Income Source
            </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500"
              required
            >
              <option value="salary">💼 Salary</option>
              <option value="freelance">🎨 Freelance</option>
              <option value="investment">📈 Investment</option>
              <option value="gift">🎁 Gift</option>
              <option value="bonus">🏆 Bonus</option>
              <option value="other">📌 Other</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Category (Optional)
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.emoji} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:border-green-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-semibold"
            >
              Add Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
