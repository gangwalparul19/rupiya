'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';

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
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Expense Splitting</h1>
          <p className="text-gray-400">Split expenses with friends and track settlements</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Split Expense
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            ↓ Export CSV
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search split expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'settled' | 'partial')}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="settled">Settled</option>
            <option value="partial">Partial</option>
          </select>
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-4">Create Split Expense</h2>

              <form onSubmit={handleAddSplit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="e.g., Dinner at restaurant"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Total Amount</label>
                  <input
                    type="number"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, totalAmount: e.target.value }))}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Participants</label>
                  <div className="space-y-3">
                    {formData.participants.map((participant, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={participant.name}
                          onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                          placeholder="Name"
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="email"
                          value={participant.email}
                          onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                          placeholder="Email (optional)"
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="number"
                          value={participant.amount}
                          onChange={(e) => handleParticipantChange(index, 'amount', e.target.value)}
                          placeholder="Amount (optional)"
                          step="0.01"
                          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                        {formData.participants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveParticipant(index)}
                            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
                    className="mt-3 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                  >
                    + Add Participant
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Create Split
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {filteredExpenses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExpenses.map((expense) => {
              const date = expense.date instanceof Date ? expense.date.toLocaleDateString() : new Date(expense.date).toLocaleDateString();
              const statusColor = {
                pending: 'bg-yellow-600',
                settled: 'bg-green-600',
                partial: 'bg-blue-600',
              };

              return (
                <div key={expense.id} className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{expense.description}</h3>
                      <p className="text-xs text-gray-400 mt-1">{date}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded text-white font-medium ${statusColor[expense.status]}`}>
                      {expense.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 text-sm text-gray-300">
                    <p>
                      <span className="text-gray-400">Total:</span> ₹
                      {expense.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </p>
                    <p>
                      <span className="text-gray-400">Participants:</span> {expense.participants.length}
                    </p>
                  </div>

                  <div className="mb-4 bg-gray-700 rounded p-3">
                    <p className="text-xs font-semibold text-gray-300 mb-2">Split Details:</p>
                    <div className="space-y-1 text-xs text-gray-400">
                      {expense.participants.map((p, idx) => (
                        <p key={idx}>
                          {p.name}: ₹{p.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-700">
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
                        className="flex-1 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Settle
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(expense.id)}
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
              {splitExpenses.length === 0
                ? 'No split expenses yet. Create one to get started!'
                : 'No split expenses match your search.'}
            </p>
          </div>
        )}

        {filteredExpenses.length > 0 && (
          <div className="mt-6 bg-gray-800 rounded-lg p-4">
            <p className="text-gray-300">
              Showing <span className="font-semibold text-white">{filteredExpenses.length}</span> of{' '}
              <span className="font-semibold text-white">{splitExpenses.length}</span> split expenses
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
