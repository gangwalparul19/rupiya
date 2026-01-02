'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import PageWrapper from '@/components/PageWrapper';

export default function ExpenseSplittingPage() {
  const { splitExpenses, addSplitExpense, removeSplitExpense, updateSplitExpense, addSettlement } = useAppStore();
  const { success, error } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'settled' | 'partial'>('all');
  const [formData, setFormData] = useState({
    description: '',
    totalAmount: '',
    participants: [{ name: '', email: '', amount: '' }],
  });

  const filteredExpenses = useMemo(() => {
    return splitExpenses.filter((exp) => {
      const matchesSearch = exp.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || exp.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [splitExpenses, searchTerm, filterStatus]);

  const handleAddParticipant = () => {
    setFormData((prev) => ({
      ...prev,
      participants: [...prev.participants, { name: '', email: '', amount: '' }],
    }));
  };

  const handleRemoveParticipant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== index),
    }));
  };

  const handleParticipantChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      participants: prev.participants.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      ),
    }));
  };

  const handleAddSplit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || !formData.totalAmount) {
      error('Please fill in all required fields');
      return;
    }

    if (formData.participants.length < 2) {
      error('At least 2 participants are required');
      return;
    }

    const totalAmount = parseFloat(formData.totalAmount);
    const validParticipants = formData.participants.filter((p) => p.name.trim());

    if (validParticipants.length < 2) {
      error('At least 2 participants with names are required');
      return;
    }

    const participants = validParticipants.map((p) => ({
      userId: `user_${Date.now()}_${Math.random()}`,
      name: p.name,
      email: p.email || undefined,
      amount: p.amount ? parseFloat(p.amount) : totalAmount / validParticipants.length,
      settled: false,
    }));

    addSplitExpense({
      id: `split_${Date.now()}`,
      expenseId: `exp_${Date.now()}`,
      createdBy: 'current_user',
      description: formData.description,
      totalAmount,
      currency: 'INR',
      date: new Date(),
      participants,
      status: 'pending',
      createdAt: new Date(),
    });

    success('Split expense created successfully');
    setFormData({
      description: '',
      totalAmount: '',
      participants: [{ name: '', email: '', amount: '' }],
    });
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this split expense?')) {
      removeSplitExpense(id);
      success('Split expense deleted');
    }
  };

  const handleSettleUp = (splitExpenseId: string, fromUserId: string, toUserId: string, amount: number) => {
    addSettlement({
      id: `settlement_${Date.now()}`,
      splitExpenseId,
      fromUserId,
      toUserId,
      amount,
      currency: 'INR',
      settled: true,
      settledAt: new Date(),
      createdAt: new Date(),
    });

    updateSplitExpense(splitExpenseId, { status: 'settled' });
    success('Settlement recorded successfully');
  };

  const handleExportCSV = () => {
    if (filteredExpenses.length === 0) {
      error('No split expenses to export');
      return;
    }

    let csv = 'Description,Total Amount,Date,Status,Participants,Currency\n';
    filteredExpenses.forEach((exp) => {
      const date = exp.date instanceof Date ? exp.date.toLocaleDateString() : new Date(exp.date).toLocaleDateString();
      const participantNames = exp.participants.map((p) => p.name).join('; ');
      csv += `"${exp.description}","${exp.totalAmount}","${date}","${exp.status}","${participantNames}","${exp.currency}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `split_expenses_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Split expenses exported to CSV');
  };

  return (
    <PageWrapper>
      <div className="py-4 sm:py-6 md:py-8">
        <div className="mb-block">
          <h1 className="heading-page">💸 Expense Splitting</h1>
          <p className="text-secondary">Split expenses with friends and track settlements</p>
        </div>

        <div className="flex gap-3 mb-block flex-wrap">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary px-8 shadow-lg shadow-blue-500/20"
          >
            + Create Split Expense
          </button>
          <button
            onClick={handleExportCSV}
            className="btn btn-secondary border-green-500/20 hover:border-green-500/40 text-green-400"
          >
            📥 Export CSV
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-2 sm:gap-3 md:gap-4 mb-block">
          <input
            type="text"
            placeholder="Search split expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input flex-1"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'settled' | 'partial')}
            className="form-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="settled">Settled</option>
            <option value="partial">Partial</option>
          </select>
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="w-full animate-slide-up mb-block">
            <div className="card p-4 md:p-6 border-2 border-blue-500/50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
              <div className="border-b border-slate-700 pb-4 mb-4 flex justify-between items-center text-white">
                <h2 className="text-xl md:text-2xl font-bold">Create Split Expense</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSplit} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g., Dinner at restaurant"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Amount</label>
                  <input
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, totalAmount: e.target.value }))}
                    placeholder="0.00"
                    step="0.01"
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="form-label mb-3">Participants</label>
                  <div className="space-y-3">
                    {formData.participants.map((participant, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-3 p-3 bg-slate-800/50 rounded-xl sm:bg-transparent sm:p-0">
                        <div className="flex flex-col flex-1 gap-2">
                          <input
                            type="text"
                            value={participant.name}
                            onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                            placeholder="Name"
                            className="form-input w-full"
                          />
                          <div className="flex gap-2">
                            <input
                              type="email"
                              value={participant.email}
                              onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                              placeholder="Email (optional)"
                              className="flex-1 form-input text-xs"
                            />
                            <input
                              type="number"
                              value={participant.amount}
                              onChange={(e) => handleParticipantChange(index, 'amount', e.target.value)}
                              placeholder="Amount"
                              step="0.01"
                              className="w-24 form-input text-xs"
                            />
                          </div>
                        </div>
                        {formData.participants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveParticipant(index)}
                            className="btn btn-danger btn-small self-end sm:self-center"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleAddParticipant}
                    className="mt-3 px-3 md:px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors text-xs md:text-sm"
                  >
                    + Add Participant
                  </button>
                </div>

                <div className="flex gap-2 sm:gap-3 pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Create Split
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {filteredExpenses.length > 0 ? (
          <div className="grid-responsive-3 mb-block">
            {filteredExpenses.map((expense) => {
              const date = expense.date instanceof Date ? expense.date.toLocaleDateString() : new Date(expense.date).toLocaleDateString();
              const statusColor = {
                pending: 'bg-yellow-600',
                settled: 'bg-green-600',
                partial: 'bg-blue-600',
              };

              return (
                <div key={expense.id} className="card">
                  <div className="flex justify-between items-start mb-2 sm:mb-4">
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-lg md:text-xl font-bold text-white truncate">{expense.description}</h3>
                      <p className="text-[10px] sm:text-xs text-tertiary mt-0.5">{date}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold text-white ${statusColor[expense.status]}`}>
                      {expense.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 text-xs md:text-sm text-secondary">
                    <p>
                      <span className="text-tertiary">Total:</span> ₹
                      {expense.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </p>
                    <p>
                      <span className="text-tertiary">Participants:</span> {expense.participants.length}
                    </p>
                  </div>

                  <div className="mb-4 bg-slate-800/50 rounded-xl p-2 sm:p-3 border border-slate-700/30">
                    <p className="text-[10px] sm:text-xs font-semibold text-blue-400 mb-2">Split Details:</p>
                    <div className="space-y-1 text-[10px] sm:text-xs text-slate-400">
                      {expense.participants.map((p, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{p.name}</span>
                          <span className="text-slate-300">₹{p.amount.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-1 pt-3 border-t border-slate-700/50">
                    {expense.status === 'pending' && (
                      <button
                        onClick={() =>
                          handleSettleUp(
                            expense.id,
                            expense.participants[0].userId,
                            expense.participants[1].userId,
                            expense.totalAmount
                          )
                        }
                        className="btn btn-success p-1 flex-1 text-[10px] sm:text-sm"
                        title="Settle Up"
                      >
                        ✅
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="btn btn-danger p-1 flex-1 text-[10px] sm:text-sm"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card text-center">
            <p className="text-secondary">
              {splitExpenses.length === 0
                ? 'No split expenses yet. Create one to get started!'
                : 'No split expenses match your search.'}
            </p>
          </div>
        )}

        {filteredExpenses.length > 0 && (
          <div className="card mt-block">
            <p className="text-secondary">
              Showing <span className="font-semibold text-white">{filteredExpenses.length}</span> of{' '}
              <span className="font-semibold text-white">{splitExpenses.length}</span> split expenses
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}


