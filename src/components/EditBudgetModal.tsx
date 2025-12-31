'use client';

import { useState, useEffect } from 'react';
import { Budget, useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';

interface EditBudgetModalProps {
  budget: Budget;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditBudgetModal({ budget, isOpen, onClose, onSuccess }: EditBudgetModalProps) {
  const { updateBudget } = useAppStore();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    month: '',
    totalBudget: '',
    food: '',
    transport: '',
    utilities: '',
    entertainment: '',
    shopping: '',
    health: '',
    other: '',
  });

  useEffect(() => {
    if (budget && isOpen) {
      setFormData({
        month: budget.month,
        totalBudget: budget.totalBudget.toString(),
        food: budget.categories.food?.toString() || '',
        transport: budget.categories.transport?.toString() || '',
        utilities: budget.categories.utilities?.toString() || '',
        entertainment: budget.categories.entertainment?.toString() || '',
        shopping: budget.categories.shopping?.toString() || '',
        health: budget.categories.health?.toString() || '',
        other: budget.categories.other?.toString() || '',
      });
    }
  }, [budget, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.month || !formData.totalBudget) {
        error('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      const totalBudget = parseFloat(formData.totalBudget);
      if (isNaN(totalBudget) || totalBudget <= 0) {
        error('Total budget must be a valid positive number');
        setIsLoading(false);
        return;
      }

      // Update budget
      updateBudget(budget.id, {
        month: formData.month,
        totalBudget,
        categories: {
          food: formData.food ? parseFloat(formData.food) : undefined,
          transport: formData.transport ? parseFloat(formData.transport) : undefined,
          utilities: formData.utilities ? parseFloat(formData.utilities) : undefined,
          entertainment: formData.entertainment ? parseFloat(formData.entertainment) : undefined,
          shopping: formData.shopping ? parseFloat(formData.shopping) : undefined,
          health: formData.health ? parseFloat(formData.health) : undefined,
          other: formData.other ? parseFloat(formData.other) : undefined,
        },
      });

      // Show success message
      success('Budget updated successfully');

      // Close modal
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error('Error updating budget:', err);
      error('Failed to update budget');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Edit Budget</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Month */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Month <span className="text-red-500">*</span>
            </label>
            <input
              type="month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Total Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Total Budget <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="totalBudget"
              value={formData.totalBudget}
              onChange={handleChange}
              placeholder="Enter total budget amount"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              step="0.01"
              min="0"
              required
            />
          </div>

          {/* Category Budgets */}
          <div className="border-t border-gray-700 pt-4">
            <p className="text-sm font-medium text-gray-300 mb-3">Category Budgets (Optional)</p>

            <div className="space-y-3">
              {['food', 'transport', 'utilities', 'entertainment', 'shopping', 'health', 'other'].map((category) => (
                <div key={category}>
                  <label className="block text-xs font-medium text-gray-400 mb-1 capitalize">
                    {category}
                  </label>
                  <input
                    type="number"
                    name={category}
                    value={formData[category as keyof typeof formData]}
                    onChange={handleChange}
                    placeholder={`${category} budget`}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                    step="0.01"
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update Budget'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
