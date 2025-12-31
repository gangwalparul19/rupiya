'use client';

import { useState } from 'react';
import { useAppStore, Investment } from '@/lib/store';
import { useToast } from '@/lib/toastContext';

interface AddInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddInvestmentModal({ isOpen, onClose, onSuccess }: AddInvestmentModalProps) {
  const { addInvestment } = useAppStore();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'stock' as const,
    initialAmount: '',
    currentValue: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    quantity: '',
    unitPrice: '',
    notes: '',
  });

  const investmentTypes = ['stock', 'mutual_fund', 'crypto', 'real_estate', 'gold', 'bonds', 'other'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
      if (!formData.name || !formData.type || !formData.initialAmount || !formData.currentValue || !formData.purchaseDate) {
        error('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      const initialAmount = parseFloat(formData.initialAmount);
      const currentValue = parseFloat(formData.currentValue);
      const quantity = formData.quantity ? parseFloat(formData.quantity) : 1;
      const unitPrice = formData.unitPrice ? parseFloat(formData.unitPrice) : initialAmount / quantity;

      if (isNaN(initialAmount) || initialAmount <= 0 || isNaN(currentValue) || currentValue <= 0) {
        error('Amounts must be valid positive numbers');
        setIsLoading(false);
        return;
      }

      // Create investment object
      const newInvestment: Investment = {
        id: `investment_${Date.now()}`,
        name: formData.name,
        type: formData.type as any,
        initialAmount,
        currentValue,
        purchaseDate: new Date(formData.purchaseDate),
        quantity,
        unitPrice,
        notes: formData.notes || undefined,
      };

      // Add to store
      addInvestment(newInvestment);

      // Show success message
      success('Investment added successfully');

      // Reset form
      setFormData({
        name: '',
        type: 'stock',
        initialAmount: '',
        currentValue: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        quantity: '',
        unitPrice: '',
        notes: '',
      });

      // Close modal
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error('Error adding investment:', err);
      error('Failed to add investment');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Add Investment</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Investment Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Apple Stock, Bitcoin"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Investment Type <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            >
              {investmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Purchase Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Purchase Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Initial Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Initial Amount <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="initialAmount"
              value={formData.initialAmount}
              onChange={handleChange}
              placeholder="Amount invested"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              step="0.01"
              min="0"
              required
            />
          </div>

          {/* Current Value */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Current Value <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="currentValue"
              value={formData.currentValue}
              onChange={handleChange}
              placeholder="Current market value"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              step="0.01"
              min="0"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Quantity (Optional)
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Number of units"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              step="0.01"
              min="0"
            />
          </div>

          {/* Unit Price */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Unit Price (Optional)
            </label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              placeholder="Price per unit"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              step="0.01"
              min="0"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this investment"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              rows={3}
            />
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
              {isLoading ? 'Adding...' : 'Add Investment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
