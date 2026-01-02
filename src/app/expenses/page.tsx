'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import PageWrapper from '@/components/PageWrapper';
import { useToast } from '@/lib/toastContext';
import AddExpenseModal from '@/components/AddExpenseModal';
import EditExpenseModal from '@/components/EditExpenseModal';
import AdvancedFilterPanel from '@/components/AdvancedFilterPanel';
import ExpenseAnalytics from '@/components/ExpenseAnalytics';
import ConfirmDialog from '@/components/ConfirmDialog';
import { expenseService } from '@/lib/firebaseService';
import type { Expense } from '@/types';

interface FilterOptions {
  dateFrom: string;
  dateTo: string;
  categories: string[];
  paymentMethods: string[];
  amountMin: string;
  amountMax: string;
  searchText: string;
}

export default function ExpensesPage() {
  const router = useRouter();
  const { info, success, error } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    expenseId: '',
    expenseDescription: '',
  });
  const [filters, setFilters] = useState<FilterOptions>({
    dateFrom: '',
    dateTo: '',
    categories: [],
    paymentMethods: [],
    amountMin: '',
    amountMax: '',
    searchText: '',
  });
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const user = useAppStore((state) => state.user);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const expenses = useAppStore((state) => state.expenses);
  const categories = useAppStore((state) => state.categories);
  const setExpenses = useAppStore((state) => state.setExpenses);
  const removeExpense = useAppStore((state) => state.removeExpense);
  const addExpense = useAppStore((state) => state.addExpense);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const loadExpenses = async () => {
      if (user?.uid) {
        try {
          const expensesData = await expenseService.getAll(user.uid);
          setExpenses(expensesData);
        } catch (error) {
          console.error('Error loading expenses:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadExpenses();
  }, [user, isAuthenticated, router, setExpenses]);

  const handleAddExpense = async (expense: Expense) => {
    if (!user) return;

    try {
      const expenseId = await expenseService.create({
        ...expense,
        id: Date.now().toString(),
      }, user.uid);
      addExpense({
        ...expense,
        id: expenseId,
      });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!user) return;

    setIsDeleting(true);
    try {
      await expenseService.delete(user.uid, expenseId);
      removeExpense(expenseId);
      success('Expense deleted successfully');
      setConfirmDialog({ isOpen: false, expenseId: '', expenseDescription: '' });
    } catch (err) {
      error('Failed to delete expense');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (expenseId: string, description: string) => {
    setConfirmDialog({
      isOpen: true,
      expenseId,
      expenseDescription: description,
    });
  };

  const handleConfirmDelete = () => {
    if (confirmDialog.expenseId) {
      handleDeleteExpense(confirmDialog.expenseId);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleSaveExpense = async (updatedExpense: Expense) => {
    if (!user) return;

    try {
      await expenseService.update(user.uid, updatedExpense.id, updatedExpense);
      const updateExpense = useAppStore.getState().updateExpense;
      updateExpense(updatedExpense.id, updatedExpense);
      success('Expense updated successfully');
      setIsEditModalOpen(false);
      setEditingExpense(null);
    } catch (err) {
      error('Failed to update expense');
      console.error(err);
    }
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    const isActive =
      newFilters.dateFrom ||
      newFilters.dateTo ||
      newFilters.categories.length > 0 ||
      newFilters.paymentMethods.length > 0 ||
      newFilters.amountMin ||
      newFilters.amountMax ||
      newFilters.searchText;
    setHasActiveFilters(!!isActive);
  };

  const applyFilters = (expensesToFilter: typeof expenses) => {
    let filtered = expensesToFilter;

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter((e) => new Date(e.date) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((e) => new Date(e.date) <= toDate);
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter((e) => filters.categories.includes(e.category));
    }

    if (filters.paymentMethods.length > 0) {
      filtered = filtered.filter((e) => filters.paymentMethods.includes(e.paymentMethod));
    }

    if (filters.amountMin) {
      const minAmount = parseFloat(filters.amountMin);
      filtered = filtered.filter((e) => e.amount >= minAmount);
    }
    if (filters.amountMax) {
      const maxAmount = parseFloat(filters.amountMax);
      filtered = filtered.filter((e) => e.amount <= maxAmount);
    }

    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.description.toLowerCase().includes(searchLower) ||
          e.category.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  const filteredExpenses =
    filterCategory === 'all'
      ? applyFilters(expenses)
      : applyFilters(expenses).filter((e) => e.category === filterCategory);

  const sortedExpenses = [...filteredExpenses].reverse();

  const getCategoryEmoji = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.emoji || '📌';
  };

  const handleExportCSV = () => {
    if (sortedExpenses.length === 0) {
      info('No expenses to export');
      return;
    }

    const headers = ['Date', 'Description', 'Category', 'Amount', 'Payment Method'];
    const rows = sortedExpenses.map((exp) => [
      new Date(exp.date).toLocaleDateString(),
      exp.description,
      exp.category,
      exp.amount,
      exp.paymentMethod,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Expenses exported successfully');
  };

  const handleExportReport = () => {
    if (sortedExpenses.length === 0) {
      info('No expenses to generate report');
      return;
    }

    const totalAmount = sortedExpenses.reduce((sum, e) => sum + e.amount, 0);
    const avgAmount = totalAmount / sortedExpenses.length;

    const reportContent = `
EXPENSE REPORT
Generated: ${new Date().toLocaleString()}

SUMMARY
-------
Total Expenses: ₹${totalAmount.toLocaleString()}
Number of Entries: ${sortedExpenses.length}
Average Expense: ₹${avgAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}

DETAILS
-------
${sortedExpenses
        .map(
          (exp) =>
            `${new Date(exp.date).toLocaleDateString()} | ${exp.description} | ${exp.category} | ₹${exp.amount} | ${exp.paymentMethod}`
        )
        .join('\n')}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expense-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Report generated successfully');
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <PageWrapper>
      <div className="py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-block gap-3">
          <div>
            <h1 className="heading-page">💰 Expenses</h1>
            <p className="text-secondary">Track all your expenses</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex-1 md:flex-none btn btn-secondary"
              aria-label={showAnalytics ? 'Hide analytics' : 'Show analytics'}
            >
              {showAnalytics ? '📊 Hide' : '📊 Analytics'}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-none btn btn-primary"
              aria-label="Add new expense"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Stats Cards - 2 col mobile, 3 col desktop */}
        {!showAnalytics && (
          <div className="grid-responsive-3 gap-6 mb-section">
            <div className="card">
              <p className="text-slate-400 text-xs mb-1">Total Expenses</p>
              <p className="text-lg md:text-2xl font-bold text-red-400">₹{(totalExpenses / 1000).toFixed(0)}K</p>
            </div>
            <div className="card">
              <p className="text-slate-400 text-xs mb-1">Entries</p>
              <p className="text-lg md:text-2xl font-bold text-blue-400">{expenses.length}</p>
            </div>
            <div className="card col-span-2 lg:col-span-1">
              <p className="text-slate-400 text-xs mb-1">Average</p>
              <p className="text-lg md:text-2xl font-bold text-purple-400">
                ₹{expenses.length > 0 ? (totalExpenses / expenses.length).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '0'}
              </p>
            </div>
          </div>
        )}

        {/* Analytics Section */}
        {showAnalytics && (
          <div className="mb-block">
            <ExpenseAnalytics expenses={sortedExpenses} />
          </div>
        )}

        {/* Form */}
        {isModalOpen && (
          <div className="mb-block">
            <AddExpenseModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onAddExpense={handleAddExpense}
            />
          </div>
        )}

        {/* Edit Modal */}
        <EditExpenseModal
          isOpen={isEditModalOpen}
          expense={editingExpense}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingExpense(null);
          }}
          onSave={handleSaveExpense}
        />

        {/* Filter and Action Buttons */}
        <div className="flex gap-3 mb-block flex-wrap">
          <button
            onClick={() => setIsFilterOpen(true)}
            className={`px-3 md:px-4 py-2 rounded-lg transition font-semibold text-xs md:text-sm ${hasActiveFilters
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-slate-600 hover:bg-slate-500 text-white'
              }`}
            aria-label="Open filters panel"
          >
            🔍 Filters {hasActiveFilters && '✓'}
          </button>
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary border-green-500/20 hover:border-green-500/40 text-green-400"
            aria-label="Export expenses to CSV file"
          >
            📥 CSV
          </button>
          <button
            onClick={handleExportReport}
            className="btn btn-secondary border-blue-500/20 hover:border-blue-500/40 text-blue-400"
            aria-label="Export expenses report to text file"
          >
            📊 Report
          </button>
        </div>

        {/* Category Filter Buttons - Horizontal scroll on mobile */}
        <div className="mb-block flex gap-3 overflow-x-auto pb-4 px-2 -mx-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-2 rounded-lg transition whitespace-nowrap text-xs md:text-sm ${filterCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.name)}
              className={`px-3 py-2 rounded-lg transition whitespace-nowrap text-xs md:text-sm ${filterCategory === cat.name
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        {/* Expenses List */}
        <div className="space-y-4 md:space-y-6">
          {isLoading ? (
            <div className="card text-center text-slate-300">
              <p className="text-sm md:text-base">Loading expenses...</p>
            </div>
          ) : sortedExpenses.length === 0 ? (
            <div className="card text-center text-slate-300">
              <p className="text-sm md:text-base">No expenses found</p>
              <p className="text-xs md:text-sm mt-2">
                {filterCategory === 'all'
                  ? 'Add your first expense to get started'
                  : 'No expenses in this category'}
              </p>
            </div>
          ) : (
            sortedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="card hover:border-slate-600"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <span className="text-xl md:text-2xl flex-shrink-0">
                      {getCategoryEmoji(expense.category)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm md:text-base truncate">
                        {expense.description}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-base md:text-lg font-bold text-red-400">
                      ₹{expense.amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Category and Payment Method Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="bg-slate-700 text-slate-200 px-2 py-1 rounded text-xs font-medium">
                    {getCategoryEmoji(expense.category)} {expense.category}
                  </span>
                  <span className="bg-slate-700 text-slate-200 px-2 py-1 rounded text-xs font-medium">
                    {expense.paymentMethod}
                  </span>
                </div>

                {/* Always visible action buttons on mobile */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditExpense(expense)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 md:px-3 py-1 rounded transition text-xs md:text-sm"
                    aria-label={`Edit expense ${expense.description}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(expense.id, expense.description)}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 md:px-3 py-1 rounded transition text-xs md:text-sm disabled:opacity-50"
                    aria-label={`Delete expense ${expense.description}`}
                  >
                    {isDeleting ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {sortedExpenses.length > 0 && (
          <div className="mt-section card overflow-hidden border-slate-700/50">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center md:text-left">
              <div>
                <p className="kpi-label text-slate-400">Monthly Total</p>
                <p className="kpi-value text-white">
                  ₹{sortedExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-slate-700/50 pt-6 md:pt-0 md:pl-8">
                <p className="kpi-label text-slate-400">Total Entries</p>
                <p className="kpi-value text-white">{sortedExpenses.length}</p>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-slate-700/50 pt-6 md:pt-0 md:pl-8">
                <p className="kpi-label text-slate-400">Average/Day</p>
                <p className="kpi-value text-white">
                  ₹
                  {Math.round(
                    sortedExpenses.reduce((sum, e) => sum + e.amount, 0) /
                    new Date().getDate()
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <AdvancedFilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onFilterChange={handleFilterChange}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Expense?"
        message={`Are you sure you want to delete the expense "${confirmDialog.expenseDescription}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, expenseId: '', expenseDescription: '' })}
      />
    </PageWrapper>
  );
}

