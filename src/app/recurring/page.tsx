'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';

export default function RecurringTransactionsPage() {
  const { recurringTransactions, addRecurringTransaction, removeRecurringTransaction, updateRecurringTransaction } = useAppStore();
  const { success, error } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModalInline, setShowModalInline] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'expense' as 'expense' | 'income',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    category: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true,
  });

  const filteredTransactions = useMemo(() => {
    return recurringTransactions.filter((trans) => {
      const matchesSearch = trans.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || trans.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [recurringTransactions, searchTerm, filterType]);

  const kpiStats = useMemo(() => {
    const activeTransactions = recurringTransactions.filter((t) => t.isActive);
    const expenses = recurringTransactions.filter((t) => t.type === 'expense');
    const income = recurringTransactions.filter((t) => t.type === 'income');

    const totalExpenseAmount = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncomeAmount = income.reduce((sum, t) => sum + t.amount, 0);
    const netAmount = totalIncomeAmount - totalExpenseAmount;

    return {
      totalRecurring: recurringTransactions.length,
      activeRecurring: activeTransactions.length,
      totalExpenseAmount,
      totalIncomeAmount,
      netAmount,
    };
  }, [recurringTransactions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddRecurring = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.amount || !formData.category) {
      error('Please fill in all required fields');
      return;
    }

    addRecurringTransaction({
      id: `recurring_${Date.now()}`,
      name: formData.name,
      amount: parseFloat(formData.amount),
      type: formData.type,
      frequency: formData.frequency,
      category: formData.category,
      startDate: new Date(formData.startDate),
      endDate: formData.endDate ? new Date(formData.endDate) : undefined,
      isActive: formData.isActive,
    });

    success('Recurring transaction added successfully');
    setFormData({
      name: '',
      amount: '',
      type: 'expense',
      frequency: 'monthly',
      category: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isActive: true,
    });
    setIsAddModalOpen(false);
  };

  const handleEditRecurring = (id: string) => {
    const transaction = recurringTransactions.find((trans) => trans.id === id);
    if (transaction) {
      setFormData({
        name: transaction.name,
        amount: transaction.amount.toString(),
        type: transaction.type,
        frequency: transaction.frequency,
        category: transaction.category,
        startDate: transaction.startDate instanceof Date 
          ? transaction.startDate.toISOString().split('T')[0]
          : new Date(transaction.startDate).toISOString().split('T')[0],
        endDate: transaction.endDate 
          ? (transaction.endDate instanceof Date 
              ? transaction.endDate.toISOString().split('T')[0]
              : new Date(transaction.endDate).toISOString().split('T')[0])
          : '',
        isActive: transaction.isActive,
      });
      setEditingId(id);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.amount || !formData.category) {
      error('Please fill in all required fields');
      return;
    }

    if (editingId) {
      updateRecurringTransaction(editingId, {
        name: formData.name,
        amount: parseFloat(formData.amount),
        type: formData.type,
        frequency: formData.frequency,
        category: formData.category,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        isActive: formData.isActive,
      });
      success('Recurring transaction updated successfully');
      setEditingId(null);
      setFormData({
        name: '',
        amount: '',
        type: 'expense',
        frequency: 'monthly',
        category: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isActive: true,
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this recurring transaction?')) {
      removeRecurringTransaction(id);
      success('Recurring transaction deleted successfully');
    }
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    const transaction = recurringTransactions.find((trans) => trans.id === id);
    if (transaction) {
      updateRecurringTransaction(id, {
        ...transaction,
        isActive: !currentStatus,
      });
      success(`Recurring transaction ${!currentStatus ? 'activated' : 'deactivated'}`);
    }
  };

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
      error('No recurring transactions to export');
      return;
    }

    let csv = 'Description,Amount,Type,Frequency,Category,Start Date,End Date,Active\n';
    filteredTransactions.forEach((trans) => {
      const startDate = trans.startDate instanceof Date ? trans.startDate.toLocaleDateString() : new Date(trans.startDate).toLocaleDateString();
      const endDate = trans.endDate 
        ? (trans.endDate instanceof Date ? trans.endDate.toLocaleDateString() : new Date(trans.endDate).toLocaleDateString())
        : 'N/A';
      csv += `"${trans.name}","${trans.amount}","${trans.type}","${trans.frequency}","${trans.category}","${startDate}","${endDate}","${trans.isActive}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recurring_transactions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Recurring transactions exported to CSV');
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Recurring Transactions</h1>
          <p className="text-gray-400">Set up and manage recurring expenses and income</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
          <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-xs md:text-sm mb-2">Total Recurring</p>
            <p className="text-2xl md:text-3xl font-bold text-blue-400">{kpiStats.totalRecurring}</p>
          </div>

          <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-xs md:text-sm mb-2">Active</p>
            <p className="text-2xl md:text-3xl font-bold text-green-400">{kpiStats.activeRecurring}</p>
          </div>

          <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-xs md:text-sm mb-2">Total Expenses</p>
            <p className="text-2xl md:text-3xl font-bold text-red-400">
              ₹{kpiStats.totalExpenseAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-xs md:text-sm mb-2">Total Income</p>
            <p className="text-2xl md:text-3xl font-bold text-green-500">
              ₹{kpiStats.totalIncomeAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {
              setShowModalInline(true);
              setEditingId(null);
              setFormData({
                name: '',
                amount: '',
                type: 'expense',
                frequency: 'monthly',
                category: '',
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                isActive: true,
              });
            }}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Add Recurring
          </button>
          <button
            onClick={handleExportCSV}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            ↓ Export CSV
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search recurring transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'expense' | 'income')}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Add/Edit Modal - Fixed Position */}
        {isAddModalOpen || editingId ? (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-4">
                {editingId ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}
              </h2>

              <form onSubmit={editingId ? handleSaveEdit : handleAddRecurring} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Monthly Rent"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Frequency</label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Rent"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date (Optional)</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-300">Active</label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {editingId ? 'Update' : 'Add'} Transaction
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingId(null);
                      setFormData({
                        name: '',
                        amount: '',
                        type: 'expense',
                        frequency: 'monthly',
                        category: '',
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: '',
                        isActive: true,
                      });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {/* Add/Edit Modal - Inline */}
        {showModalInline && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              {editingId ? 'Edit Recurring Transaction' : 'Add Recurring Transaction'}
            </h2>

            <form onSubmit={editingId ? handleSaveEdit : handleAddRecurring} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Monthly Rent"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Frequency</label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Rent"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date (Optional)</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-300">Active</label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingId ? 'Update' : 'Add'} Transaction
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModalInline(false);
                    setEditingId(null);
                    setFormData({
                      name: '',
                      amount: '',
                      type: 'expense',
                      frequency: 'monthly',
                      category: '',
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: '',
                      isActive: true,
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {filteredTransactions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTransactions.map((transaction) => {
              const startDate = transaction.startDate instanceof Date 
                ? transaction.startDate.toLocaleDateString() 
                : new Date(transaction.startDate).toLocaleDateString();
              const endDate = transaction.endDate 
                ? (transaction.endDate instanceof Date 
                    ? transaction.endDate.toLocaleDateString() 
                    : new Date(transaction.endDate).toLocaleDateString())
                : 'No end date';

              return (
                <div
                  key={transaction.id}
                  className={`rounded-lg p-6 transition-opacity ${
                    transaction.isActive ? 'bg-gray-800' : 'bg-gray-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{transaction.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{transaction.category}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        transaction.type === 'expense'
                          ? 'bg-red-600 text-white'
                          : 'bg-green-600 text-white'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-300">
                    <p>
                      <span className="text-gray-400">Amount:</span> ₹
                      {transaction.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </p>
                    <p>
                      <span className="text-gray-400">Frequency:</span> {transaction.frequency}
                    </p>
                    <p>
                      <span className="text-gray-400">Start:</span> {startDate}
                    </p>
                    <p>
                      <span className="text-gray-400">End:</span> {endDate}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => handleToggleActive(transaction.id, transaction.isActive)}
                      className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                        transaction.isActive
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {transaction.isActive ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      onClick={() => handleEditRecurring(transaction.id)}
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">
              {recurringTransactions.length === 0
                ? 'No recurring transactions yet. Create one to get started!'
                : 'No recurring transactions match your search.'}
            </p>
          </div>
        )}

        {filteredTransactions.length > 0 && (
          <div className="mt-6 bg-gray-800 rounded-lg p-4">
            <p className="text-gray-300">
              Showing <span className="font-semibold text-white">{filteredTransactions.length}</span> of{' '}
              <span className="font-semibold text-white">{recurringTransactions.length}</span> recurring transactions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
