'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import PageWrapper from '@/components/PageWrapper';
import { useToast } from '@/lib/toastContext';
import AddIncomeModal from '@/components/AddIncomeModal';
import EditIncomeModal from '@/components/EditIncomeModal';
import IncomeAnalytics from '@/components/IncomeAnalytics';
import ConfirmDialog from '@/components/ConfirmDialog';
import { incomeService } from '@/lib/firebaseService';
import type { Income } from '@/types';

export default function IncomePage() {
  const router = useRouter();
  const { info, success, error } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    incomeId: '',
    incomeDescription: '',
  });

  const user = useAppStore((state) => state.user);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const incomeList = useAppStore((state) => state.income);
  const setIncome = useAppStore((state) => state.setIncome);
  const removeIncome = useAppStore((state) => state.removeIncome);
  const addIncome = useAppStore((state) => state.addIncome);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const loadIncome = async () => {
      if (user?.uid) {
        try {
          const incomeData = await incomeService.getAll(user.uid);
          setIncome(incomeData);
        } catch (err) {
          console.error('Error loading income:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadIncome();
  }, [user, isAuthenticated, router, setIncome]);

  const handleAddIncome = async (income: Income) => {
    if (!user) return;
    try {
      const incomeId = await incomeService.create(income, user.uid);
      addIncome({ ...income, id: incomeId });
      success('Income added successfully');
    } catch (err) {
      error('Failed to add income');
      console.error(err);
    }
  };

  const handleDeleteIncome = async (incomeId: string) => {
    if (!user) return;
    setIsDeleting(true);
    try {
      await incomeService.delete(user.uid, incomeId);
      removeIncome(incomeId);
      success('Income deleted successfully');
      setConfirmDialog({ isOpen: false, incomeId: '', incomeDescription: '' });
    } catch (err) {
      error('Failed to delete income');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = (incomeId: string, description: string) => {
    setConfirmDialog({
      isOpen: true,
      incomeId,
      incomeDescription: description,
    });
  };

  const handleConfirmDelete = () => {
    if (confirmDialog.incomeId) {
      handleDeleteIncome(confirmDialog.incomeId);
    }
  };

  const handleEditIncome = (income: Income) => {
    setEditingIncome(income);
    setIsEditModalOpen(true);
  };

  const handleSaveIncome = async (updatedIncome: Income) => {
    if (!user) return;
    try {
      await incomeService.update(user.uid, updatedIncome.id, updatedIncome);
      const updateIncomeAction = useAppStore.getState().updateIncome;
      updateIncomeAction(updatedIncome.id, updatedIncome);
      success('Income updated successfully');
      setIsEditModalOpen(false);
      setEditingIncome(null);
    } catch (err) {
      error('Failed to update income');
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const sortedIncome = [...incomeList].reverse();
    if (sortedIncome.length === 0) {
      info('No income to export');
      return;
    }

    const headers = ['Date', 'Description', 'Source', 'Amount', 'Category'];
    const rows = sortedIncome.map((inc) => [
      new Date(inc.date).toLocaleDateString(),
      inc.description,
      inc.source,
      inc.amount,
      inc.category || 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `income-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Income exported successfully');
  };

  const handleExportReport = () => {
    const sortedIncome = [...incomeList].reverse();
    if (sortedIncome.length === 0) {
      info('No income to generate report');
      return;
    }

    const totalAmount = sortedIncome.reduce((sum, i) => sum + i.amount, 0);
    const avgAmount = totalAmount / sortedIncome.length;

    const reportContent = `INCOME REPORT\nGenerated: ${new Date().toLocaleString()}\n\nSUMMARY\n-------\nTotal Income: ₹${totalAmount.toLocaleString()}\nNumber of Entries: ${sortedIncome.length}\nAverage Income: ₹${avgAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}\n\nDETAILS\n-------\n${sortedIncome.map((inc) => `${new Date(inc.date).toLocaleDateString()} | ${inc.description} | ${inc.source} | ₹${inc.amount}`).join('\n')}`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `income-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Report generated successfully');
  };

  const totalIncome = incomeList.reduce((sum, i) => sum + i.amount, 0);
  const sortedIncome = [...incomeList].reverse();

  return (
    <PageWrapper>
      <div className="py-4 sm:py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-3">
          <div>
            <h1 className="heading-page">💵 Income</h1>
            <p className="text-secondary">Track all your income sources</p>
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
              aria-label="Add new income"
            >
              + Add
            </button>
          </div>
        </div>

        {!showAnalytics && (
          <div className="grid-responsive-3 mb-10 md:mb-16">
            <div className="kpi-card">
              <p className="kpi-label text-green-400">Total Income</p>
              <p className="kpi-value text-white">₹{(totalIncome / 1000).toFixed(0)}K</p>
              <p className="kpi-subtitle text-slate-400">Cumulative total</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label text-blue-400">Entries</p>
              <p className="kpi-value text-white">{incomeList.length}</p>
              <p className="kpi-subtitle text-slate-400">Total transactions</p>
            </div>
            <div className="kpi-card">
              <p className="kpi-label text-purple-400">Average</p>
              <p className="kpi-value text-white">₹{incomeList.length > 0 ? (totalIncome / incomeList.length / 1000).toFixed(1) : '0'}K</p>
              <p className="kpi-subtitle text-slate-400">Per transaction</p>
            </div>
          </div>
        )}

        {showAnalytics && <div className="mb-6 md:mb-8"><IncomeAnalytics income={sortedIncome} /></div>}

        {isModalOpen && <div className="mb-6 md:mb-8"><AddIncomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddIncome={handleAddIncome} /></div>}

        <EditIncomeModal isOpen={isEditModalOpen} income={editingIncome} onClose={() => { setIsEditModalOpen(false); setEditingIncome(null); }} onSave={handleSaveIncome} />

        <div className="flex gap-3 mb-8 md:mb-12 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary border-green-500/20 hover:border-green-500/40 text-green-400"
            aria-label="Export income to CSV file"
          >
            📥 CSV
          </button>
          <button
            onClick={handleExportReport}
            className="btn btn-secondary border-blue-500/20 hover:border-blue-500/40 text-blue-400"
            aria-label="Export income report to text file"
          >
            📊 Report
          </button>
        </div>

        <div className="space-y-2 md:space-y-3">
          {isLoading ? (
            <div className="bg-slate-800 p-6 md:p-8 rounded-lg border border-slate-700 text-center text-slate-300">
              <p className="text-sm md:text-base">Loading income...</p>
            </div>
          ) : sortedIncome.length === 0 ? (
            <div className="bg-slate-800 p-6 md:p-8 rounded-lg border border-slate-700 text-center text-slate-300">
              <p className="text-sm md:text-base">No income found</p>
              <p className="text-xs md:text-sm mt-2">Add your first income to get started</p>
            </div>
          ) : (
            sortedIncome.map((inc) => (
              <div key={inc.id} className="bg-slate-800 p-3 md:p-4 rounded-lg border border-slate-700 hover:border-slate-600 transition">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <span className="text-xl md:text-2xl flex-shrink-0">
                      {inc.source === 'salary' ? '💼' : inc.source === 'freelance' ? '🎨' : inc.source === 'investment' ? '📈' : inc.source === 'gift' ? '🎁' : inc.source === 'bonus' ? '🏆' : '📌'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm md:text-base truncate">{inc.description}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(inc.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-base md:text-lg font-bold text-green-400">₹{inc.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="bg-slate-700 text-slate-200 px-2 py-1 rounded text-xs font-medium capitalize">{inc.source}</span>
                  {inc.category && <span className="bg-slate-700 text-slate-200 px-2 py-1 rounded text-xs font-medium">{inc.category}</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditIncome(inc)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 md:px-3 py-1 rounded transition text-xs md:text-sm"
                    aria-label={`Edit income ${inc.description}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(inc.id, inc.description)}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 md:px-3 py-1 rounded transition text-xs md:text-sm disabled:opacity-50"
                    aria-label={`Delete income ${inc.description}`}
                  >
                    {isDeleting ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {sortedIncome.length > 0 && (
          <div className="mt-12 md:mt-16 card overflow-hidden border-slate-700/50">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center md:text-left">
              <div>
                <p className="kpi-label text-slate-400">Total Income</p>
                <p className="kpi-value text-white">₹{totalIncome.toLocaleString()}</p>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-slate-700/50 pt-6 md:pt-0 md:pl-8">
                <p className="kpi-label text-slate-400">Entries</p>
                <p className="kpi-value text-white">{sortedIncome.length}</p>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-slate-700/50 pt-6 md:pt-0 md:pl-8">
                <p className="kpi-label text-slate-400">Average</p>
                <p className="kpi-value text-white">
                  ₹{Math.round(totalIncome / sortedIncome.length).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Income?"
        message={`Are you sure you want to delete the income "${confirmDialog.incomeDescription}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, incomeId: '', incomeDescription: '' })}
      />
    </PageWrapper>
  );
}



