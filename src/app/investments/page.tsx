'use client';

export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/lib/toastContext';
import PageWrapper from '@/components/PageWrapper';
import EditInvestmentModal from '@/components/EditInvestmentModal';
import InvestmentAnalytics from '@/components/InvestmentAnalytics';

export default function InvestmentsPage() {
  const { investments, removeInvestment, addInvestment } = useAppStore();
  const { success, error } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'stock' as const,
    initialAmount: '',
    currentValue: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    quantity: '',
    unitPrice: '',
    notes: '',
  });

  const investmentTypes = ['stock', 'mutual_fund', 'crypto', 'real_estate', 'gold', 'bonds', 'other'];

  const filteredInvestments = useMemo(() => {
    return investments.filter((investment) => {
      const matchesSearch = investment.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = !filterType || investment.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [investments, searchTerm, filterType]);

  const kpiStats = useMemo(() => {
    const totalInvested = investments.reduce((sum, inv) => sum + inv.initialAmount, 0);
    const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalGainLoss = totalCurrentValue - totalInvested;
    const totalReturnPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    return {
      totalInvestments: investments.length,
      totalInvested,
      totalCurrentValue,
      totalGainLoss,
      totalReturnPercent,
    };
  }, [investments]);

  const handleEdit = (investment: typeof investments[0]) => {
    setSelectedInvestment(investment);
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
      if (!formData.name || !formData.type || !formData.initialAmount || !formData.currentValue || !formData.purchaseDate) {
        error('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      const initialAmount = parseFloat(formData.initialAmount);
      const currentValue = parseFloat(formData.currentValue);
      const quantity = formData.quantity ? parseFloat(formData.quantity) : 1;
      const unitPrice = formData.unitPrice ? parseFloat(formData.unitPrice) : initialAmount / quantity;

      if (isNaN(initialAmount) || initialAmount <= 0 || isNaN(currentValue) || currentValue <= 0) {
        error('Amounts must be valid positive numbers');
        setIsLoading(false);
        return;
      }

      const newInvestment = {
        id: `investment_${Date.now()}`,
        name: formData.name,
        type: formData.type,
        initialAmount,
        currentValue,
        purchaseDate: new Date(formData.purchaseDate),
        quantity,
        unitPrice,
        notes: formData.notes || undefined,
      };

      addInvestment(newInvestment);
      success('Investment added successfully');

      setFormData({
        name: '',
        type: 'stock',
        initialAmount: '',
        currentValue: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        quantity: '',
        unitPrice: '',
        notes: '',
      });

      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error adding investment:', err);
      error('Failed to add investment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this investment?')) {
      removeInvestment(id);
      success('Investment deleted successfully');
    }
  };

  const handleExportCSV = () => {
    if (filteredInvestments.length === 0) {
      error('No investments to export');
      return;
    }

    let csv = 'Name,Type,Initial Amount,Current Value,Gain/Loss,Return %,Purchase Date,Quantity,Unit Price\n';

    filteredInvestments.forEach((inv) => {
      const gainLoss = inv.currentValue - inv.initialAmount;
      const returnPercent = (gainLoss / inv.initialAmount) * 100;
      const purchaseDate = inv.purchaseDate instanceof Date
        ? inv.purchaseDate.toISOString().split('T')[0]
        : new Date(inv.purchaseDate).toISOString().split('T')[0];

      csv += `"${inv.name}","${inv.type}",${inv.initialAmount},${inv.currentValue},${gainLoss},${returnPercent.toFixed(2)},"${purchaseDate}",${inv.quantity},${inv.unitPrice}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investments_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Investments exported to CSV');
  };

  const handleExportTXT = () => {
    if (filteredInvestments.length === 0) {
      error('No investments to export');
      return;
    }

    let txt = 'INVESTMENT PORTFOLIO REPORT\n';
    txt += `Generated: ${new Date().toLocaleString()}\n`;
    txt += '='.repeat(80) + '\n\n';

    filteredInvestments.forEach((inv) => {
      const gainLoss = inv.currentValue - inv.initialAmount;
      const returnPercent = (gainLoss / inv.initialAmount) * 100;
      const purchaseDate = inv.purchaseDate instanceof Date
        ? inv.purchaseDate.toLocaleDateString()
        : new Date(inv.purchaseDate).toLocaleDateString();

      txt += `Investment: ${inv.name}\n`;
      txt += `Type: ${inv.type.replace('_', ' ').toUpperCase()}\n`;
      txt += `Purchase Date: ${purchaseDate}\n`;
      txt += `Initial Amount: ₹${inv.initialAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
      txt += `Current Value: ₹${inv.currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
      txt += `Gain/Loss: ₹${gainLoss.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;
      txt += `Return: ${returnPercent.toFixed(2)}%\n`;
      txt += `Quantity: ${inv.quantity}\n`;
      txt += `Unit Price: ₹${inv.unitPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n`;

      if (inv.notes) {
        txt += `Notes: ${inv.notes}\n`;
      }

      txt += '\n' + '-'.repeat(80) + '\n\n';
    });

    const blob = new Blob([txt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investments_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    success('Investments exported to TXT');
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-3">
            <div>
              <h1 className="heading-page">📈 Investments</h1>
              <p className="text-secondary">Manage your investment portfolio</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex-1 md:flex-none btn btn-secondary"
              >
                {showAnalytics ? '📊 Hide' : '📊 Analytics'}
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex-1 md:flex-none btn btn-primary"
              >
                + Add
              </button>
            </div>
          </div>

          <div className="grid-responsive-4 mb-6 md:mb-8">
            <div className="card">
              <p className="text-slate-400 text-xs mb-1">Total</p>
              <p className="text-lg md:text-2xl font-bold text-blue-400">{kpiStats.totalInvestments}</p>
            </div>

            <div className="card">
              <p className="text-slate-400 text-xs mb-1">Invested</p>
              <p className="text-lg md:text-2xl font-bold text-purple-400">₹{(kpiStats.totalInvested / 100000).toFixed(1)}L</p>
            </div>

            <div className="card">
              <p className="text-slate-400 text-xs mb-1">Current</p>
              <p className="text-lg md:text-2xl font-bold text-blue-500">₹{(kpiStats.totalCurrentValue / 100000).toFixed(1)}L</p>
            </div>

            <div className="card">
              <p className="text-slate-400 text-xs mb-1">Gain/Loss</p>
              <p className={`text-lg md:text-2xl font-bold ${kpiStats.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ₹{(kpiStats.totalGainLoss / 100000).toFixed(1)}L
              </p>
            </div>
          </div>

          <div className="flex gap-2 mb-4 md:mb-6 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="btn btn-success"
            >
              📥 CSV
            </button>
            <button
              onClick={handleExportTXT}
              className="btn btn-secondary"
            >
              📥 TXT
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6">
            <input
              type="text"
              placeholder="Search investments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-select"
            >
              <option value="">All Types</option>
              {investmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {showAnalytics && investments.length > 0 && (
            <div className="mb-6 md:mb-8">
              <InvestmentAnalytics investments={investments} />
            </div>
          )}

          <div className="space-y-2 md:space-y-3">
            {filteredInvestments.length > 0 ? (
              filteredInvestments.map((investment) => {
                const gainLoss = investment.currentValue - investment.initialAmount;
                const returnPercent = (gainLoss / investment.initialAmount) * 100;
                const purchaseDate = investment.purchaseDate instanceof Date
                  ? investment.purchaseDate.toLocaleDateString()
                  : new Date(investment.purchaseDate).toLocaleDateString();

                return (
                  <PageWrapper>
                    <div
                      key={investment.id}
                      className="card hover:border-slate-600"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm md:text-base truncate">{investment.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{investment.type.replace('_', ' ').toUpperCase()}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <p className="text-base md:text-lg font-bold text-blue-400">₹{(investment.currentValue / 100000).toFixed(1)}L</p>
                          <p className={`text-xs md:text-sm font-semibold ${returnPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {returnPercent.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs md:text-sm">
                        <div>
                          <p className="text-slate-400">Initial</p>
                          <p className="text-white font-semibold">₹{(investment.initialAmount / 100000).toFixed(1)}L</p>
                        </div>
                        <div>
                          <p className={`text-slate-400`}>Gain/Loss</p>
                          <p className={`font-semibold ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ₹{(gainLoss / 100000).toFixed(1)}L
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 mb-2">Purchased: {purchaseDate}</p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(investment)}
                          className="btn btn-primary flex-1"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(investment.id)}
                          className="btn btn-danger flex-1"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </PageWrapper>
                );
              })
            ) : (
              <div className="card text-center text-slate-400">
                <p className="text-sm md:text-base">{investments.length === 0 ? 'No investments yet' : 'No investments match your search'}</p>
              </div>
            )}
          </div>

          {isAddModalOpen && (
            <div className="mb-6 md:mb-8 w-full animate-slide-up">
              <div className="card p-4 md:p-6 border-2 border-blue-500/50 bg-gradient-to-br from-slate-800/95 to-slate-900/95 w-full max-w-2xl mx-auto">
                <div className="border-b border-slate-700 pb-4 mb-4 flex justify-between items-center">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Add Investment</h2>
                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setFormData({
                        name: '',
                        type: 'stock',
                        initialAmount: '',
                        currentValue: '',
                        purchaseDate: new Date().toISOString().split('T')[0],
                        quantity: '',
                        unitPrice: '',
                        notes: '',
                      });
                    }}
                    className="text-slate-400 hover:text-white text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Apple Stock"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-xs md:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">
                      Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-xs md:text-sm"
                      required
                    >
                      {investmentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">
                      Purchase Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 text-xs md:text-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">
                        Initial <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="initialAmount"
                        value={formData.initialAmount}
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
                        Current <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="currentValue"
                        value={formData.currentValue}
                        onChange={handleChange}
                        placeholder="Value"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-xs md:text-sm"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Units"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 text-xs md:text-sm"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-300 mb-1">Unit Price</label>
                      <input
                        type="number"
                        name="unitPrice"
                        value={formData.unitPrice}
                        onChange={handleChange}
                        placeholder="Price"
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
                          type: 'stock',
                          initialAmount: '',
                          currentValue: '',
                          purchaseDate: new Date().toISOString().split('T')[0],
                          quantity: '',
                          unitPrice: '',
                          notes: '',
                        });
                      }}
                      className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition font-medium text-xs md:text-sm disabled:opacity-50"
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

          {selectedInvestment && (
            <EditInvestmentModal
              investment={selectedInvestment}
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setSelectedInvestment(null);
              }}
            />
          )}
        </div>
      </div>
    </PageWrapper>
  );
}


