'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';

interface FilterOptions {
  dateFrom: string;
  dateTo: string;
  categories: string[];
  paymentMethods: string[];
  amountMin: string;
  amountMax: string;
  searchText: string;
}

interface AdvancedFilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdvancedFilterPanel({
  onFilterChange,
  isOpen,
  onClose,
}: AdvancedFilterPanelProps) {
  const categories = useAppStore((state) => state.categories);
  const [filters, setFilters] = useState<FilterOptions>({
    dateFrom: '',
    dateTo: '',
    categories: [],
    paymentMethods: [],
    amountMin: '',
    amountMax: '',
    searchText: '',
  });

  const paymentMethods = ['cash', 'card', 'upi', 'bank'];

  const handleCategoryToggle = (categoryName: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryName)
        ? prev.categories.filter((c) => c !== categoryName)
        : [...prev.categories, categoryName],
    }));
  };

  const handlePaymentMethodToggle = (method: string) => {
    setFilters((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter((m) => m !== method)
        : [...prev.paymentMethods, method],
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
      dateFrom: '',
      dateTo: '',
      categories: [],
      paymentMethods: [],
      amountMin: '',
      amountMax: '',
      searchText: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
    onClose();
  };

  if (!isOpen) return null;

  const expenseCategories = categories.filter((c) => c.type === 'expense' || c.type === 'both');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-700 rounded-lg p-6 w-full max-w-2xl text-white max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Advanced Filters</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Search Description</label>
            <input
              type="text"
              placeholder="Search by description or notes..."
              value={filters.searchText}
              onChange={(e) =>
                setFilters({ ...filters, searchText: e.target.value })
              }
              className="w-full bg-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
                className="w-full bg-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
                className="w-full bg-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Amount Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Min Amount</label>
              <input
                type="number"
                placeholder="0"
                value={filters.amountMin}
                onChange={(e) =>
                  setFilters({ ...filters, amountMin: e.target.value })
                }
                className="w-full bg-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Amount</label>
              <input
                type="number"
                placeholder="0"
                value={filters.amountMax}
                onChange={(e) =>
                  setFilters({ ...filters, amountMax: e.target.value })
                }
                className="w-full bg-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium mb-3">Categories</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {expenseCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryToggle(cat.name)}
                  className={`px-3 py-2 rounded text-sm transition ${
                    filters.categories.includes(cat.name)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div>
            <label className="block text-sm font-medium mb-3">Payment Methods</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  onClick={() => handlePaymentMethodToggle(method)}
                  className={`px-3 py-2 rounded text-sm transition ${
                    filters.paymentMethods.includes(method)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  {method === 'cash'
                    ? '💵'
                    : method === 'card'
                    ? '💳'
                    : method === 'upi'
                    ? '📱'
                    : '🏦'}{' '}
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-600">
            <button
              onClick={handleResetFilters}
              className="flex-1 bg-slate-600 hover:bg-slate-500 rounded px-4 py-2 transition font-semibold"
            >
              Reset All
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-600 hover:bg-slate-500 rounded px-4 py-2 transition font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 bg-blue-600 hover:bg-blue-700 rounded px-4 py-2 transition font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
