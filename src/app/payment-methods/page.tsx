'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import PageWrapper from '@/components/PageWrapper';

export default function PaymentMethodsPage() {
  const { cards, upiAccounts, bankAccounts, wallets, addCard, removeCard, addUPI, removeUPI, addBankAccount, removeBankAccount, addWallet, removeWallet } = useAppStore();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'cards' | 'upi' | 'bank' | 'wallet'>('cards');
  const [expandedForm, setExpandedForm] = useState(false);
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    upiName: '',
    upiHandle: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    walletName: '',
    walletType: 'cash' as const,
    walletBalance: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cardName || !formData.cardNumber) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    addCard({
      id: `card_${Date.now()}`,
      cardName: formData.cardName,
      cardNumber: formData.cardNumber,
    });
    showToast('Card added successfully', 'success');
    setFormData({ ...formData, cardName: '', cardNumber: '' });
    setExpandedForm(false);
  };

  const handleAddUPI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.upiName || !formData.upiHandle) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    addUPI({
      id: `upi_${Date.now()}`,
      upiName: formData.upiName,
      upiHandle: formData.upiHandle,
    });
    showToast('UPI account added successfully', 'success');
    setFormData({ ...formData, upiName: '', upiHandle: '' });
    setExpandedForm(false);
  };

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bankName || !formData.accountNumber || !formData.ifscCode) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    addBankAccount({
      id: `bank_${Date.now()}`,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      ifscCode: formData.ifscCode,
    });
    showToast('Bank account added successfully', 'success');
    setFormData({ ...formData, bankName: '', accountNumber: '', ifscCode: '' });
    setExpandedForm(false);
  };

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.walletName) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    addWallet({
      id: `wallet_${Date.now()}`,
      name: formData.walletName,
      type: formData.walletType,
      balance: formData.walletBalance ? parseFloat(formData.walletBalance) : 0,
      createdAt: new Date(),
    });
    showToast('Wallet added successfully', 'success');
    setFormData({ ...formData, walletName: '', walletBalance: '' });
    setExpandedForm(false);
  };

  return (
    <PageWrapper>
      <div className="py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="heading-page">Payment Methods</h1>
          <p className="text-secondary">Manage your cards, UPI, bank accounts, and wallets</p>
        </div>

        {/* Tabs - Mobile optimized */}
        <div className="flex gap-1 md:gap-2 mb-6 overflow-x-auto border-b border-slate-700 pb-0">
          {(['cards', 'upi', 'bank', 'wallet'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 md:px-4 py-2 md:py-3 font-medium text-sm md:text-base whitespace-nowrap transition-colors ${activeTab === tab
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-400 hover:text-slate-300'
                }`}
            >
              {tab === 'cards' && '💳 Cards'}
              {tab === 'upi' && '📱 UPI'}
              {tab === 'bank' && '🏦 Bank'}
              {tab === 'wallet' && '👛 Wallet'}
            </button>
          ))}
        </div>

        {/* Cards Tab */}
        {activeTab === 'cards' && (
          <div className="space-y-4 md:space-y-6">
            {/* Add Card Form */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <button
                onClick={() => setExpandedForm(!expandedForm)}
                className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between hover:bg-slate-700 transition"
              >
                <h2 className="text-lg md:text-xl font-bold text-white">Add Card</h2>
                <span className={`text-2xl transition-transform ${expandedForm ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {expandedForm && (
                <form onSubmit={handleAddCard} className="px-4 md:px-6 py-4 md:py-6 border-t border-slate-700 space-y-3 md:space-y-4">
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    placeholder="Card name (e.g., My Visa)"
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    required
                  />
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="Card number (last 4 digits)"
                    maxLength={4}
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    required
                  />
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm md:text-base"
                    >
                      Add Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedForm(false)}
                      className="flex-1 px-4 py-2 md:py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium text-sm md:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Cards List */}
            {cards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {cards.map((card) => (
                  <div key={card.id} className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4 md:p-6 text-white">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg md:text-xl font-bold">{card.cardName}</h3>
                      <span className="text-2xl">💳</span>
                    </div>
                    <p className="text-slate-200 text-sm md:text-base mb-4">•••• {card.cardNumber}</p>
                    <button
                      onClick={() => {
                        removeCard(card.id);
                        showToast('Card deleted', 'success');
                      }}
                      className="w-full px-3 py-2 text-sm md:text-base bg-red-600 hover:bg-red-700 text-white rounded transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800 rounded-lg p-6 md:p-8 text-center border border-slate-700">
                <p className="text-slate-400 text-sm md:text-base">No cards added yet. Add one to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* UPI Tab */}
        {activeTab === 'upi' && (
          <div className="space-y-4 md:space-y-6">
            {/* Add UPI Form */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <button
                onClick={() => setExpandedForm(!expandedForm)}
                className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between hover:bg-slate-700 transition"
              >
                <h2 className="text-lg md:text-xl font-bold text-white">Add UPI Account</h2>
                <span className={`text-2xl transition-transform ${expandedForm ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {expandedForm && (
                <form onSubmit={handleAddUPI} className="px-4 md:px-6 py-4 md:py-6 border-t border-slate-700 space-y-3 md:space-y-4">
                  <input
                    type="text"
                    name="upiName"
                    value={formData.upiName}
                    onChange={handleChange}
                    placeholder="UPI name (e.g., My Google Pay)"
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    required
                  />
                  <input
                    type="text"
                    name="upiHandle"
                    value={formData.upiHandle}
                    onChange={handleChange}
                    placeholder="UPI handle (e.g., user@upi)"
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    required
                  />
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm md:text-base"
                    >
                      Add UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedForm(false)}
                      className="flex-1 px-4 py-2 md:py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium text-sm md:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* UPI List */}
            {upiAccounts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {upiAccounts.map((upi) => (
                  <div key={upi.id} className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-4 md:p-6 text-white">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg md:text-xl font-bold">{upi.upiName}</h3>
                      <span className="text-2xl">📱</span>
                    </div>
                    <p className="text-slate-200 text-sm md:text-base mb-4 break-all">{upi.upiHandle}</p>
                    <button
                      onClick={() => {
                        removeUPI(upi.id);
                        showToast('UPI deleted', 'success');
                      }}
                      className="w-full px-3 py-2 text-sm md:text-base bg-red-600 hover:bg-red-700 text-white rounded transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800 rounded-lg p-6 md:p-8 text-center border border-slate-700">
                <p className="text-slate-400 text-sm md:text-base">No UPI accounts added yet. Add one to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* Bank Tab */}
        {activeTab === 'bank' && (
          <div className="space-y-4 md:space-y-6">
            {/* Add Bank Form */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <button
                onClick={() => setExpandedForm(!expandedForm)}
                className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between hover:bg-slate-700 transition"
              >
                <h2 className="text-lg md:text-xl font-bold text-white">Add Bank Account</h2>
                <span className={`text-2xl transition-transform ${expandedForm ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {expandedForm && (
                <form onSubmit={handleAddBank} className="px-4 md:px-6 py-4 md:py-6 border-t border-slate-700 space-y-3 md:space-y-4">
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="Bank name"
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    required
                  />
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Account number (last 4 digits)"
                    maxLength={4}
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    required
                  />
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleChange}
                    placeholder="IFSC code"
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    required
                  />
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm md:text-base"
                    >
                      Add Bank
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedForm(false)}
                      className="flex-1 px-4 py-2 md:py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium text-sm md:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Bank List */}
            {bankAccounts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {bankAccounts.map((bank) => (
                  <div key={bank.id} className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-4 md:p-6 text-white">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg md:text-xl font-bold">{bank.bankName}</h3>
                      <span className="text-2xl">🏦</span>
                    </div>
                    <p className="text-slate-200 text-sm md:text-base mb-2">•••• {bank.accountNumber}</p>
                    <p className="text-slate-300 text-xs md:text-sm mb-4">{bank.ifscCode}</p>
                    <button
                      onClick={() => {
                        removeBankAccount(bank.id);
                        showToast('Bank account deleted', 'success');
                      }}
                      className="w-full px-3 py-2 text-sm md:text-base bg-red-600 hover:bg-red-700 text-white rounded transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800 rounded-lg p-6 md:p-8 text-center border border-slate-700">
                <p className="text-slate-400 text-sm md:text-base">No bank accounts added yet. Add one to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* Wallet Tab */}
        {activeTab === 'wallet' && (
          <div className="space-y-4 md:space-y-6">
            {/* Add Wallet Form */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <button
                onClick={() => setExpandedForm(!expandedForm)}
                className="w-full px-4 md:px-6 py-3 md:py-4 flex items-center justify-between hover:bg-slate-700 transition"
              >
                <h2 className="text-lg md:text-xl font-bold text-white">Add Wallet</h2>
                <span className={`text-2xl transition-transform ${expandedForm ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {expandedForm && (
                <form onSubmit={handleAddWallet} className="px-4 md:px-6 py-4 md:py-6 border-t border-slate-700 space-y-3 md:space-y-4">
                  <input
                    type="text"
                    name="walletName"
                    value={formData.walletName}
                    onChange={handleChange}
                    placeholder="Wallet name"
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    required
                  />
                  <select
                    name="walletType"
                    value={formData.walletType}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                    <option value="bank">Bank</option>
                    <option value="wallet">Wallet</option>
                  </select>
                  <input
                    type="number"
                    name="walletBalance"
                    value={formData.walletBalance}
                    onChange={handleChange}
                    placeholder="Balance (optional)"
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    step="0.01"
                  />
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm md:text-base"
                    >
                      Add Wallet
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedForm(false)}
                      className="flex-1 px-4 py-2 md:py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium text-sm md:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Wallet List */}
            {wallets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {wallets.map((wallet) => (
                  <div key={wallet.id} className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-4 md:p-6 text-white">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg md:text-xl font-bold">{wallet.name}</h3>
                      <span className="text-2xl">👛</span>
                    </div>
                    <p className="text-slate-200 text-sm md:text-base mb-2 capitalize">{wallet.type}</p>
                    {wallet.balance !== undefined && wallet.balance > 0 && (
                      <p className="text-green-300 text-sm md:text-base font-semibold mb-4">₹{wallet.balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                    )}
                    <button
                      onClick={() => {
                        removeWallet(wallet.id);
                        showToast('Wallet deleted', 'success');
                      }}
                      className="w-full px-3 py-2 text-sm md:text-base bg-red-600 hover:bg-red-700 text-white rounded transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800 rounded-lg p-6 md:p-8 text-center border border-slate-700">
                <p className="text-slate-400 text-sm md:text-base">No wallets added yet. Add one to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}


