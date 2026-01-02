'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import PageWrapper from '@/components/PageWrapper';
import EditBudgetModal from '@/components/EditBudgetModal';
import BudgetAnalytics from '@/components/BudgetAnalytics';
import ConfirmDialog from '@/components/ConfirmDialog';
import FormModal from '@/components/FormModal';
import SkeletonLoader from '@/components/SkeletonLoader';
import { validateAmount, validateMonth } from '@/lib/validation';
import type { Budget } from '@/lib/store';

// Helper function to abbreviate numbers
const abbreviateNumber = (num: number): string => {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num.toFixed(0)}`;
};

export default function BudgetsPage() {
  const { budgets, expenses, removeBudget, addBudget } = useAppStore();
  const { success, error } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    budgetId: '',
    budgetMonth: '',
  });
  const [formData, setFormData] = useState({
    month: new Date().toISOString().slice(0, 7),
    totalBudget: '',
    food: '',
    transport: '',
    utilities: '',
    entertainment: '',
    shopping: '',
    health: '',
    other: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter budgets
  const filteredBudgets = useMemo(() => {
    return budgets.filter((budget) => {
      const matchesSearch = budget.month.includes(searchTerm);
      const matchesFilter = !filterMonth || budget.month === filterMonth;
      return matchesSearch && matchesFilter;
    });
  }, [budgets, searchTerm, filterMonth]);

  const kpiStats = useMemo(() => {
    const totalBudgetAmount = budgets.reduce((sum, b) => sum + b.totalBudget, 0);
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remaining = totalBudgetAmount - totalSpent;

    return {
      totalBudgets: budgets.length,
      totalBudgetAmount,
      totalSpent,
      remaining,
    };
  }, [budgets, expenses]);

  const handleEdit = (budget: Budget) => {
    setSelectedBudget(budget);
    setIsEditModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    let error = '';
    if (name === 'month') {
      error = validateMonth(value) || '';
    } else if (name === 'totalBudget') {
      error = validateAmount(value) || '';
    } else if (['food', 'transport', 'utilities', 'entertainment', 'shopping', 'health', 'other'].includes(name)) {
      // Validate category amounts (optional, but if provided must be positive)
      if (value && parseFloat(value) <= 0) {
        error = 'Amount must be positive';
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const getCategoryTotal = () => {
    const categoryBudgets = [
      formData.food,
      formData.transport,
      formData.utilities,
      formData.entertainment,
      formData.shopping,
      formData.health,
      formData.other,
    ]
      .filter((val) => val !== '')
      .map((val) => parseFloat(val))
      .filter((val) => !isNaN(val));

    return categoryBudgets.reduce((sum, val) => sum + val, 0);
  };

  const totalBudgetAmount = formData.totalBudget ? parseFloat(formData.totalBudget) : 0;
  const categoryTotal = getCategoryTotal();
  const remaining = totalBudgetAmount - categoryTotal;
  const isOverBudget = categoryTotal > totalBudgetAmount && totalBudgetAmount > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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

      // Calculate sum of category budgets
      const categoryBudgets = [
        formData.food,
        formData.transport,
        formData.utilities,
        formData.entertainment,
        formData.shopping,
        formData.health,
        formData.other,
      ]
        .filter((val) => val !== '')
        .map((val) => parseFloat(val));

      const totalCategoryBudget = categoryBudgets.reduce((sum, val) => sum + val, 0);

      // Validate that category budgets don't exceed total budget
      if (totalCategoryBudget > totalBudget) {
        error(
          `Category budgets total (${abbreviateNumber(totalCategoryBudget)}) cannot exceed total budget (${abbreviateNumber(totalBudget)})`
        );
        setIsLoading(false);
        return;
      }

      const newBudget = {
        id: `budget_${Date.now()}`,
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
      };

      addBudget(newBudget);
      success('Budget created successfully');

      setFormData({
        month: new Date().toISOString().slice(0, 7),
        totalBudget: '',
        food: '',
        transport: '',
        utilities: '',
        entertainment: '',
        shopping: '',
        health: '',
        other: '',
      });

      setIsAddModalOpen(false);
      setFormStep(1);
    } catch (err) {
      console.error('Error creating budget:', err);
      error('Failed to create budget');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string, month: string) => {
    setConfirmDialog({
      isOpen: true,
      budgetId: id,
      budgetMonth: month,
    });
  };

  const handleConfirmDelete = () => {
    if (confirmDialog.budgetId) {
      removeBudget(confirmDialog.budgetId);
      success('Budget deleted successfully');
      setConfirmDialog({ isOpen: false, budgetId: '', budgetMonth: '' });
    }
  };

  const handleExportCSV = () => {
    if (filteredBudgets.length === 0) {
      error('No budgets to export');
      return;
    }

    let csv = 'Month,Total Budget,Food,Transport,Utilities,Entertainment,Shopping,Health,Other\n';

    filteredBudgets.forEach((budget) => {
      csv += `${budget.month},${budget.totalBudget},${budget.categories.food || 0},${budget.categories.transport || 0},${budget.categories.utilities || 0},${budget.categories.entertainment || 0},${budget.categories.shopping || 0},${budget.categories.health || 0},${budget.categories.other || 0}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budgets_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Budgets exported to CSV');
  };

  const handleExportTXT = () => {
    if (filteredBudgets.length === 0) {
      error('No budgets to export');
      return;
    }

    let txt = 'BUDGET REPORT\n';
    txt += `Generated: ${new Date().toLocaleString()}\n`;
    txt += '='.repeat(80) + '\n\n';

    filteredBudgets.forEach((budget) => {
      txt += `Month: ${budget.month}\n`;
      txt += `Total Budget: ${abbreviateNumber(budget.totalBudget)}\n`;
      txt += 'Category Budgets:\n';

      Object.entries(budget.categories).forEach(([category, amount]) => {
        if (amount !== undefined) {
          txt += `  - ${category.charAt(0).toUpperCase() + category.slice(1)}: ${abbreviateNumber(amount)}\n`;
        }
      });

      txt += '\n' + '-'.repeat(80) + '\n\n';
    });

    const blob = new Blob([txt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budgets_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Budgets exported to TXT');
  };

  return (
    <PageWrapper>
      <div className="py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="heading-page">Budget Management</h1>
          <p className="text-secondary">Create and track your monthly budgets</p>
        </div>

        {/* KPI Cards - Mobile optimized */}
        <div className="grid-responsive-4 mb-10 md:mb-16">
          <div className="kpi-card">
            <p className="kpi-label text-blue-400">Total Budgets</p>
            <p className="kpi-value text-white">{kpiStats.totalBudgets}</p>
            <p className="kpi-subtitle text-slate-400">Active monthly budgets</p>
          </div>

          <div className="kpi-card">
            <p className="kpi-label text-green-400">Total Budget</p>
            <p className="kpi-value text-white">{abbreviateNumber(kpiStats.totalBudgetAmount)}</p>
            <p className="kpi-subtitle text-slate-400">Allocated amount</p>
          </div>

          <div className="kpi-card">
            <p className="kpi-label text-red-400">Total Spent</p>
            <p className="kpi-value text-white">{abbreviateNumber(kpiStats.totalSpent)}</p>
            <p className="kpi-subtitle text-slate-400">Across all months</p>
          </div>

          <div className="kpi-card">
            <p className="kpi-label text-amber-400">Remaining</p>
            <p className={`kpi-value ${kpiStats.remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {abbreviateNumber(kpiStats.remaining)}
            </p>
            <p className="kpi-subtitle text-slate-400">Unspent balance</p>
          </div>
        </div>

        {/* Action Buttons - Always visible */}
        <div className="flex gap-3 mb-10 md:mb-12 flex-wrap">
          <button
            onClick={() => {
              setIsAddModalOpen(true);
              setFormStep(1);
              setFormData({
                month: new Date().toISOString().slice(0, 7),
                totalBudget: '',
                food: '',
                transport: '',
                utilities: '',
                entertainment: '',
                shopping: '',
                health: '',
                other: '',
              });
            }}
            className="btn btn-primary shadow-lg shadow-blue-500/20"
            aria-label="Add new budget"
          >
            + Create Budget
          </button>
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary border-green-500/20 hover:border-green-500/40 text-green-400"
            aria-label="Export budgets to CSV file"
          >
            📥 CSV
          </button>
          <button
            onClick={handleExportTXT}
            className="btn btn-secondary border-purple-500/20 hover:border-purple-500/40 text-purple-400"
            aria-label="Export budgets to text file"
          >
            📄 TXT
          </button>
        </div>

        {/* Add Budget Modal */}
        <FormModal
          isOpen={isAddModalOpen}
          title={formStep === 1 ? 'Create Budget - Step 1' : 'Create Budget - Step 2'}
          onClose={() => {
            setIsAddModalOpen(false);
            setFormStep(1);
          }}
          onSubmit={formStep === 1 ? async (e) => {
            e.preventDefault();
            setFormStep(2);
          } : handleSubmit}
          submitText={formStep === 1 ? 'Next' : 'Create'}
          cancelText="Cancel"
          isLoading={isLoading}
        >
          {/* Step 1: Basic Info */}
          {formStep === 1 && (
            <>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                  Month <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm ${errors.month ? 'border-red-500' : 'border-gray-600'
                    }`}
                  required
                />
                {errors.month && <p className="text-red-400 text-xs mt-1">{errors.month}</p>}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                  Total Budget <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="totalBudget"
                  value={formData.totalBudget}
                  onChange={handleChange}
                  placeholder="Enter total budget"
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-sm ${errors.totalBudget ? 'border-red-500' : 'border-gray-600'
                    }`}
                  step="0.01"
                  min="0"
                  required
                />
                {errors.totalBudget && <p className="text-red-400 text-xs mt-1">{errors.totalBudget}</p>}
              </div>
            </>
          )}

          {/* Step 2: Category Budgets */}
          {formStep === 2 && (
            <>
              <p className="text-xs md:text-sm font-medium text-gray-300 mb-3">Category Budgets (Optional)</p>

              <div className="grid grid-cols-2 gap-2">
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
                      placeholder="0"
                      className={`w-full px-2 py-1 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-xs ${errors[category] ? 'border-red-500' : 'border-gray-600'
                        }`}
                      step="0.01"
                      min="0"
                    />
                    {errors[category] && <p className="text-red-400 text-xs mt-0.5">{errors[category]}</p>}
                  </div>
                ))}
              </div>

              {/* Budget Summary */}
              {totalBudgetAmount > 0 && (
                <div className="mt-4 p-3 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Total</p>
                      <p className="text-white font-semibold">{abbreviateNumber(totalBudgetAmount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Categories</p>
                      <p className={`font-semibold ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
                        {abbreviateNumber(categoryTotal)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Remaining</p>
                      <p className={`font-semibold ${remaining < 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {abbreviateNumber(remaining)}
                      </p>
                    </div>
                  </div>
                  {isOverBudget && (
                    <p className="text-red-400 text-xs mt-2">⚠️ Categories exceed total</p>
                  )}
                </div>
              )}

              {/* Back button for Step 2 */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFormStep(1)}
                  className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium text-sm"
                  aria-label="Go back to previous step"
                >
                  Back
                </button>
              </div>
            </>
          )}
        </FormModal>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by month..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 md:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
          />
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-3 md:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        {/* Analytics Section */}
        {budgets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg md:text-2xl font-bold text-white mb-4">Analytics</h2>
            <BudgetAnalytics budgets={budgets} expenses={expenses} />
          </div>
        )}

        {/* Budgets Card View - Mobile optimized */}
        {isPageLoading ? (
          <SkeletonLoader type="card" count={3} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4" />
        ) : filteredBudgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filteredBudgets.map((budget) => (
              <div key={budget.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs md:text-sm text-slate-400">Month</p>
                    <p className="text-base md:text-lg font-bold text-white">{budget.month}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs md:text-sm text-slate-400">Total</p>
                    <p className="text-base md:text-lg font-bold text-green-400">{abbreviateNumber(budget.totalBudget)}</p>
                  </div>
                </div>

                {/* Budget Meter */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-gray-400">Budget Usage</p>
                    <p className="text-xs font-semibold text-white">
                      {Object.values(budget.categories).filter(v => v !== undefined).length} categories
                    </p>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${Object.values(budget.categories).reduce((sum, v) => sum + (v || 0), 0) > budget.totalBudget
                        ? 'bg-red-500'
                        : 'bg-green-500'
                        }`}
                      style={{
                        width: `${Math.min(
                          (Object.values(budget.categories).reduce((sum, v) => sum + (v || 0), 0) / budget.totalBudget) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t border-gray-700">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="flex-1 px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
                    aria-label={`Edit budget for ${budget.month}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(budget.id, budget.month)}
                    className="flex-1 px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-medium"
                    aria-label={`Delete budget for ${budget.month}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 md:p-8 text-center">
            <p className="text-gray-400 text-sm md:text-base">
              {budgets.length === 0 ? 'No budgets yet. Create one to get started!' : 'No budgets match your search.'}
            </p>
          </div>
        )}

        {/* Summary */}
        {filteredBudgets.length > 0 && (
          <div className="mt-6 bg-gray-800 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm text-gray-300">
              Showing <span className="font-semibold text-white">{filteredBudgets.length}</span> of{' '}
              <span className="font-semibold text-white">{budgets.length}</span> budgets
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedBudget && (
        <EditBudgetModal
          budget={selectedBudget}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedBudget(null);
          }}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Budget?"
        message={`Are you sure you want to delete the budget for ${confirmDialog.budgetMonth}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, budgetId: '', budgetMonth: '' })}
      />
    </PageWrapper>
  );
}

