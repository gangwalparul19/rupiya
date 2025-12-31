'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { splitExpenseService, settlementService } from '@/lib/firebaseService';
import type { SplitExpense } from '@/lib/store';

export default function SplittingPage() {
  const router = useRouter();
  const { error: showError } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'splits' | 'settlements'>('splits');

  const user = useAppStore((state) => state.user);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const splitExpenses = useAppStore((state) => state.splitExpenses);
  const settlements = useAppStore((state) => state.settlements);
  const setSplitExpenses = useAppStore((state) => state.setSplitExpenses);
  const setSettlements = useAppStore((state) => state.setSettlements);
  const addSplitExpense = useAppStore((state) => state.addSplitExpense);
  const removeSplitExpense = useAppStore((state) => state.removeSplitExpense);
  const updateSettlement = useAppStore((state) => state.updateSettlement);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const loadData = async () => {
      if (user?.uid) {
        try {
          const [splitsData, settlementsData] = await Promise.all([
            splitExpenseService.getAll(user.uid),
            settlementService.getAll(user.uid),
          ]);
          setSplitExpenses(splitsData);
          setSettlements(settlementsData);
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [user, isAuthenticated, router, setSplitExpenses, setSettlements]);

  const handleAddSplitExpense = async (formData: Omit<SplitExpense, 'id'>) => {
    if (!user) return;

    try {
      const splitExpenseId = await splitExpenseService.create({
        ...formData,
        id: Date.now().toString(),
        createdBy: user.uid,
        createdAt: new Date(),
      }, user.uid);
      addSplitExpense({
        ...formData,
        id: splitExpenseId,
        createdBy: user.uid,
        createdAt: new Date(),
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding split expense:', error);
    }
  };

  const handleDeleteSplitExpense = async (splitExpenseId: string) => {
    if (!user) return;

    try {
      await splitExpenseService.delete(user.uid, splitExpenseId);
      removeSplitExpense(splitExpenseId);
    } catch (error) {
      console.error('Error deleting split expense:', error);
    }
  };

  const handleSettleUp = async (settlementId: string) => {
    if (!user) return;

    try {
      await settlementService.update(user.uid, settlementId, {
        settled: true,
        settledAt: new Date(),
      });
      updateSettlement(settlementId, {
        settled: true,
        settledAt: new Date(),
      });
    } catch (error) {
      console.error('Error settling up:', error);
    }
  };

  const calculateTotalOwed = () => {
    return settlements
      .filter((s) => !s.settled && s.fromUserId === user?.uid)
      .reduce((sum, s) => sum + s.amount, 0);
  };

  const calculateTotalToReceive = () => {
    return settlements
      .filter((s) => !s.settled && s.toUserId === user?.uid)
      .reduce((sum, s) => sum + s.amount, 0);
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-2xl font-bold text-white">💸 Expense Splitting</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg transition font-semibold whitespace-nowrap text-sm md:text-base"
          >
            + Split Expense
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
          <div className="bg-slate-700 rounded-lg p-4 md:p-6 text-white">
            <p className="text-slate-300 text-xs md:text-sm">Total Splits</p>
            <p className="text-2xl md:text-3xl font-bold">{splitExpenses.length}</p>
          </div>
          <div className="bg-red-700 rounded-lg p-4 md:p-6 text-white">
            <p className="text-slate-300 text-xs md:text-sm">You Owe</p>
            <p className="text-2xl md:text-3xl font-bold">₹{calculateTotalOwed().toFixed(2)}</p>
          </div>
          <div className="bg-green-700 rounded-lg p-4 md:p-6 text-white">
            <p className="text-slate-300 text-xs md:text-sm">To Receive</p>
            <p className="text-2xl md:text-3xl font-bold">₹{calculateTotalToReceive().toFixed(2)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('splits')}
            className={`px-6 py-2 rounded-lg transition font-semibold ${
              activeTab === 'splits'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Split Expenses ({splitExpenses.length})
          </button>
          <button
            onClick={() => setActiveTab('settlements')}
            className={`px-6 py-2 rounded-lg transition font-semibold ${
              activeTab === 'settlements'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Settlements ({settlements.filter((s) => !s.settled).length})
          </button>
        </div>

        {/* Split Expenses Tab */}
        {activeTab === 'splits' && (
          <div className="space-y-3">
            {isLoading ? (
              <div className="bg-slate-700 rounded-lg p-8 text-center text-slate-300">
                <p className="text-lg">Loading split expenses...</p>
              </div>
            ) : splitExpenses.length === 0 ? (
              <div className="bg-slate-700 rounded-lg p-8 text-center text-slate-300">
                <p className="text-lg">No split expenses yet</p>
                <p className="text-sm mt-2">Create your first split expense to get started</p>
              </div>
            ) : (
              splitExpenses.map((split) => (
                <div
                  key={split.id}
                  className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-white text-lg">{split.description}</p>
                      <p className="text-sm text-slate-400">
                        {new Date(split.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        ₹{split.totalAmount.toFixed(2)}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded text-xs font-semibold mt-1 ${
                          split.status === 'settled'
                            ? 'bg-green-600 text-white'
                            : split.status === 'partial'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {split.status}
                      </span>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="bg-slate-800 rounded p-3 mb-3">
                    <p className="text-sm text-slate-300 font-semibold mb-2">Participants:</p>
                    <div className="space-y-1">
                      {split.participants.map((participant, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-slate-300">
                          <span>{participant.name}</span>
                          <span className="font-semibold">
                            ₹{participant.amount.toFixed(2)}
                            {participant.settled && ' ✓'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSplitExpense(split.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Settlements Tab */}
        {activeTab === 'settlements' && (
          <div className="space-y-3">
            {isLoading ? (
              <div className="bg-slate-700 rounded-lg p-8 text-center text-slate-300">
                <p className="text-lg">Loading settlements...</p>
              </div>
            ) : settlements.length === 0 ? (
              <div className="bg-slate-700 rounded-lg p-8 text-center text-slate-300">
                <p className="text-lg">No settlements</p>
                <p className="text-sm mt-2">All expenses are settled!</p>
              </div>
            ) : (
              settlements.map((settlement) => (
                <div
                  key={settlement.id}
                  className={`bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition ${
                    settlement.settled ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">
                        {settlement.fromUserId === user?.uid ? 'You owe' : 'You are owed'}
                      </p>
                      <p className="text-sm text-slate-400">
                        {settlement.settled ? 'Settled' : 'Pending'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        ₹{settlement.amount.toFixed(2)}
                      </p>
                      {!settlement.settled && settlement.fromUserId === user?.uid && (
                        <button
                          onClick={() => handleSettleUp(settlement.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition mt-2"
                        >
                          Mark Settled
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Add Split Expense Modal */}
      {isModalOpen && (
        <SplitExpenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddSplitExpense={handleAddSplitExpense}
          showError={showError}
        />
      )}
    </main>
    </ProtectedRoute>
  );
}

// Split Expense Modal Component
function SplitExpenseModal({
  isOpen,
  onClose,
  onAddSplitExpense,
  showError,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddSplitExpense: (data: any) => void;
  showError: (message: string) => void;
}) {
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState<any[]>([
    { userId: '', name: '', email: '', amount: '', settled: false },
  ]);

  const handleAddParticipant = () => {
    setParticipants([
      ...participants,
      { userId: '', name: '', email: '', amount: '', settled: false },
    ]);
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleParticipantChange = (index: number, field: string, value: string) => {
    const updated = [...participants];
    updated[index][field] = value;
    setParticipants(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !totalAmount || participants.length === 0) {
      showError('Please fill in all required fields');
      return;
    }

    const validParticipants = participants.filter((p) => p.name && p.amount);
    if (validParticipants.length === 0) {
      showError('Please add at least one participant');
      return;
    }

    onAddSplitExpense({
      description,
      totalAmount: parseFloat(totalAmount),
      currency,
      date: new Date(date),
      participants: validParticipants.map((p) => ({
        ...p,
        amount: parseFloat(p.amount),
      })),
      status: 'pending',
    });

    // Reset form
    setDescription('');
    setTotalAmount('');
    setCurrency('INR');
    setDate(new Date().toISOString().split('T')[0]);
    setParticipants([{ userId: '', name: '', email: '', amount: '', settled: false }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Split Expense</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Dinner at restaurant"
              className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Amount and Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Total Amount
              </label>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Participants
            </label>
            <div className="space-y-3 bg-slate-700 p-4 rounded-lg">
              {participants.map((participant, index) => (
                <div key={index} className="grid grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={participant.name}
                    onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                    placeholder="Name"
                    className="bg-slate-600 text-white px-3 py-2 rounded border border-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                  />
                  <input
                    type="email"
                    value={participant.email}
                    onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                    placeholder="Email"
                    className="bg-slate-600 text-white px-3 py-2 rounded border border-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                  />
                  <input
                    type="number"
                    value={participant.amount}
                    onChange={(e) => handleParticipantChange(index, 'amount', e.target.value)}
                    placeholder="Amount"
                    step="0.01"
                    className="bg-slate-600 text-white px-3 py-2 rounded border border-slate-500 focus:border-blue-500 focus:outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveParticipant(index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddParticipant}
                className="w-full bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded transition text-sm"
              >
                + Add Participant
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-2 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition font-semibold"
            >
              Create Split
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
