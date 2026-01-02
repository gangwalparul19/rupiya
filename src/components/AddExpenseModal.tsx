'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense?: (expense: any) => Promise<void>;
}

export default function AddExpenseModal({
  isOpen,
  onClose,
  onAddExpense,
}: AddExpenseModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Today's date as default
    paymentMethod: 'cash' as 'cash' | 'card' | 'upi' | 'bank' | 'wallet',
    paymentMethodId: '',
    paymentMethodName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const user = useAppStore((state) => state.user);
  const addExpense = useAppStore((state) => state.addExpense);
  const categories = useAppStore((state) => state.categories);
  const cards = useAppStore((state) => state.cards);
  const upiAccounts = useAppStore((state) => state.upiAccounts);
  const bankAccounts = useAppStore((state) => state.bankAccounts);
  const wallets = useAppStore((state) => state.wallets);

  // Set default category when categories load
  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      const expenseCategories = categories.filter((c) => c.type === 'expense' || c.type === 'both');
      if (expenseCategories.length > 0) {
        setFormData((prev) => ({ ...prev, category: expenseCategories[0].name }));
      }
    }
  }, [categories]);

  // Reset payment method selection when payment method changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      paymentMethodId: '',
      paymentMethodName: '',
    }));
  }, [formData.paymentMethod]);

  const getPaymentMethodOptions = () => {
    switch (formData.paymentMethod) {
      case 'card':
        return cards;
      case 'upi':
        return upiAccounts;
      case 'bank':
        return bankAccounts;
      case 'wallet':
        return wallets;
      default:
        return [];
    }
  };

  const getPaymentMethodLabel = (method: any) => {
    switch (formData.paymentMethod) {
      case 'card':
        return `${method.cardName} (${method.cardNumber.slice(-4)})`;
      case 'upi':
        return `${method.upiName} (${method.upiHandle})`;
      case 'bank':
        return `${method.bankName} (${method.accountNumber.slice(-4)})`;
      case 'wallet':
        return `${method.name}${method.balance ? ` (₹${method.balance})` : ''}`;
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validation
    if (!formData.amount) {
      setValidationError('Amount is required');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setValidationError('Amount must be greater than 0');
      return;
    }

    if (!formData.description) {
      setValidationError('Description is required');
      return;
    }

    if (!formData.category) {
      setValidationError('Category is required');
      return;
    }

    // Validate payment method selection for non-cash payments
    if (formData.paymentMethod !== 'cash' && !formData.paymentMethodId) {
      setValidationError(`Please select a ${formData.paymentMethod === 'wallet' ? 'wallet' : formData.paymentMethod} account`);
      return;
    }

    setIsSubmitting(true);

    const expense: any = {
      id: Date.now().toString(),
      amount: amount,
      category: formData.category,
      description: formData.description,
      date: new Date(formData.date), // Convert date string to Date object
      paymentMethod: formData.paymentMethod,
    };

    // Only add payment method details if they exist (for non-cash payments)
    if (formData.paymentMethodId) {
      expense.paymentMethodId = formData.paymentMethodId;
      expense.paymentMethodName = formData.paymentMethodName;
    }

    try {
      if (user && onAddExpense) {
        // Firebase integration
        await onAddExpense(expense);
      } else {
        // Local storage only
        addExpense(expense);
      }

      setFormData({
        amount: '',
        category: categories.length > 0 ? categories[0].name : '',
        description: '',
        date: new Date().toISOString().split('T')[0], // Reset to today
        paymentMethod: 'cash',
        paymentMethodId: '',
        paymentMethodName: '',
      });
      onClose();
    } catch (error) {
      console.error('Error adding expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const paymentOptions = getPaymentMethodOptions();
  const showPaymentMethodSelect =
    formData.paymentMethod !== 'cash' && paymentOptions.length > 0;

  const expenseCategories = categories.filter((c) => c.type === 'expense' || c.type === 'both');

  return (
    <div className="w-full animate-slide-up">
      <div className="card p-4 md:p-6 border-2 border-blue-500/50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 w-full max-w-2xl mx-auto">
        <div className="border-b border-slate-700 pb-4 mb-4 flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold text-white">Add New Expense</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {validationError && (
            <div className="bg-red-600 bg-opacity-20 border border-red-600 rounded px-4 py-2 text-red-200 text-sm">
              {validationError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Amount *</label>
              <input
                type="number"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 md:py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Category *</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 md:py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                required
              >
                <option value="">Select a category</option>
                {expenseCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 md:py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentMethod: e.target.value as any,
                  })
                }
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 md:py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              >
                <option value="cash">💵 Cash</option>
                <option value="card">💳 Card</option>
                <option value="upi">📱 UPI</option>
                <option value="bank">🏦 Bank Transfer</option>
                <option value="wallet">👛 Wallet</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">Description *</label>
            <textarea
              placeholder="What did you spend on?"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 md:py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              rows={3}
              required
            />
          </div>

          {/* Show payment method selection if available */}
          {showPaymentMethodSelect && (
            <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
              <label className="block text-sm font-medium mb-3 text-slate-300">
                Select {formData.paymentMethod === 'card' ? 'Card' : formData.paymentMethod === 'upi' ? 'UPI' : formData.paymentMethod === 'wallet' ? 'Wallet' : 'Bank Account'} *
              </label>
              <select
                value={formData.paymentMethodId}
                onChange={(e) => {
                  const selected = paymentOptions.find((opt) => opt.id === e.target.value);
                  setFormData({
                    ...formData,
                    paymentMethodId: e.target.value,
                    paymentMethodName: selected ? getPaymentMethodLabel(selected) : '',
                  });
                }}
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 md:py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              >
                <option value="">Select a {formData.paymentMethod === 'card' ? 'card' : formData.paymentMethod === 'upi' ? 'UPI account' : formData.paymentMethod === 'wallet' ? 'wallet' : 'bank account'}</option>
                {paymentOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {getPaymentMethodLabel(option)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Show message if no payment methods saved */}
          {formData.paymentMethod !== 'cash' && paymentOptions.length === 0 && (
            <div className="bg-amber-900 bg-opacity-30 border border-amber-700 rounded-lg p-4">
              <p className="text-sm text-amber-200">
                No {formData.paymentMethod === 'card' ? 'cards' : formData.paymentMethod === 'upi' ? 'UPI accounts' : formData.paymentMethod === 'wallet' ? 'wallets' : 'bank accounts'} saved.
                <a href="/payment-methods" className="underline font-semibold ml-1">Add one now</a>
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t border-slate-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 px-4 py-3 md:py-4 rounded font-semibold transition text-white text-base"
            >
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 px-4 py-3 md:py-4 rounded font-semibold transition text-white text-base"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
