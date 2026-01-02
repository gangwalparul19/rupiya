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
        <div className="mb-section">
          <h1 className="heading-page">Payment Methods</h1>
          <p className="text-secondary">Manage your cards, UPI, bank accounts, and wallets</p>
        </div>

        {/* Dashboard KPIs */}
        <div className="grid-responsive-4 mb-section">
          <div className="kpi-card border-blue-500/20">
            <p className="kpi-label text-blue-400">Cards</p>
            <p className="kpi-value text-white">{cards.length}</p>
            <p className="kpi-subtitle text-slate-400">Total Cards</p>
          </div>
          <div className="kpi-card border-purple-500/20">
            <p className="kpi-label text-purple-400">UPI</p>
            <p className="kpi-value text-white">{upiAccounts.length}</p>
            <p className="kpi-subtitle text-slate-400">UPI Handles</p>
          </div>
          <div className="kpi-card border-green-500/20">
            <p className="kpi-label text-green-400">Bank</p>
            <p className="kpi-value text-white">{bankAccounts.length}</p>
            <p className="kpi-subtitle text-slate-400">Accounts</p>
          </div>
          <div className="kpi-card border-orange-500/20">
            <p className="kpi-label text-orange-400">Wallet</p>
            <p className="kpi-value text-white">{wallets.length}</p>
            <p className="kpi-subtitle text-slate-400">Active Wallets</p>
          </div>
        </div>

        {/* Tabs - Professional UI */}
        <div className="flex gap-6 mb-block border-b border-slate-700/50 overflow-x-auto no-scrollbar">
          {(['cards', 'upi', 'bank', 'wallet'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setExpandedForm(false);
              }}
              className={`pb-4 px-1 font-bold text-sm md:text-base whitespace-nowrap transition-all relative ${activeTab === tab
                ? 'text-blue-400'
                : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              {tab === 'cards' && 'Cards'}
              {tab === 'upi' && 'UPI'}
              {tab === 'bank' && 'Bank'}
              {tab === 'wallet' && 'Wallet'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              )}
            </button>
          ))}
        </div>

        {/* Cards Tab */}
        {activeTab === 'cards' && (
          <div className="space-y-4 md:space-y-6">
            {/* Add Card Form */}
            <div className="card overflow-hidden">
              <button
                onClick={() => setExpandedForm(!expandedForm)}
                className="w-full py-2 flex items-center justify-between transition"
              >
                <h2 className="text-lg md:text-xl font-bold text-white">Add Card</h2>
                <span className={`text-xl transition-transform ${expandedForm ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {expandedForm && (
                <form onSubmit={handleAddCard} className="pt-6 mt-6 border-t border-slate-700/50 space-y-4">
                  <div>
                    <label className="form-label">Card Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="e.g., My Visa"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Card Number (Last 4 Digits)</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234"
                      maxLength={4}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 btn btn-primary"
                    >
                      Add Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedForm(false)}
                      className="flex-1 btn btn-secondary"
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
                  <div key={card.id} className="card bg-gradient-to-br from-blue-600/20 to-blue-800/10 border-blue-500/20">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-lg font-bold text-white">{card.cardName}</h3>
                      <span className="text-2xl opacity-80">💳</span>
                    </div>
                    <p className="text-slate-300 font-mono tracking-widest mb-6">•••• •••• •••• {card.cardNumber}</p>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this card?')) {
                          removeCard(card.id);
                          showToast('Card deleted', 'success');
                        }
                      }}
                      className="w-full btn btn-danger btn-small"
                    >
                      Delete Card
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
            <div className="card overflow-hidden">
              <button
                onClick={() => setExpandedForm(!expandedForm)}
                className="w-full py-2 flex items-center justify-between transition"
              >
                <h2 className="text-lg md:text-xl font-bold text-white">Add UPI</h2>
                <span className={`text-xl transition-transform ${expandedForm ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {expandedForm && (
                <form onSubmit={handleAddUPI} className="pt-6 mt-6 border-t border-slate-700/50 space-y-4">
                  <div>
                    <label className="form-label">UPI Name</label>
                    <input
                      type="text"
                      name="upiName"
                      value={formData.upiName}
                      onChange={handleChange}
                      placeholder="e.g., Google Pay"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">UPI Handle</label>
                    <input
                      type="text"
                      name="upiHandle"
                      value={formData.upiHandle}
                      onChange={handleChange}
                      placeholder="user@upi"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 btn btn-primary">Add UPI</button>
                    <button type="button" onClick={() => setExpandedForm(false)} className="flex-1 btn btn-secondary">Cancel</button>
                  </div>
                </form>
              )}
            </div>

            {/* UPI List */}
            {upiAccounts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {upiAccounts.map((upi) => (
                  <div key={upi.id} className="card bg-gradient-to-br from-purple-600/20 to-purple-800/10 border-purple-500/20">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-white truncate">{upi.upiName}</h3>
                      <span className="text-xl opacity-80">📱</span>
                    </div>
                    <p className="text-slate-300 text-sm mb-6 truncate">{upi.upiHandle}</p>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this UPI handle?')) {
                          removeUPI(upi.id);
                          showToast('UPI deleted', 'success');
                        }
                      }}
                      className="w-full btn btn-danger btn-small"
                    >
                      Delete UPI
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
            <div className="card overflow-hidden">
              <button
                onClick={() => setExpandedForm(!expandedForm)}
                className="w-full py-2 flex items-center justify-between transition"
              >
                <h2 className="text-lg md:text-xl font-bold text-white">Add Bank</h2>
                <span className={`text-xl transition-transform ${expandedForm ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {expandedForm && (
                <form onSubmit={handleAddBank} className="pt-6 mt-6 border-t border-slate-700/50 space-y-4">
                  <div>
                    <label className="form-label">Bank Name</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      placeholder="Bank name"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Account Number (Last 4 Digits)</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleChange}
                      placeholder="1234"
                      maxLength={4}
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">IFSC Code</label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleChange}
                      placeholder="IFSC code"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 btn btn-primary">Add Bank</button>
                    <button type="button" onClick={() => setExpandedForm(false)} className="flex-1 btn btn-secondary">Cancel</button>
                  </div>
                </form>
              )}
            </div>

            {/* Bank List */}
            {bankAccounts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {bankAccounts.map((bank) => (
                  <div key={bank.id} className="card bg-gradient-to-br from-green-600/20 to-green-800/10 border-green-500/20">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-white truncate">{bank.bankName}</h3>
                      <span className="text-xl opacity-80">🏦</span>
                    </div>
                    <p className="text-slate-300 font-mono tracking-widest mb-1">•••• {bank.accountNumber}</p>
                    <p className="text-slate-400 text-xs mb-6 uppercase tracking-wider">{bank.ifscCode}</p>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this bank account?')) {
                          removeBankAccount(bank.id);
                          showToast('Bank account deleted', 'success');
                        }
                      }}
                      className="w-full btn btn-danger btn-small"
                    >
                      Delete Account
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
            <div className="card overflow-hidden">
              <button
                onClick={() => setExpandedForm(!expandedForm)}
                className="w-full py-2 flex items-center justify-between transition"
              >
                <h2 className="text-lg md:text-xl font-bold text-white">Add Wallet</h2>
                <span className={`text-xl transition-transform ${expandedForm ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {expandedForm && (
                <form onSubmit={handleAddWallet} className="pt-6 mt-6 border-t border-slate-700/50 space-y-4">
                  <div>
                    <label className="form-label">Wallet Name</label>
                    <input
                      type="text"
                      name="walletName"
                      value={formData.walletName}
                      onChange={handleChange}
                      placeholder="Wallet name"
                      className="form-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Type</label>
                    <select
                      name="walletType"
                      value={formData.walletType}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                      <option value="bank">Bank</option>
                      <option value="wallet">Digital Wallet</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Initial Balance (Optional)</label>
                    <input
                      type="number"
                      name="walletBalance"
                      value={formData.walletBalance}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="form-input"
                      step="0.01"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 btn btn-primary">Add Wallet</button>
                    <button type="button" onClick={() => setExpandedForm(false)} className="flex-1 btn btn-secondary">Cancel</button>
                  </div>
                </form>
              )}
            </div>

            {/* Wallet List */}
            {wallets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {wallets.map((wallet) => (
                  <div key={wallet.id} className="card bg-gradient-to-br from-orange-600/20 to-orange-800/10 border-orange-500/20">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-white truncate">{wallet.name}</h3>
                      <span className="text-xl opacity-80">👛</span>
                    </div>
                    <p className="text-slate-300 text-sm mb-1 capitalize">{wallet.type}</p>
                    {wallet.balance !== undefined && wallet.balance > 0 && (
                      <p className="text-green-400 text-lg font-bold mb-6">₹{wallet.balance.toLocaleString('en-IN')}</p>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this wallet?')) {
                          removeWallet(wallet.id);
                          showToast('Wallet deleted', 'success');
                        }
                      }}
                      className="w-full btn btn-danger btn-small"
                    >
                      Delete Wallet
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


