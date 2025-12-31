'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import PageWrapper from '@/components/PageWrapper';
import EditGoalModal from '@/components/EditGoalModal';
import GoalAnalytics from '@/components/GoalAnalytics';
import ConfirmDialog from '@/components/ConfirmDialog';
import type { Goal } from '@/types';

// Helper function to abbreviate numbers
const abbreviateNumber = (num: number): string => {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
  return `₹${num.toFixed(0)}`;
};

export default function GoalsPage() {
  const { goals, removeGoal, addGoal } = useAppStore();
  const { success, error } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    goalId: '',
    goalName: '',
  });
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    category: 'emergency' as const,
    priority: 'medium' as const,
    notes: '',
  });

  const categories = ['emergency', 'vacation', 'vehicle', 'property', 'education', 'other'];
  const priorities = ['high', 'medium', 'low'];

  // Filter goals
  const filteredGoals = useMemo(() => {
    return goals.filter((goal) => {
      const matchesSearch = goal.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filterCategory || goal.category === filterCategory;
      const matchesPriority = !filterPriority || goal.priority === filterPriority;
      return matchesSearch && matchesCategory && matchesPriority;
    });
  }, [goals, searchTerm, filterCategory, filterPriority]);

  const kpiStats = useMemo(() => {
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalRemaining = totalTarget - totalSaved;
    const completedGoals = goals.filter((g) => g.currentAmount >= g.targetAmount).length;

    return {
      totalGoals: goals.length,
      completedGoals,
      totalTarget,
      totalSaved,
      totalRemaining,
    };
  }, [goals]);

  const handleEdit = (goal: typeof goals[0]) => {
    setSelectedGoal(goal);
    setIsEditModalOpen(true);
  };

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
      if (!formData.name || !formData.targetAmount || !formData.targetDate) {
        error('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      const targetAmount = parseFloat(formData.targetAmount);
      const currentAmount = formData.currentAmount ? parseFloat(formData.currentAmount) : 0;

      if (isNaN(targetAmount) || targetAmount <= 0) {
        error('Target amount must be a valid positive number');
        setIsLoading(false);
        return;
      }

      const newGoal = {
        id: `goal_${Date.now()}`,
        name: formData.name,
        targetAmount,
        currentAmount,
        targetDate: new Date(formData.targetDate),
        category: formData.category,
        priority: formData.priority,
        notes: formData.notes || undefined,
      };

      addGoal(newGoal);
      success('Goal created successfully');

      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        category: 'emergency',
        priority: 'medium',
        notes: '',
      });

      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error adding goal:', err);
      error('Failed to add goal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      goalId: id,
      goalName: name,
    });
  };

  const handleConfirmDelete = () => {
    if (confirmDialog.goalId) {
      removeGoal(confirmDialog.goalId);
      success('Goal deleted successfully');
      setConfirmDialog({ isOpen: false, goalId: '', goalName: '' });
    }
  };

  const handleExportCSV = () => {
    if (filteredGoals.length === 0) {
      error('No goals to export');
      return;
    }

    let csv = 'Name,Category,Priority,Target Amount,Current Amount,Remaining,Progress %,Target Date\n';

    filteredGoals.forEach((goal) => {
      const remaining = goal.targetAmount - goal.currentAmount;
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      const targetDate = goal.targetDate instanceof Date 
        ? goal.targetDate.toISOString().split('T')[0]
        : new Date(goal.targetDate).toISOString().split('T')[0];
      
      csv += `"${goal.name}","${goal.category}","${goal.priority}",${goal.targetAmount},${goal.currentAmount},${remaining},${progress.toFixed(2)},"${targetDate}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goals_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Goals exported to CSV');
  };

  const handleExportTXT = () => {
    if (filteredGoals.length === 0) {
      error('No goals to export');
      return;
    }

    let txt = 'GOALS REPORT\n';
    txt += `Generated: ${new Date().toLocaleString()}\n`;
    txt += '='.repeat(80) + '\n\n';

    filteredGoals.forEach((goal) => {
      const remaining = goal.targetAmount - goal.currentAmount;
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      const targetDate = goal.targetDate instanceof Date 
        ? goal.targetDate.toLocaleDateString()
        : new Date(goal.targetDate).toLocaleDateString();

      txt += `Goal: ${goal.name}\n`;
      txt += `Category: ${goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}\n`;
      txt += `Priority: ${goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}\n`;
      txt += `Target Amount: ₹${goal.targetAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
      txt += `Current Amount: ₹${goal.currentAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
      txt += `Remaining: ₹${remaining.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
      txt += `Progress: ${progress.toFixed(2)}%\n`;
      txt += `Target Date: ${targetDate}\n`;
      
      if (goal.notes) {
        txt += `Notes: ${goal.notes}\n`;
      }

      txt += '\n' + '-'.repeat(80) + '\n\n';
    });

    const blob = new Blob([txt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `goals_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Goals exported to TXT');
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-3">
          <div>
            <h1 className="heading-page">🎯 Goals</h1>
            <p className="text-secondary">Track and manage your financial goals</p>
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
              onClick={() => {
                setIsAddModalOpen(true);
                setFormData({
                  name: '',
                  targetAmount: '',
                  currentAmount: '',
                  targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                  category: 'emergency',
                  priority: 'medium',
                  notes: '',
                });
              }}
              className="flex-1 md:flex-none btn btn-primary"
              aria-label="Add new goal"
            >
              + Add
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid-responsive-4 mb-6 md:mb-8">
          <div className="card">
            <p className="text-slate-400 text-xs mb-1">Total Goals</p>
            <p className="text-lg md:text-2xl font-bold text-blue-400">{kpiStats.totalGoals}</p>
          </div>

          <div className="card">
            <p className="text-slate-400 text-xs mb-1">Completed</p>
            <p className="text-lg md:text-2xl font-bold text-green-400">{kpiStats.completedGoals}</p>
          </div>

          <div className="card">
            <p className="text-slate-400 text-xs mb-1">Total Target</p>
            <p className="text-lg md:text-2xl font-bold text-purple-400">{abbreviateNumber(kpiStats.totalTarget)}</p>
          </div>

          <div className="card">
            <p className="text-slate-400 text-xs mb-1">Total Saved</p>
            <p className="text-lg md:text-2xl font-bold text-green-500">{abbreviateNumber(kpiStats.totalSaved)}</p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2 mb-4 md:mb-6 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-2 rounded-lg transition font-semibold text-xs md:text-sm"
            aria-label="Export goals to CSV file"
          >
            📥 CSV
          </button>
          <button
            onClick={handleExportTXT}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 md:px-4 py-2 rounded-lg transition font-semibold text-xs md:text-sm"
            aria-label="Export goals to text file"
          >
            📥 TXT
          </button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 mb-6">
          <input
            type="text"
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 md:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-xs md:text-sm"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 md:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-xs md:text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 md:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 text-xs md:text-sm"
          >
            <option value="">All Priorities</option>
            {priorities.map((pri) => (
              <option key={pri} value={pri}>
                {pri.charAt(0).toUpperCase() + pri.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Analytics Section */}
        {showAnalytics && goals.length > 0 && (
          <div className="mb-6 md:mb-8">
            <GoalAnalytics goals={goals} />
          </div>
        )}

        {/* Goals Card View */}
        <div className="space-y-2 md:space-y-3">
          {filteredGoals.length > 0 ? (
            filteredGoals.map((goal) => {
              const remaining = goal.targetAmount - goal.currentAmount;
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const targetDate = goal.targetDate instanceof Date 
                ? goal.targetDate.toLocaleDateString()
                : new Date(goal.targetDate).toLocaleDateString();

              return (
      <div
                  key={goal.id}
                  className="card hover:border-slate-600"
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm md:text-base truncate">{goal.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
                        {' • '}
                        <span className={`font-semibold ${
                          goal.priority === 'high' ? 'text-red-400' :
                          goal.priority === 'medium' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                        </span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-base md:text-lg font-bold text-blue-400">{abbreviateNumber(goal.targetAmount)}</p>
                      <p className="text-xs md:text-sm font-semibold text-gray-400">{progress.toFixed(0)}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="w-full bg-gray-700 rounded-full h-2 md:h-2.5">
                      <div
                        className={`h-full rounded-full transition-all ${progress >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Goal Details */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs md:text-sm">
                    <div>
                      <p className="text-gray-400">Saved</p>
                      <p className="text-white font-semibold">{abbreviateNumber(goal.currentAmount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Remaining</p>
                      <p className="text-blue-400 font-semibold">{abbreviateNumber(remaining)}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mb-3">Target: {targetDate}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 md:px-3 py-1 md:py-2 rounded transition text-xs md:text-sm font-medium"
                      aria-label={`Edit goal ${goal.name}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(goal.id, goal.name)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 md:px-3 py-1 md:py-2 rounded transition text-xs md:text-sm font-medium"
                      aria-label={`Delete goal ${goal.name}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-gray-800 p-6 md:p-8 rounded-lg border border-gray-700 text-center text-gray-400">
              <p className="text-sm md:text-base">{goals.length === 0 ? 'No goals yet. Create one to get started!' : 'No goals match your search'}</p>
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredGoals.length > 0 && (
          <div className="mt-4 md:mt-6 bg-gray-800 rounded-lg p-3 md:p-4 border border-gray-700">
            <p className="text-xs md:text-sm text-gray-300">
              Showing <span className="font-semibold text-white">{filteredGoals.length}</span> of{' '}
              <span className="font-semibold text-white">{goals.length}</span> goals
            </p>
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-50">
          <div className="bg-gray-800 rounded-lg p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Add Goal</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">
                  Goal Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Emergency Fund"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-xs md:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-xs md:text-sm"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-xs md:text-sm"
                  required
                >
                  {priorities.map((pri) => (
                    <option key={pri} value={pri}>
                      {pri.charAt(0).toUpperCase() + pri.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">
                  Target Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="targetDate"
                  value={formData.targetDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-xs md:text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">
                    Target <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    placeholder="Amount"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-xs md:text-sm"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">
                    Current
                  </label>
                  <input
                    type="number"
                    name="currentAmount"
                    value={formData.currentAmount}
                    onChange={handleChange}
                    placeholder="Saved"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-xs md:text-sm"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add notes..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none text-xs md:text-sm"
                  rows={2}
                />
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setFormData({
                      name: '',
                      targetAmount: '',
                      currentAmount: '',
                      targetDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                      category: 'emergency',
                      priority: 'medium',
                      notes: '',
                    });
                  }}
                  className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition font-medium text-xs md:text-sm disabled:opacity-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-xs md:text-sm disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {selectedGoal && (
        <EditGoalModal
          goal={selectedGoal}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedGoal(null);
          }}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Goal?"
        message={`Are you sure you want to delete the goal "${confirmDialog.goalName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, goalId: '', goalName: '' })}
      />
    </div>
    </PageWrapper>
  );
}

